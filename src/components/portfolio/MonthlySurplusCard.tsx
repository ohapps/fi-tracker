import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { ChartNoAxesCombined } from 'lucide-react';

interface Props {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  incomeExpenseDifference: number;
}

export default function MonthlySurplusCard({
  totalMonthlyIncome,
  totalMonthlyExpenses,
  incomeExpenseDifference
}: Props) {
  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Monthly Surplus
        </CardTitle>
        <ChartNoAxesCombined className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(incomeExpenseDifference)}
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
