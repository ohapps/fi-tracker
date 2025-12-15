import { InvestmentModel, TransactionModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { TransactionType } from '@/types/investments';
import { startOfMonth, subMonths } from 'date-fns';
import mongoose from 'mongoose';

export async function getAccountMetrics(accountId: string) {
    await dbConnect();

    // 1. Get all investments for the account
    const investments = await InvestmentModel.find({
        accountId: new mongoose.Types.ObjectId(accountId)
    });

    if (!investments.length) return null;

    const investmentIds = investments.map(inv => inv._id);
    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, 11)); // Start of 12 months ago

    // 2. Aggregate Lifetime Income for all investments in account
    const lifetimeIncomeResult = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: { $in: investmentIds },
                type: { $in: [TransactionType.GAIN, TransactionType.LOSS] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: { $cond: [{ $eq: ['$type', TransactionType.LOSS] }, { $multiply: ['$amount', -1] }, '$amount'] } }
            }
        }
    ]);
    const lifetimeIncome = lifetimeIncomeResult[0]?.total || 0;

    // 3. Aggregate 12-Month Income for all investments in account
    const income12mResult = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: { $in: investmentIds },
                transactionDate: { $gte: startDate },
                type: { $in: [TransactionType.GAIN, TransactionType.LOSS] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: { $cond: [{ $eq: ['$type', TransactionType.LOSS] }, { $multiply: ['$amount', -1] }, '$amount'] } }
            }
        }
    ]);
    const income12m = income12mResult[0]?.total || 0;

    // 4. Get historical state (12 months ago) for each investment to calculate aggregated 12m ROI
    // We need to find the startValue and startCostBasis for the account as a whole.
    // Start Value = Sum(Start Value of each investment)
    // Start Cost Basis = Sum(Start Cost Basis of each investment)

    // Helper to get 'start' amount for a type for multiple investments
    // Since we need it per investment to sum it up, we can group by investmentId
    const getHistoricalSums = async (type: TransactionType) => {
        const result = await TransactionModel.aggregate([
            {
                $match: {
                    investmentId: { $in: investmentIds },
                    transactionDate: { $lt: startDate },
                    type: type
                }
            },
            {
                $sort: { transactionDate: 1 } // Sort ascending to process in order (though we need last)
            },
            {
                $group: {
                    _id: '$investmentId',
                    lastAmount: { $last: '$amount' } // Get the latest one before start date
                }
            },
            {
                $group: {
                    _id: null,
                    totalStartAmount: { $sum: '$lastAmount' }
                }
            }
        ]);
        return result[0]?.totalStartAmount || 0;
    };

    const [startValue, startCostBasis] = await Promise.all([
        getHistoricalSums(TransactionType.VALUE_CHANGE),
        getHistoricalSums(TransactionType.COST_BASIS_CHANGE)
    ]);

    // Current State Sums
    const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
    const currentCostBasis = investments.reduce((sum, inv) => sum + (inv.costBasis || 0), 0);

    // Lifetime ROI Calculation
    // ROI = ( (Current Value + Income) - Cost Basis) / Cost Basis * 100
    const lifetimeNumerator = (currentValue + lifetimeIncome) - currentCostBasis;
    const lifetimeROI = currentCostBasis > 0 ? (lifetimeNumerator / currentCostBasis) * 100 : 0;

    // 12-Month ROI Calculation
    // Profit = (Value_End - Value_Start - Net_Investment_Change) + Income
    // Investment Change = Current Cost Basis - Start Cost Basis
    const investmentChange = currentCostBasis - startCostBasis;
    const profit12m = (currentValue - startValue - investmentChange) + income12m;

    let roi12m = 0;
    if (startCostBasis > 0) {
        // Proxy denominator: Start Value or Start Cost Basis
        const denominator = startValue > 0 ? startValue : startCostBasis;
        roi12m = (profit12m / denominator) * 100;
    } else {
        // Fallback for new accounts/investments
        roi12m = lifetimeROI;
    }

    const lifetimeAppreciation = currentValue - currentCostBasis;

    return {
        lifetimeROI,
        roi12m,
        lifetimeIncome,
        income12m,
        avgMonthlyIncome: income12m / 12,
        lifetimeAppreciation
    };
}
