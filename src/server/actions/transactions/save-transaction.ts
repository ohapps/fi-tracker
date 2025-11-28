'use server';

import { Transaction, TransactionSchema } from '@/types/investments';
import { ActionResult } from '@/types/app';
import dbConnect from '@/server/db/connect';
import { TransactionModel, InvestmentModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { revalidatePath } from 'next/cache';

export async function saveTransaction(
    transaction: Transaction
): Promise<ActionResult> {
    try {
        const user = await getCurrentUser();

        const validation = TransactionSchema.safeParse(transaction);
        if (!validation.success) {
            return { success: false, error: 'Invalid transaction data' };
        }

        await dbConnect();

        if (transaction.id) {
            // Update existing transaction
            const existingTransaction = await TransactionModel.findById(
                transaction.id
            );
            if (!existingTransaction) {
                return { success: false, error: 'Transaction not found' };
            }

            const investment = await InvestmentModel.findById(
                existingTransaction.investmentId
            );
            if (!investment || investment.userId.toString() !== user._id.toString() || validation.data.investmentId !== existingTransaction.investmentId.toString()) {
                return { success: false, error: 'Investment not found or access denied' };
            }

            const [updatedTransaction] = await Promise.all([
                TransactionModel.findByIdAndUpdate(
                    transaction.id,
                    validation.data,
                    { new: true }
                ),
                InvestmentModel.findByIdAndUpdate(existingTransaction.investmentId, {
                    updatedAt: new Date()
                })
            ]);

            if (!updatedTransaction) {
                return { success: false, error: 'Transaction not found' };
            }
        } else {
            // Create new transaction
            if (!transaction.investmentId) {
                return { success: false, error: 'Investment ID is required' };
            }

            const investment = await InvestmentModel.findById(
                transaction.investmentId
            );
            if (!investment || investment.userId.toString() !== user._id.toString()) {
                return { success: false, error: 'Investment not found or access denied' };
            }

            await Promise.all([
                TransactionModel.create({
                    ...validation.data,
                    userId: user._id,
                }),
                InvestmentModel.findByIdAndUpdate(transaction.investmentId, {
                    updatedAt: new Date()
                })
            ]);
        }

        revalidatePath(`/investments/${transaction.investmentId}`);

        return { success: true };
    } catch (error) {
        console.error('Error saving transaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
    }
}