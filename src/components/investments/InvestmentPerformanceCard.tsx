'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
} from 'recharts';

interface InvestmentPerformanceCardProps {
    data: {
        date: string;
        value: number;
        costBasis: number;
        debt: number;
        income: number;
    }[];
}

export default function InvestmentPerformanceCard({
    data,
}: InvestmentPerformanceCardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-1">
            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle>Performance (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            notation: 'compact',
                                            maximumFractionDigits: 1,
                                        }).format(value)
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(value)
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Current Value"
                                    stroke="#2563eb" // blue-600
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="costBasis"
                                    name="Cost Basis"
                                    stroke="#16a34a" // green-600
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="debt"
                                    name="Debt"
                                    stroke="#dc2626" // red-600
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle>Passive Income (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            notation: 'compact',
                                            maximumFractionDigits: 1,
                                        }).format(value)
                                    }
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: number) =>
                                        new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(value)
                                    }
                                />
                                <Bar dataKey="income" name="Income" fill="#16a34a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
