import { TransactionModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';

export async function getInvestmentTransactions(investmentId: string, skip?: number, limit?: number) {
    await dbConnect();

    let query = TransactionModel.find({ investmentId }).sort({ transactionDate: -1 });

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
