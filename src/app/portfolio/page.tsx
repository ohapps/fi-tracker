import { calculatePortfolioSummary } from '@/server/utils/portfolio/calculate-portfolio-summary';
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

export default async function PortfolioPage() {
  const summary = await calculatePortfolioSummary();

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4">
        <FiTracker steps={summary.fiTrackerSteps} />
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
