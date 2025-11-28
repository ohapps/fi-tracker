import { FiTrackerStep, PortfolioSummary, ValueByAccountType, ValueByInvestmentType } from '@/types/portfolio';
import { getInvestments } from '../investment/get-investments';
import { AccountType } from '@/types/investments';
import { getCurrentUser } from '../user/get-current-user';
import { calculateMonthlyIncome } from './calculate-monthly-income';
import { formatCurrency } from '@/utils/currency-utils';

export async function calculatePortfolioSummary(): Promise<PortfolioSummary> {
    const user = await getCurrentUser();
    const investments = await getInvestments();

    const totalValue = investments.reduce(
        (acc, investment) => acc + investment.currentValue,
        0
    );

    const totalDebt = investments.reduce(
        (acc, investment) => acc + investment.currentDebt,
        0
    );

    const totalEquity = totalValue - totalDebt;

    const totalCashReserve = investments
        .filter(inv => inv.accountType === AccountType.CASH_RESERVE)
        .reduce(
            (acc, investment) => acc + investment.currentValue,
            0
        );

    const totalMonthlyExpenses = user.expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalMonthlyIncome = user.income.reduce((total, income) => total + income.amount, 0);
    const totalRetirementIncome = user.retirement.reduce((total, retirement) => total + retirement.amount, 0);

    const monthsOfReserves =
        totalMonthlyExpenses > 0
            ? Math.floor(totalCashReserve / totalMonthlyExpenses)
            : 0;

    const valueByAccountType = investments.reduce((acc, investment) => {
        const { accountType, currentValue } = investment;
        if (!acc[accountType]) {
            acc[accountType] = 0;
        }
        acc[accountType] += currentValue;
        return acc;
    }, {} as ValueByAccountType);

    const valueByInvestmentType = investments.reduce((acc, investment) => {
        const { type, currentValue } = investment;
        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type] += currentValue;
        return acc;
    }, {} as ValueByInvestmentType);

    const monthlyIncome = await calculateMonthlyIncome(investments);

    const fiTrackerSteps: FiTrackerStep[] = [];

    const incomeExpenseDifference = totalMonthlyIncome - totalMonthlyExpenses;
    const incomeCoversExpenses = incomeExpenseDifference >= 0;
    const maxIncome = user.income.reduce((max, income) => Math.max(max, income.amount), 0);
    const secondaryMonthlyIncome = totalMonthlyIncome - maxIncome;
    const monthlyIncomeValues = Object.values(monthlyIncome);
    const averageMonthlyPassiveIncome = monthlyIncomeValues.length > 0
        ? monthlyIncomeValues.reduce((sum, val) => sum + val, 0) / monthlyIncomeValues.length
        : 0;
    const montlyExpensesMinusSecondaryAndPassiveIncome = totalMonthlyExpenses - secondaryMonthlyIncome - averageMonthlyPassiveIncome;
    const totalRetirementPortfolioValue = valueByAccountType[AccountType.RETIREMENT] ?? 0;
    const retirementMonthlyWithdrawal = (totalRetirementPortfolioValue * (user.withdrawalRate / 100) / 12);
    const retirementAndPassiveIncomeMinusExpenses = (retirementMonthlyWithdrawal + totalRetirementIncome + averageMonthlyPassiveIncome) - totalMonthlyExpenses;
    const passiveIncomeMinusExpenses = averageMonthlyPassiveIncome - totalMonthlyExpenses;

    fiTrackerSteps.push({
        step: 1,
        description: 'Income covers current expenses',
        completed: incomeCoversExpenses,
        comments: incomeCoversExpenses ? `You have a surplus of ${formatCurrency(incomeExpenseDifference)}` : `You are short of covering your expenses by ${formatCurrency(Math.abs(incomeExpenseDifference))}`
    });

    const sixMonthsPlusOfReserves = incomeCoversExpenses && monthsOfReserves >= 6;

    fiTrackerSteps.push({
        step: 2,
        description: 'Six months of expenses in cash reserves',
        completed: sixMonthsPlusOfReserves,
        comments: sixMonthsPlusOfReserves ? `You have ${monthsOfReserves} months of reserves and all expenses are covered by your income. Great job!` : `Keep working towards building six months of expenses in your cash reserves.`
    });

    fiTrackerSteps.push({
        step: 3,
        description: 'Passive income covers loss of highest income stream',
        completed: montlyExpensesMinusSecondaryAndPassiveIncome <= 0,
        comments: montlyExpensesMinusSecondaryAndPassiveIncome <= 0 ? `You have a surplus of ${formatCurrency(montlyExpensesMinusSecondaryAndPassiveIncome)}` : `You are short of covering your expenses by ${formatCurrency(Math.abs(montlyExpensesMinusSecondaryAndPassiveIncome))}`
    });

    fiTrackerSteps.push({
        step: 4,
        description: 'Retirement and passive income covers expenses',
        completed: retirementAndPassiveIncomeMinusExpenses >= 0,
        comments: retirementAndPassiveIncomeMinusExpenses >= 0 ? `You have a surplus of ${formatCurrency(retirementAndPassiveIncomeMinusExpenses)}` : `You are short of covering your expenses by ${formatCurrency(Math.abs(retirementAndPassiveIncomeMinusExpenses))}`
    });

    fiTrackerSteps.push({
        step: 5,
        description: 'Investment income covers all salary',
        completed: passiveIncomeMinusExpenses >= 0,
        comments: passiveIncomeMinusExpenses >= 0 ? `You have a surplus of ${formatCurrency(passiveIncomeMinusExpenses)}` : `You are short of covering your expenses by ${formatCurrency(Math.abs(passiveIncomeMinusExpenses))}`
    });

    return {
        totalValue,
        totalEquity,
        totalCashReserve,
        monthsOfReserves,
        valueByAccountType,
        valueByInvestmentType,
        monthlyIncome,
        averageMonthlyPassiveIncome,
        fiTrackerSteps,
        totalMonthlyIncome,
        totalMonthlyExpenses,
        incomeExpenseDifference,
        retirementMonthlyWithdrawal,
        totalRetirementIncome,
    };
}