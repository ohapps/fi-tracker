import { InvestmentModel, TransactionModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { TransactionType } from '@/types/investments';
import { startOfMonth, subMonths } from 'date-fns';
import mongoose from 'mongoose';

export async function getInvestmentMetrics(investmentId: string) {
    await dbConnect();

    // 1. Get current investment state
    const investment = await InvestmentModel.findById(investmentId);
    if (!investment) return null;

    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, 11)); // Start of 12 months ago

    // 2. Get Lifetime Income
    const lifetimeIncomeResult = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: new mongoose.Types.ObjectId(investmentId),
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

    // 3. Get 12-Month Income
    const income12mResult = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: new mongoose.Types.ObjectId(investmentId),
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

    // 4. Get state 12 months ago to calculate 12m ROI
    const [prevValueTx, prevCostBasisTx] = await Promise.all([
        TransactionModel.findOne({ investmentId, transactionDate: { $lt: startDate }, type: TransactionType.VALUE_CHANGE }).sort({ transactionDate: -1 }),
        TransactionModel.findOne({ investmentId, transactionDate: { $lt: startDate }, type: TransactionType.COST_BASIS_CHANGE }).sort({ transactionDate: -1 }),
    ]);

    const startValue = prevValueTx?.amount || 0;
    const startCostBasis = prevCostBasisTx?.amount || 0;

    const currentValue = investment.currentValue;
    const currentCostBasis = investment.costBasis;

    // Lifetime ROI
    // ROI = ( (Current Value + Income) - Cost Basis) / Cost Basis * 100
    //     = ( (currentValue + lifetimeIncome) - currentCostBasis ) / currentCostBasis * 100
    const lifetimeNumerator = (currentValue + lifetimeIncome) - currentCostBasis;
    const lifetimeROI = currentCostBasis > 0 ? (lifetimeNumerator / currentCostBasis) * 100 : 0;

    // 12-Month ROI
    // Profit = (Value_End - Value_Start - Net_Investment_Change) + Income
    let roi12m = 0;
    const investmentChange = currentCostBasis - startCostBasis;
    const profit12m = (currentValue - startValue - investmentChange) + income12m;

    // Determine denominator for 12m ROI
    // Ideally: Average Invested Capital over period.
    // Proxy: Start Value or Start Cost Basis.

    if (startCostBasis > 0) {
        // If existing 12m ago, use start Value or Cost Basis.
        const denominator = startValue > 0 ? startValue : startCostBasis;
        roi12m = (profit12m / denominator) * 100;
    } else {
        // New investment (<12 months old)
        // Fallback to Lifetime ROI as the 12m period covers the entire life
        roi12m = lifetimeROI;
    }

    return {
        lifetimeROI,
        roi12m,
        lifetimeIncome,
        income12m,
        avgMonthlyIncome: income12m / 12
    };
}
