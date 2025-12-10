import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-utils';
import { formatPercent } from '@/utils/number-utils';
import { MetricItem } from './MetricItem';

interface InvestmentMetricsCardProps {
    metrics: {
        lifetimeROI: number;
        roi12m: number;
        lifetimeIncome: number;
        income12m: number;
        avgMonthlyIncome: number;
    };
}

export default function InvestmentMetricsCard({
    metrics,
}: InvestmentMetricsCardProps) {
    return (
        <Card className="bg-gray-50">
            <CardHeader>
                <CardTitle>Investment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricItem
                        label="Lifetime ROI"
                        value={formatPercent(metrics.lifetimeROI)}
                        trend={metrics.lifetimeROI}
                        isPercent
                    />
                    <MetricItem
                        label="12-Month ROI"
                        value={formatPercent(metrics.roi12m)}
                        trend={metrics.roi12m}
                        isPercent
                    />
                    <MetricItem
                        label="Lifetime Income"
                        value={formatCurrency(metrics.lifetimeIncome)}
                    />
                    <MetricItem
                        label="12-Month Income"
                        value={formatCurrency(metrics.income12m)}
                        subtext={`Avg: ${formatCurrency(metrics.avgMonthlyIncome)} / mo`}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
