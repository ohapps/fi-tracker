import { TransactionModel } from "@/server/db/schema";
import dbConnect from '@/server/db/connect';
import { Investment, TransactionType } from "@/types/investments";
import { MonthlyIncome } from "@/types/portfolio";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

export async function calculateMonthlyIncome(investments: Investment[]): Promise<MonthlyIncome> {
    await dbConnect();

    // Get transactions for the last 12 months
    const today = new Date();
    const twelveMonthsAgo = subMonths(today, 12);
    const transactions = await TransactionModel.find({
        investmentId: { $in: investments.map(inv => inv.id) },
        transactionDate: {
            $gte: startOfMonth(twelveMonthsAgo),
            $lte: endOfMonth(today)
        }
    });

    // Calculate monthly income for the last 12 months
    return Array.from({ length: 12 }, (_, i) => {
        const monthDate = subMonths(today, 11 - i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        const monthTransactions = transactions.filter(t =>
            t.transactionDate >= monthStart &&
            t.transactionDate <= monthEnd
        );

        const income = monthTransactions.reduce((sum, t) => {
            if (t.type === TransactionType.GAIN) {
                return sum + t.amount;
            } else if (t.type === TransactionType.LOSS) {
                return sum - t.amount;
            }
            return sum;
        }, 0);

        return {
            date: format(monthDate, 'yyyy-MM'),
            income
        };
    }).reduce((acc, { date, income }) => {
        acc[date] = income;
        return acc;
    }, {} as Record<string, number>);
}