

import { InvestmentModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { Investment } from '@/types/investments';

export async function getInvestments(): Promise<Investment[]> {
    const user = await getCurrentUser();
    if (!user?._id) return [];
    const docs = await InvestmentModel.find({ userId: user._id }).exec();
    return docs.map((doc) => ({
        id: doc._id.toString(),
        accountId: doc.accountId?.toString(),
        description: doc.description,
        type: doc.type,
        accountType: doc.accountType,
        costBasis: doc.costBasis,
        currentDebt: doc.currentDebt,
        currentValue: doc.currentValue,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    })) as Investment[];
}
