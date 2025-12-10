
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface MetricItemProps {
    label: string;
    value: string;
    trend?: number;
    isPercent?: boolean;
    subtext?: string;
}

export function MetricItem({
    label,
    value,
    trend,
    isPercent,
    subtext,
}: MetricItemProps) {
    return (
        <div className="flex flex-col space-y-1 p-4 bg-white rounded-lg shadow-sm border">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className="flex items-baseline space-x-2">
                <span
                    className={cn(
                        'text-2xl font-bold',
                        isPercent && trend !== undefined
                            ? trend >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            : 'text-foreground'
                    )}
                >
                    {value}
                </span>
                {isPercent && trend !== undefined && (
                    <span
                        className={cn(
                            'flex items-center text-xs',
                            trend >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                    >
                        {trend >= 0 ? (
                            <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                        ) : (
                            <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                        )}
                    </span>
                )}
            </div>
            {subtext && (
                <span className="text-xs text-muted-foreground">{subtext}</span>
            )}
        </div>
    );
}
