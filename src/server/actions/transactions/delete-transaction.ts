'use server';

import { ActionResult } from '@/types/app';
import dbConnect from '@/server/db/connect';
import { TransactionModel, InvestmentModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { revalidatePath } from 'next/cache';

export async function deleteTransactionAction(
    transactionId: string
): Promise<ActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (!transactionId) {
            return { success: false, error: 'Transaction ID is required' };
        }

        await dbConnect();

        const existingTransaction = await TransactionModel.findById(transactionId);
        if (!existingTransaction) {
            return { success: false, error: 'Transaction not found' };
        }

        const investment = await InvestmentModel.findById(
            existingTransaction.investmentId
        );
        if (!investment || investment.userId.toString() !== user._id.toString()) {
            return { success: false, error: 'Investment not found or access denied' };
        }

        await Promise.all([
            TransactionModel.findByIdAndDelete(transactionId),
            InvestmentModel.findByIdAndUpdate(existingTransaction.investmentId, {
                updatedAt: new Date()
            })
        ]);

        revalidatePath(`/investments/${existingTransaction.investmentId}`);

        return { success: true };
    } catch (error) {
        console.error('Error deleting transaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
    }
}
