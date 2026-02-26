'use client';

import PortfolioValueCard from '@/components/portfolio/PortfolioValueCard';
import PortfolioEquityCard from '@/components/portfolio/PortfolioEquityCard';
import PortfolioCashReserveCard from '@/components/portfolio/PortfolioCashReserveCard';
import PortfolioDistributionChart from '@/components/portfolio/PortfolioDistributionChart';
import InvestmentTypeChart from '@/components/portfolio/InvestmentTypeChart';
import MonthlyIncomeChart from '@/components/portfolio/MonthlyIncomeChart';
import { FiTracker } from '@/components/portfolio/FiTracker';
import MonthlySurplusCard from '@/components/portfolio/MonthlySurplusCard';
import PassiveIncomeCard from '@/components/portfolio/PassiveIncomeCard';
import RetirementIncomeCard from '@/components/portfolio/RetirementIncomeCard';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortfolioPage() {
  const { data, error, isLoading } = useSWR('/api/portfolio', fetcher);

  if (error && !data) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Failed to load portfolio summary. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const summary = data?.summary;
  if (!summary) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4">
        <FiTracker
          steps={summary.fiTrackerSteps}
          totalMonthlyIncome={summary.totalMonthlyIncome}
          totalMonthlyExpenses={summary.totalMonthlyExpenses}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MonthlySurplusCard
          totalMonthlyIncome={summary.totalMonthlyIncome}
          totalMonthlyExpenses={summary.totalMonthlyExpenses}
          incomeExpenseDifference={summary.incomeExpenseDifference}
        />
        <PassiveIncomeCard averageMonthlyPassiveIncome={summary.averageMonthlyPassiveIncome} />
        <RetirementIncomeCard
          retirementMonthlyWithdrawal={summary.retirementMonthlyWithdrawal}
          totalRetirementIncome={summary.totalRetirementIncome}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <PortfolioValueCard totalValue={summary.totalValue} />
        <PortfolioEquityCard equity={summary.totalEquity} />
        <PortfolioCashReserveCard
          totalCashReserve={summary.totalCashReserve}
          monthsOfReserves={summary.monthsOfReserves}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PortfolioDistributionChart data={summary.valueByAccountType} />
        <InvestmentTypeChart data={summary.valueByInvestmentType} />
      </div>
      <div className="grid gap-4">
        <MonthlyIncomeChart data={summary.monthlyIncome} />
      </div>
    </div>
  );
}
