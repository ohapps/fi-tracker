import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAccountAction } from './delete-account';
import { Account } from '@/types/accounts';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { AccountModel } from '@/server/db/schema';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/schema', () => ({
  AccountModel: {
    deleteOne: vi.fn(),
  },
}));

describe('deleteAccountAction', () => {
  const mockUser = { _id: 'user123' };
  const mockAccount = { id: 'acc456', description: 'Test Account' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete account successfully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.deleteOne).mockResolvedValue({
      deletedCount: 1,
      acknowledged: true,
    } as unknown as Awaited<ReturnType<typeof AccountModel.deleteOne>>);

    const result = await deleteAccountAction(mockAccount);

    expect(result.success).toBe(true);
    expect(AccountModel.deleteOne).toHaveBeenCalledWith({
      _id: mockAccount.id,
      userId: mockUser._id,
    });
  });

  it('should return error if validation fails', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    const invalidAccount = { description: '' } as unknown as Account;

    const result = await deleteAccountAction(invalidAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid account data');
  });

  it('should return error if missing account id', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    const noIdAccount = { description: 'No ID' };

    const result = await deleteAccountAction(noIdAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Missing account id');
  });

  it('should return error if account not found or not deleted', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.deleteOne).mockResolvedValue({
      deletedCount: 0,
      acknowledged: true,
    } as unknown as Awaited<ReturnType<typeof AccountModel.deleteOne>>);

    const result = await deleteAccountAction(mockAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Account not found or not deleted');
  });

  it('should handle errors during deletion', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.deleteOne).mockRejectedValue(new Error('DB Error'));

    const result = await deleteAccountAction(mockAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete account');
  });
});
