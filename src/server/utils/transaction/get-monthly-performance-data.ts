import { TransactionModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { TransactionType } from '@/types/investments';
import { startOfMonth, subMonths } from 'date-fns';
import mongoose from 'mongoose';

export async function getMonthlyPerformanceData(investmentId: string) {
    await dbConnect();

    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, 11));

    // Get the last known values before the period starts
    const [previousValue, previousCostBasis, previousDebt] = await Promise.all([
        TransactionModel.findOne({
            investmentId,
            transactionDate: { $lt: startDate },
            type: TransactionType.VALUE_CHANGE,
        }).sort({ transactionDate: -1 }),
        TransactionModel.findOne({
            investmentId,
            transactionDate: { $lt: startDate },
            type: TransactionType.COST_BASIS_CHANGE,
        }).sort({ transactionDate: -1 }),
        TransactionModel.findOne({
            investmentId,
            transactionDate: { $lt: startDate },
            type: TransactionType.DEBT_CHANGE,
        }).sort({ transactionDate: -1 }),
    ]);

    let lastValue = previousValue?.amount || 0;
    let lastCostBasis = previousCostBasis?.amount || 0;
    let lastDebt = previousDebt?.amount || 0;

    // Aggregate performance metrics (max value per month)
    const performanceResults = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: new mongoose.Types.ObjectId(investmentId),
                transactionDate: { $gte: startDate, $lte: endDate },
                type: {
                    $in: [
                        TransactionType.VALUE_CHANGE,
                        TransactionType.COST_BASIS_CHANGE,
                        TransactionType.DEBT_CHANGE,
                    ],
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$transactionDate' },
                    month: { $month: '$transactionDate' },
                    type: '$type',
                },
                maxAmount: { $max: '$amount' },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 },
        },
    ]);

    // Aggregate income (sum of gains and losses per month)
    const incomeResults = await TransactionModel.aggregate([
        {
            $match: {
                investmentId: new mongoose.Types.ObjectId(investmentId),
                transactionDate: { $gte: startDate, $lte: endDate },
                type: {
                    $in: [TransactionType.GAIN, TransactionType.LOSS],
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$transactionDate' },
                    month: { $month: '$transactionDate' },
                },
                totalIncome: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', TransactionType.LOSS] },
                            { $multiply: ['$amount', -1] },
                            '$amount',
                        ],
                    },
                },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 },
        },
    ]);

    const monthlyData = [];
    const currentDate = new Date(startDate);

    // Loop through last 12 months
    for (let i = 0; i < 12; i++) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const foundValue = performanceResults.find(
            (r) =>
                r._id.year === year &&
                r._id.month === month &&
                r._id.type === TransactionType.VALUE_CHANGE
        );
        const foundCostBasis = performanceResults.find(
            (r) =>
                r._id.year === year &&
                r._id.month === month &&
                r._id.type === TransactionType.COST_BASIS_CHANGE
        );
        const foundDebt = performanceResults.find(
            (r) =>
                r._id.year === year &&
                r._id.month === month &&
                r._id.type === TransactionType.DEBT_CHANGE
        );

        const foundIncome = incomeResults.find(
            (r) => r._id.year === year && r._id.month === month
        );

        if (foundValue) lastValue = foundValue.maxAmount;
        if (foundCostBasis) lastCostBasis = foundCostBasis.maxAmount;
        if (foundDebt) lastDebt = foundDebt.maxAmount;

        monthlyData.push({
            date: currentDate.toLocaleString('default', {
                month: 'short',
                year: '2-digit',
            }),
            value: lastValue,
            costBasis: lastCostBasis,
            debt: lastDebt,
            income: foundIncome ? foundIncome.totalIncome : 0,
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return monthlyData;
}
