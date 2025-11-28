'use server';

import { AccountModel } from "@/server/db/schema";
import { getCurrentUser } from "@/server/utils/user/get-current-user";
import { accountSchema, Account } from "@/types/accounts";
import { ActionResult } from "@/types/app";

export async function saveAccountAction(data: Account): Promise<ActionResult> {
  const parsed = accountSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: 'Invalid data' };
  }

  try {
    const user = await getCurrentUser();

    if (parsed.data.id) {
      // Update existing account
      await AccountModel.updateOne(
        { _id: parsed.data.id, userId: user._id },
        { $set: { description: parsed.data.description } }
      );
    } else {
      // Create new account
      await AccountModel.create({
        userId: user._id,
        description: parsed.data.description,
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to save account' };
  }
}
