'use server';

import { getCurrentUser } from '@/server/utils/user/get-current-user';
import type { Investment } from "@/types/investments";
import { InvestmentSchema, TransactionType } from "@/types/investments";
import { InvestmentModel, TransactionModel } from "@/server/db/schema";
import { ActionResult } from 'next/dist/server/app-render/types';
import { revalidatePath } from 'next/cache';

export async function saveInvestment(investment: Investment): Promise<ActionResult> {
    try {
        // Validate investment object with zod
        const parsed = InvestmentSchema.safeParse(investment);

        if (!parsed.success) {
            return { success: false, data: null, error: parsed.error.format() };
        }

        const validInvestment = parsed.data;
        const user = await getCurrentUser();
        const now = new Date();

        if (!validInvestment.id) {
            // Create new investment        
            const doc = await InvestmentModel.create({
                ...validInvestment,
                userId: user?._id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Create initial transactions for the new investment            
            await Promise.all([
                // Initial value transaction
                TransactionModel.create({
                    investmentId: doc._id,
                    userId: user?._id,
                    transactionDate: now,
                    type: TransactionType.VALUE_CHANGE,
                    amount: validInvestment.currentValue,
                    description: 'Initial investment value'
                }),
                // Initial cost basis transaction
                TransactionModel.create({
                    investmentId: doc._id,
                    userId: user?._id,
                    transactionDate: now,
                    type: TransactionType.COST_BASIS_CHANGE,
                    amount: validInvestment.costBasis,
                    description: 'Initial cost basis'
                }),
                // Initial debt transaction if there is any
                ...(validInvestment.currentDebt > 0 ? [
                    TransactionModel.create({
                        investmentId: doc._id,
                        userId: user?._id,
                        transactionDate: now,
                        type: TransactionType.DEBT_CHANGE,
                        amount: validInvestment.currentDebt,
                        description: 'Initial debt'
                    })
                ] : [])
            ]);

            revalidatePath(`/investments/${doc._id.toString()}`);

            return { success: true, data: doc._id.toString(), error: null };
        } else {
            // Update existing investment        
            const existing = await InvestmentModel.findById(validInvestment.id);
            if (!existing) {
                return { success: false, data: null, error: 'Investment not found' };
            }
            if (existing.userId.toString() !== user?._id?.toString()) {
                return { success: false, data: null, error: 'Unauthorized: You do not own this investment' };
            }

            // Create transactions for any changes in value, cost basis, or debt
            const transactions = [];

            if (existing.currentValue !== validInvestment.currentValue) {
                transactions.push(
                    TransactionModel.create({
                        investmentId: existing._id,
                        userId: user?._id,
                        transactionDate: now,
                        type: TransactionType.VALUE_CHANGE,
                        amount: validInvestment.currentValue,
                        description: 'Change in investment value'
                    })
                );
            }

            if (existing.costBasis !== validInvestment.costBasis) {
                transactions.push(
                    TransactionModel.create({
                        investmentId: existing._id,
                        userId: user?._id,
                        transactionDate: now,
                        type: TransactionType.COST_BASIS_CHANGE,
                        amount: validInvestment.costBasis,
                        description: 'Change in cost basis'
                    })
                );
            }

            if (existing.currentDebt !== validInvestment.currentDebt) {
                transactions.push(
                    TransactionModel.create({
                        investmentId: existing._id,
                        userId: user?._id,
                        transactionDate: now,
                        type: TransactionType.DEBT_CHANGE,
                        amount: validInvestment.currentDebt,
                        description: 'Change in debt'
                    })
                );
            }

            // Update the investment and create any necessary transactions
            const [doc] = await Promise.all([
                InvestmentModel.findByIdAndUpdate(
                    validInvestment.id,
                    {
                        ...validInvestment,
                        updatedAt: now,
                    },
                    { new: true }
                ),
                ...transactions
            ]);

            revalidatePath(`/investments/${doc._id.toString()}`);

            return { success: true, data: doc._id.toString(), error: null };
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { success: false, data: null, error: message };
    }
}