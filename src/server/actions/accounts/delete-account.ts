'use server';

import { AccountModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { Account, accountSchema } from '@/types/accounts';
import { ActionResult } from '@/types/app';

export async function deleteAccountAction(account: Account): Promise<ActionResult> {
    try {
        const user = await getCurrentUser();
        const parsed = accountSchema.safeParse(account);

        if (!parsed.success) {
            return { success: false, error: 'Invalid account data' };
        }

        if (!parsed.data.id) {
            return { success: false, error: 'Missing account id' };
        }

        const result = await AccountModel.deleteOne({ _id: parsed.data.id, userId: user._id });

        if (result.deletedCount === 1) {
            return { success: true };
        } else {
            return { success: false, error: 'Account not found or not deleted' };
        }
    } catch (error) {
        return { success: false, error: 'Failed to delete account' };
    }
}
