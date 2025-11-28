import { z } from 'zod';

export enum InvestmentType {
    STOCKS = 'stocks',
    BONDS = 'bonds',
    MUTUAL_FUND = 'mutual fund',
    REAL_ESTATE = 'real estate',
    SAVINGS_ACCOUNT = 'savings account',
    CD = 'CD',
    OTHER = 'other',
}

export enum AccountType {
    INVESTMENT = 'investment',
    RETIREMENT = 'retirement',
    CASH_RESERVE = 'cash reserve',
}

export const InvestmentSchema = z.object({
    id: z.string().optional(),
    accountId: z.string().min(1).optional(),
    description: z.string().min(1),
    type: z.enum(InvestmentType),
    accountType: z.enum(AccountType),
    costBasis: z.number(),
    currentDebt: z.number(),
    currentValue: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Investment = z.infer<typeof InvestmentSchema>;

export enum TransactionType {
    GAIN = 'gain',
    LOSS = 'loss',
    VALUE_CHANGE = 'change in value',
    COST_BASIS_CHANGE = 'change in cost basis',
    DEBT_CHANGE = 'change in debt',
}

export const TransactionSchema = z.object({
    id: z.string().optional(),
    investmentId: z.string().min(1),
    transactionDate: z.date(),
    type: z.enum(TransactionType),
    amount: z.number(),
    description: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;