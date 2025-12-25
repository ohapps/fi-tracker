'use server';

import { ActionResult } from '@/types/app';
import dbConnect from '@/server/db/connect';
import { UserModel } from '@/server/db/schema';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { revalidatePath } from 'next/cache';
import { UserProfile, UserProfileSchema } from '@/types/profile';

export async function updateUserAction(data: UserProfile): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const validation = UserProfileSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, error: 'Invalid profile data' };
    }

    await dbConnect();

    await UserModel.findByIdAndUpdate(user._id, validation.data);

    revalidatePath('/portfolio');

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
