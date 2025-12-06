import { useEffect, useState } from 'react';
import { SortDirection } from '@/types/profile';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export type SortConfig<T> = {
    key: keyof T;
    direction: SortDirection;
};

interface UseTableSortProps<T> {
    getData: () => T[];
    onSort: (sortedData: T[]) => void;
    initialSort?: SortConfig<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTableSort<T extends Record<string, any>>({
    getData,
    onSort,
    initialSort = { key: 'amount', direction: 'desc' } as SortConfig<T>,
}: UseTableSortProps<T>) {
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
        initialSort
    );

    const performSort = (
        data: T[],
        key: keyof T,
        direction: SortDirection
    ) => {
        return [...data].sort((a, b) => {
            const aRaw = a[key];
            const bRaw = b[key];

            if (key === 'amount') {
                const aNum =
                    typeof aRaw === 'number' ? aRaw : parseFloat(String(aRaw || 0));
                const bNum =
                    typeof bRaw === 'number' ? bRaw : parseFloat(String(bRaw || 0));
                if (aNum < bNum) return direction === 'asc' ? -1 : 1;
                if (aNum > bNum) return direction === 'asc' ? 1 : -1;
                return 0;
            } else {
                const aStr = String(aRaw || '').toLowerCase();
                const bStr = String(bRaw || '').toLowerCase();

                if (aStr < bStr) return direction === 'asc' ? -1 : 1;
                if (aStr > bStr) return direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
    };

    useEffect(() => {
        if (sortConfig) {
            const currentData = getData();
            if (currentData && currentData.length > 0) {
                const sorted = performSort(
                    currentData,
                    sortConfig.key,
                    sortConfig.direction
                );
                onSort(sorted);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    const handleDisplaySort = (key: keyof T) => {
        let direction: SortDirection = 'asc';

        if ((!sortConfig || sortConfig.key !== key) && key === 'amount') {
            direction = 'desc';
        } else if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
        ) {
            direction = 'desc';
        } else if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'desc'
        ) {
            direction = 'asc';
        }

        setSortConfig({ key, direction });

        const currentData = getData();
        const sortedData = performSort(currentData, key, direction);

        onSort(sortedData);
    };

    const getSortIcon = (key: keyof T) => {
        if (sortConfig?.key !== key) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        );
    };

    return {
        handleDisplaySort,
        getSortIcon,
        sortConfig,
    };
}
