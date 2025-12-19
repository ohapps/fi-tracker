import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveAccountAction } from './save-account';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { AccountModel } from '@/server/db/schema';
import { Account } from '@/types/accounts';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/schema', () => ({
  AccountModel: {
    updateOne: vi.fn(),
    create: vi.fn(),
  },
}));

describe('saveAccountAction', () => {
  const mockUser = { _id: 'user123' };
  const mockAccount: Account = { description: 'Test Account' };
  const mockExistingAccount: Account = { id: 'acc456', description: 'Updated Account' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new account successfully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.create).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof AccountModel.create>>
    );

    const result = await saveAccountAction(mockAccount);

    expect(result.success).toBe(true);
    expect(AccountModel.create).toHaveBeenCalledWith({
      userId: mockUser._id,
      description: mockAccount.description,
    });
  });

  it('should update an existing account successfully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.updateOne).mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    } as unknown as Awaited<ReturnType<typeof AccountModel.updateOne>>);

    const result = await saveAccountAction(mockExistingAccount);

    expect(result.success).toBe(true);
    expect(AccountModel.updateOne).toHaveBeenCalledWith(
      { _id: mockExistingAccount.id, userId: mockUser._id },
      { $set: { description: mockExistingAccount.description } }
    );
  });

  it('should return error if validation fails', async () => {
    const invalidAccount = { description: '' } as unknown as Account;

    const result = await saveAccountAction(invalidAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid data');
    expect(AccountModel.create).not.toHaveBeenCalled();
    expect(AccountModel.updateOne).not.toHaveBeenCalled();
  });

  it('should handle errors during creation', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.create).mockRejectedValue(new Error('DB Error'));

    const result = await saveAccountAction(mockAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to save account');
  });

  it('should handle errors during update', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(AccountModel.updateOne).mockRejectedValue(new Error('DB Error'));

    const result = await saveAccountAction(mockExistingAccount);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to save account');
  });
});
