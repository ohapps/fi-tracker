import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';

interface PortfolioEquityCardProps {
  equity: number;
}

export default function PortfolioEquityCard({ equity }: PortfolioEquityCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Portfolio Equity</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className="text-xl sm:text-2xl font-bold truncate"
          title={`$${equity.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        >
          $
          {equity.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </CardContent>
    </Card>
  );
}
