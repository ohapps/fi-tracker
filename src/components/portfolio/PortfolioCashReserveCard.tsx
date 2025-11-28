import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface PortfolioCashReserveCardProps {
  totalCashReserve: number;
  monthsOfReserves: number;
}

export default function PortfolioCashReserveCard({
  totalCashReserve,
  monthsOfReserves,
}: PortfolioCashReserveCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Cash Reserve</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          $
          {totalCashReserve.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {monthsOfReserves} months of reserves
        </p>
      </CardContent>
    </Card>
  );
}
