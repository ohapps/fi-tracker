'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValueByInvestmentType } from '@/types/portfolio';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InvestmentTypeChartProps {
  data: ValueByInvestmentType;
}

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

export default function InvestmentTypeChart({
  data,
}: InvestmentTypeChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle>Investment Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
