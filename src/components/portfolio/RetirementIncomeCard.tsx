import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { Landmark } from 'lucide-react';

interface Props {
  retirementMonthlyWithdrawal: number;
  totalRetirementIncome: number;
}

export default function RetirementIncomeCard({
  retirementMonthlyWithdrawal,
  totalRetirementIncome,
}: Props) {
  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Projected Monthly Retirement Income</CardTitle>
        <Landmark className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className="text-xl sm:text-2xl font-bold truncate"
          title={formatCurrency(retirementMonthlyWithdrawal + totalRetirementIncome)}
        >
          {formatCurrency(retirementMonthlyWithdrawal + totalRetirementIncome)}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(retirementMonthlyWithdrawal)} monthly retirement withdrawal
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(totalRetirementIncome)} monthly retirement income
        </p>
      </CardContent>
    </Card>
  );
}
