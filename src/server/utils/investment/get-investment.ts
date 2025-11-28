import { InvestmentModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { Investment } from '@/types/investments';
import { notFound } from 'next/navigation';

export async function getInvestment(id: string): Promise<Investment> {
    const user = await getCurrentUser();
    const investment = await InvestmentModel.findOne({ _id: id, userId: user._id });

    if (!investment) {
        notFound();
    }

    return {
        id: investment._id.toString(),
        accountId: investment.accountId?.toString(),
        description: investment.description,
        type: investment.type,
        accountType: investment.accountType,
        costBasis: investment.costBasis,
        currentDebt: investment.currentDebt,
        currentValue: investment.currentValue,
        createdAt: investment.createdAt,
        updatedAt: investment.updatedAt,
    };
}