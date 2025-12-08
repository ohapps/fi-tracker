'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import AddTransactionButton from './AddTransactionButton';
import EditTransactionModal from './EditTransactionModal';
import { TransactionActionMenu } from './TransactionActionMenu';
import { DeleteTransactionModal } from './DeleteTransactionModal';
import { Transaction, TransactionType } from '@/types/investments';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvestmentTransactionsCardProps {
  id: string;
  transactions: {
    transactions: Transaction[];
    total: number;
  };
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function InvestmentTransactionsCard({
  id,
  transactions,
  page,
  pageSize,
  sortBy = 'transactionDate',
  sortDirection = 'desc',
}: InvestmentTransactionsCardProps) {
  const router = useRouter();
  const totalPages = Math.ceil(transactions.total / pageSize);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    // Default to desc for amount/date if new sort, or toggle if same
    if (sortBy !== key && (key === 'amount' || key === 'transactionDate')) {
      direction = 'desc';
    } else if (sortBy === key && sortDirection === 'asc') {
      direction = 'desc';
    } else if (sortBy === key && sortDirection === 'desc') {
      direction = 'asc';
    }

    router.push(
      `/investments/${id}?page=1&pageSize=${pageSize}&sortBy=${key}&sortDirection=${direction}`
    );
  };

  const getSortIcon = (key: string) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      router.push(
        `/investments/${id}?page=${page - 1
        }&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
      );
    }
  }, [page, router, id, pageSize, sortBy, sortDirection]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      router.push(
        `/investments/${id}?page=${page + 1
        }&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
      );
    }
  }, [page, totalPages, router, id, pageSize, sortBy, sortDirection]);

  const handlePageSizeChange = useCallback(
    (value: string) => {
      router.push(
        `/investments/${id}?page=1&pageSize=${value}&sortBy=${sortBy}&sortDirection=${sortDirection}`
      );
    },
    [router, id, sortBy, sortDirection]
  );

  return (
    <Card className="mt-8 bg-gray-50">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <AddTransactionButton />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('transactionDate')}
                  className="hover:bg-transparent px-0 font-semibold cursor-pointer"
                >
                  Date
                  {getSortIcon('transactionDate')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('type')}
                  className="hover:bg-transparent px-0 font-semibold cursor-pointer"
                >
                  Type
                  {getSortIcon('type')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('amount')}
                  className="hover:bg-transparent px-0 font-semibold cursor-pointer"
                >
                  Amount
                  {getSortIcon('amount')}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('description')}
                  className="hover:bg-transparent px-0 font-semibold cursor-pointer"
                >
                  Description
                  {getSortIcon('description')}
                </Button>
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.transactions.map((tx: Transaction) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {tx.transactionDate
                      ? new Date(tx.transactionDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell
                    className={
                      tx.type === TransactionType.LOSS
                        ? 'text-red-500'
                        : undefined
                    }
                  >
                    $
                    {(tx.type === TransactionType.LOSS
                      ? -tx.amount
                      : tx.amount
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>{tx.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    <TransactionActionMenu transaction={tx} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {transactions.total > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </div>
            <div className="flex">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePreviousPage}
                      className={
                        page === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNextPage}
                      className={
                        page === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
        <EditTransactionModal investmentId={id} />
        <DeleteTransactionModal />
      </CardContent>
    </Card>
  );
}
