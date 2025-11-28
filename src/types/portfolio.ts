import { AccountType, InvestmentType } from './investments';

export type ValueByAccountType = Record<AccountType, number>;

export type ValueByInvestmentType = Record<InvestmentType, number>;

export type MonthlyIncome = Record<string, number>; // key format: 'YYYY-MM'

export interface FiTrackerStep {
    step: number;
    description: string;
    completed: boolean;
    comments: string;
}

export interface PortfolioSummary {
    totalValue: number;
    totalEquity: number;
    totalCashReserve: number;
    monthsOfReserves: number;
    valueByAccountType: ValueByAccountType;
    valueByInvestmentType: ValueByInvestmentType;
    monthlyIncome: MonthlyIncome;
    averageMonthlyPassiveIncome: number;
    fiTrackerSteps: FiTrackerStep[];
    totalMonthlyIncome: number;
    totalMonthlyExpenses: number;
    incomeExpenseDifference: number;
    retirementMonthlyWithdrawal: number;
    totalRetirementIncome: number;
}