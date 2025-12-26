import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { BanknoteArrowUp } from 'lucide-react';

interface Props {
  averageMonthlyPassiveIncome: number;
}

export default function PassiveIncomeCard({ averageMonthlyPassiveIncome }: Props) {
  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Average Monthly Passive Income</CardTitle>
        <BanknoteArrowUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className="text-xl sm:text-2xl font-bold truncate"
          title={formatCurrency(averageMonthlyPassiveIncome)}
        >
          {formatCurrency(averageMonthlyPassiveIncome)}
        </div>
      </CardContent>
    </Card>
  );
}
