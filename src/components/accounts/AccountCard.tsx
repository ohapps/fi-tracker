import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EditAccountMenu } from './EditAccountMenu';
import { Coins, LineChart, ArrowUpRight } from 'lucide-react';
import { Account } from '@/types/accounts';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency-utils';
import { formatPercent } from '@/utils/number-utils';

interface AccountCardProps {
  account: Account;
  investmentCount?: number;
  accountValue?: number;
  metrics?: {
    lifetimeROI: number;
    roi12m: number;
    lifetimeIncome: number;
    income12m: number;
    avgMonthlyIncome: number;
  } | null;
}

export function AccountCard({
  account,
  investmentCount = 0,
  accountValue = 0,
  metrics,
}: AccountCardProps) {
  const firstLetter = account.description?.charAt(0)?.toUpperCase() || '?';

  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
        <CardTitle>{account.description}</CardTitle>
        <EditAccountMenu account={account} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-muted-foreground" />
            Investments:{' '}
            <span className="font-semibold text-muted-foreground">
              {investmentCount}
            </span>
            {investmentCount > 0 && (
              <Link
                href={`/investments?accountId=${account.id}`}
                className="ml-1 text-blue-600 hover:text-blue-800"
                title="View investments for this account"
                aria-label="View investments for this account"
              >
                <ArrowUpRight className="w-4 h-4 inline" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-muted-foreground" />
            Account Value:{' '}
            <span className="font-semibold text-muted-foreground">
              {formatCurrency(accountValue)}
            </span>
          </div>
        </div>
        {metrics && (
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ROI (Life)</span>
              <span className={metrics.lifetimeROI >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {formatPercent(metrics.lifetimeROI)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ROI (12m)</span>
              <span className={metrics.roi12m >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {formatPercent(metrics.roi12m)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Income (Life)</span>
              <span className="font-medium">
                {formatCurrency(metrics.lifetimeIncome)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Income (12m)</span>
              <span className="font-medium">
                {formatCurrency(metrics.income12m)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Avg Income/Mo</span>
              <span className="font-medium">
                {formatCurrency(metrics.avgMonthlyIncome)}
              </span>
            </div>
          </div>
        )}

      </CardContent >
    </Card >
  );
}
