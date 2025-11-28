'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, parse } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MonthlyIncome } from '@/types/portfolio';

interface MonthlyIncomeChartProps {
  data: MonthlyIncome;
}

export default function MonthlyIncomeChart({ data }: MonthlyIncomeChartProps) {
  // Convert the data object into an array sorted by date
  const chartData = Object.entries(data)
    .map(([month, value]) => ({
      month,
      income: value,
      // Parse the month string to get a proper label
      label: format(parse(month, 'yyyy-MM', new Date()), 'MMM yyyy'),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle>Monthly Passive Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <ReferenceLine y={0} stroke="#666666" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: '#666666', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#666666', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  'Income',
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
