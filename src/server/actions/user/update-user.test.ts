import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUserAction } from './update-user';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { UserModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { revalidatePath } from 'next/cache';
import { UserProfile } from '@/types/profile';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/schema', () => ({
  UserModel: {
    findByIdAndUpdate: vi.fn(),
  },
}));
vi.mock('@/server/db/connect');
vi.mock('next/cache');

describe('updateUserAction', () => {
  const mockUser = { _id: 'user123', email: 'test@example.com' };
  const mockProfileData = {
    email: 'test@example.com',
    expenses: [{ id: '1', amount: 100, description: 'Food' }],
    income: [{ id: '2', amount: 5000, description: 'Salary' }],
    retirement: [{ id: '3', amount: 1000, description: 'IRA' }],
    withdrawalRate: 4,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update user profile successfully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(dbConnect).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof dbConnect>>
    );
    vi.mocked(UserModel.findByIdAndUpdate).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof UserModel.findByIdAndUpdate>>
    );

    const result = await updateUserAction(mockProfileData);

    expect(result.success).toBe(true);
    expect(dbConnect).toHaveBeenCalled();
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, mockProfileData);
    expect(revalidatePath).toHaveBeenCalledWith('/portfolio');
  });

  it('should return error if user not found', async () => {
    // In actual implementation getCurrentUser throws, but we test the null check in updateUserAction
    vi.mocked(getCurrentUser).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );

    const result = await updateUserAction(mockProfileData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not found');
  });

  it('should return error if validation fails', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    const invalidData = { ...mockProfileData, email: 'invalid-email' } as UserProfile;

    const result = await updateUserAction(invalidData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid profile data');
  });

  it('should handle database errors', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(dbConnect).mockRejectedValue(new Error('DB Error'));

    const result = await updateUserAction(mockProfileData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB Error');
  });
});
