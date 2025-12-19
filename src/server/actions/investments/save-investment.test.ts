import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveInvestment } from './save-investment';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { InvestmentModel, TransactionModel } from '@/server/db/schema';
import { Investment, InvestmentType, AccountType, TransactionType } from '@/types/investments';
import { revalidatePath } from 'next/cache';

vi.mock('@/server/utils/user/get-current-user');
vi.mock('@/server/db/schema', () => ({
  InvestmentModel: {
    create: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
  TransactionModel: {
    create: vi.fn(),
  },
}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveInvestment', () => {
  const mockUser = { _id: 'user123' };
  const mockInvestment: Investment = {
    description: 'Test Investment',
    type: InvestmentType.STOCKS,
    accountType: AccountType.INVESTMENT,
    costBasis: 1000,
    currentDebt: 0,
    currentValue: 1200,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new investment successfully with initial transactions', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    const mockCreatedDoc = { _id: 'new-inv-123' };
    vi.mocked(InvestmentModel.create).mockResolvedValue(
      mockCreatedDoc as unknown as Awaited<ReturnType<typeof InvestmentModel.create>>
    );
    vi.mocked(TransactionModel.create).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof TransactionModel.create>>
    );

    const result = await saveInvestment(mockInvestment);

    expect(result.success).toBe(true);
    expect(result.data).toBe('new-inv-123');
    expect(InvestmentModel.create).toHaveBeenCalled();
    // Should create 2 transactions: Value change and Cost Basis change (debt is 0)
    expect(TransactionModel.create).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith('/investments/new-inv-123');
  });

  it('should create a new investment with debt transactions if currentDebt > 0', async () => {
    const investmentWithDebt = { ...mockInvestment, currentDebt: 500 };
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    const mockCreatedDoc = { _id: 'new-inv-debt' };
    vi.mocked(InvestmentModel.create).mockResolvedValue(
      mockCreatedDoc as unknown as Awaited<ReturnType<typeof InvestmentModel.create>>
    );

    await saveInvestment(investmentWithDebt);

    // Value, Cost Basis, and Debt transactions
    expect(TransactionModel.create).toHaveBeenCalledTimes(3);
    expect(TransactionModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.DEBT_CHANGE,
        amount: 500,
      })
    );
  });

  it('should update an existing investment and create transactions for changed values', async () => {
    const existingInvestment = {
      _id: 'existing-id',
      userId: mockUser._id,
      currentValue: 1000,
      costBasis: 1000,
      currentDebt: 0,
    };
    const updatedInvestment: Investment = {
      id: 'existing-id',
      description: 'Updated Description',
      type: InvestmentType.STOCKS,
      accountType: AccountType.INVESTMENT,
      costBasis: 1100, // Changed
      currentDebt: 0,
      currentValue: 1300, // Changed
    };

    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(InvestmentModel.findById).mockResolvedValue(
      existingInvestment as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>
    );
    vi.mocked(InvestmentModel.findByIdAndUpdate).mockResolvedValue({
      _id: 'existing-id',
    } as unknown as Awaited<ReturnType<typeof InvestmentModel.findByIdAndUpdate>>);

    const result = await saveInvestment(updatedInvestment);

    expect(result.success).toBe(true);
    expect(TransactionModel.create).toHaveBeenCalledTimes(2); // Value and Cost Basis changed
    expect(InvestmentModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should return error if investment not found during update', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(InvestmentModel.findById).mockResolvedValue(null);

    const result = await saveInvestment({ ...mockInvestment, id: 'non-existent' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Investment not found');
  });

  it('should return error if user does not own the investment', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(
      mockUser as unknown as Awaited<ReturnType<typeof getCurrentUser>>
    );
    vi.mocked(InvestmentModel.findById).mockResolvedValue({
      userId: { toString: () => 'other-user' },
      currentValue: 1000,
    } as unknown as Awaited<ReturnType<typeof InvestmentModel.findById>>);

    const result = await saveInvestment({ ...mockInvestment, id: 'other-id' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unauthorized');
  });

  it('should handle validation errors', async () => {
    const invalidInvestment = { ...mockInvestment, description: '' };

    const result = await saveInvestment(invalidInvestment);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle runtime errors', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('Unexpected error'));

    const result = await saveInvestment(mockInvestment);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unexpected error');
  });
});
