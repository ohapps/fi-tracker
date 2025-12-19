import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteTransactionAction } from './delete-transaction';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { TransactionModel, InvestmentModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { revalidatePath } from 'next/cache';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/connect');
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
vi.mock('@/server/db/schema', () => ({
  TransactionModel: {
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
  InvestmentModel: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

describe('deleteTransactionAction', () => {
  const mockUser = { _id: 'user123' };
  const mockTransactionId = 'trans456';
  const mockInvestmentId = 'inv789';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a transaction successfully', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(TransactionModel.findById).mockResolvedValue({
      _id: mockTransactionId,
      investmentId: mockInvestmentId,
    } as unknown as Awaited<ReturnType<typeof TransactionModel.findById>>);
    vi.mocked(InvestmentModel.findById).mockResolvedValue({
      _id: mockInvestmentId,
      userId: { toString: () => mockUser._id },
    } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);
    vi.mocked(TransactionModel.findByIdAndDelete).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof TransactionModel.findByIdAndDelete>>
    );
    vi.mocked(InvestmentModel.findByIdAndUpdate).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof InvestmentModel.findByIdAndUpdate>>
    );

    const result = await deleteTransactionAction(mockTransactionId);

    expect(result.success).toBe(true);
    expect(dbConnect).toHaveBeenCalled();
    expect(TransactionModel.findByIdAndDelete).toHaveBeenCalledWith(mockTransactionId);
    expect(InvestmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockInvestmentId,
      expect.any(Object)
    );
    expect(revalidatePath).toHaveBeenCalledWith(`/investments/${mockInvestmentId}`);
  });

  it('should return error if user is not found', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const result = await deleteTransactionAction(mockTransactionId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not found');
  });

  it('should return error if transaction ID is missing', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );

    const result = await deleteTransactionAction('');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Transaction ID is required');
  });

  it('should return error if transaction is not found', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(TransactionModel.findById).mockResolvedValue(null);

    const result = await deleteTransactionAction(mockTransactionId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Transaction not found');
  });

  it('should return error if investment is not found or access denied', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(TransactionModel.findById).mockResolvedValue({
      _id: mockTransactionId,
      investmentId: mockInvestmentId,
    } as unknown as Awaited<ReturnType<typeof TransactionModel.findById>>);
    vi.mocked(InvestmentModel.findById).mockResolvedValue({
      _id: mockInvestmentId,
      userId: { toString: () => 'other-user' },
    } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);

    const result = await deleteTransactionAction(mockTransactionId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Investment not found or access denied');
  });

  it('should handle runtime errors', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('Unexpected error'));

    const result = await deleteTransactionAction(mockTransactionId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unexpected error');
  });
});
