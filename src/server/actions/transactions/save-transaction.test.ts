import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveTransaction } from './save-transaction';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { TransactionModel, InvestmentModel } from '@/server/db/schema';
import dbConnect from '@/server/db/connect';
import { revalidatePath } from 'next/cache';
import { Transaction, TransactionType } from '@/types/investments';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/connect');
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
vi.mock('@/server/db/schema', () => ({
  TransactionModel: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
  InvestmentModel: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

describe('saveTransaction', () => {
  const mockUser = { _id: 'user123' };
  const mockInvestmentId = 'inv789';
  const mockTransaction: Transaction = {
    investmentId: mockInvestmentId,
    transactionDate: new Date(),
    type: TransactionType.VALUE_CHANGE,
    amount: 100,
    description: 'Test transaction',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Creation', () => {
    it('should create a new transaction successfully', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      vi.mocked(InvestmentModel.findById).mockResolvedValue({
        _id: mockInvestmentId,
        userId: { toString: () => mockUser._id },
      } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);
      vi.mocked(TransactionModel.create).mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof TransactionModel.create>>
      );
      vi.mocked(InvestmentModel.findByIdAndUpdate).mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof InvestmentModel.findByIdAndUpdate>>
      );

      const result = await saveTransaction(mockTransaction);

      expect(result.success).toBe(true);
      expect(dbConnect).toHaveBeenCalled();
      expect(TransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          investmentId: mockInvestmentId,
          amount: 100,
          userId: mockUser._id,
        })
      );
      expect(InvestmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInvestmentId,
        expect.any(Object)
      );
      expect(revalidatePath).toHaveBeenCalledWith(`/investments/${mockInvestmentId}`);
    });

    it('should return error if investment not found or access denied', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      vi.mocked(InvestmentModel.findById).mockResolvedValue({
        _id: mockInvestmentId,
        userId: { toString: () => 'other-user' },
      } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);

      const result = await saveTransaction(mockTransaction);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Investment not found or access denied');
    });

    it('should return error if investmentId is missing in new transaction', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      const invalidTransaction = { ...mockTransaction, investmentId: '' };

      const result = await saveTransaction(invalidTransaction);

      // This should fail validation first
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid transaction data');
    });
  });

  describe('Update', () => {
    const mockTransactionId = 'trans456';
    const existingTx = {
      _id: mockTransactionId,
      investmentId: mockInvestmentId,
      toString: () => mockTransactionId,
    };

    it('should update an existing transaction successfully', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      vi.mocked(TransactionModel.findById).mockResolvedValue({
        ...existingTx,
        investmentId: { toString: () => mockInvestmentId },
      } as unknown as Awaited<ReturnType<typeof TransactionModel.findById>>);
      vi.mocked(InvestmentModel.findById).mockResolvedValue({
        _id: mockInvestmentId,
        userId: { toString: () => mockUser._id },
      } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);
      vi.mocked(TransactionModel.findByIdAndUpdate).mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof TransactionModel.findByIdAndUpdate>>
      );
      vi.mocked(InvestmentModel.findByIdAndUpdate).mockResolvedValue(
        {} as unknown as Awaited<ReturnType<typeof InvestmentModel.findByIdAndUpdate>>
      );

      const updateData = { ...mockTransaction, id: mockTransactionId };
      const result = await saveTransaction(updateData);

      expect(result.success).toBe(true);
      expect(TransactionModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(InvestmentModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith(`/investments/${mockInvestmentId}`);
    });

    it('should return error if transaction is not found', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      vi.mocked(TransactionModel.findById).mockResolvedValue(null);

      const result = await saveTransaction({ ...mockTransaction, id: mockTransactionId });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Transaction not found');
    });

    it('should return error if unauthorized during update', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
      );
      vi.mocked(TransactionModel.findById).mockResolvedValue({
        ...existingTx,
        investmentId: { toString: () => mockInvestmentId },
      } as unknown as Awaited<ReturnType<typeof TransactionModel.findById>>);
      vi.mocked(InvestmentModel.findById).mockResolvedValue({
        _id: mockInvestmentId,
        userId: { toString: () => 'other-user' },
      } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);

      const result = await saveTransaction({ ...mockTransaction, id: mockTransactionId });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Investment not found or access denied');
    });
  });

  it('should handle validation errors', async () => {
    const invalidData = { ...mockTransaction, amount: 'invalid' } as unknown as Transaction;

    const result = await saveTransaction(invalidData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid transaction data');
  });

  it('should handle runtime errors', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('DB connection failed'));

    const result = await saveTransaction(mockTransaction);

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB connection failed');
  });
});
