import { TransactionModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';

export async function getInvestmentTransactions(
    investmentId: string,
    skip?: number,
    limit?: number,
    sortBy: string = 'transactionDate',
    sortDirection: 'asc' | 'desc' = 'desc'
) {
    await dbConnect();

    const sortDir = sortDirection === 'asc' ? 1 : -1;
    let query = TransactionModel.find({ investmentId }).sort({ [sortBy]: sortDir });

    if (typeof skip === 'number' && typeof limit === 'number') {
        query = query.skip(skip).limit(limit);
    }

    const [transactions, total] = await Promise.all([
        query.exec(),
        TransactionModel.countDocuments({ investmentId })
    ]);

    return {
        transactions: transactions.map((tx) => ({
            id: tx._id.toString(),
            investmentId: tx.investmentId.toString(),
            type: tx.type,
            transactionDate: tx.transactionDate,
            amount: tx.amount,
            description: tx.description,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
        })),
        total
    };
}
