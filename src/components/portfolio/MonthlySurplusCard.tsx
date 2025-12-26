import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { formatPercent } from '@/utils/number-utils';
import { ChartNoAxesCombined } from 'lucide-react';

interface Props {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  incomeExpenseDifference: number;
}

export default function MonthlySurplusCard({
  totalMonthlyIncome,
  totalMonthlyExpenses,
  incomeExpenseDifference,
}: Props) {
  const expenseToIncomeRate =
    totalMonthlyIncome > 0 ? (totalMonthlyExpenses / totalMonthlyIncome) * 100 : 0;

  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Monthly Surplus</CardTitle>
        <ChartNoAxesCombined className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className="text-xl sm:text-2xl font-bold truncate"
          title={formatCurrency(incomeExpenseDifference)}
        >
          {formatCurrency(incomeExpenseDifference)}
        </div>
        <div className="mt-1 mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {formatPercent(expenseToIncomeRate)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">expense to income rate</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(totalMonthlyIncome)} monthly income
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(totalMonthlyExpenses)} monthly expenses
        </p>
      </CardContent>
    </Card>
  );
}
