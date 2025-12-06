
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { TextInput } from '@/components/inputs/TextInput';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { UserProfile } from '@/types/profile';
import { generateId } from '@/lib/utils';
import { useTableSort } from '@/hooks/use-table-sort';

interface MonthlyExpensesTableProps {
  methods: UseFormReturn<UserProfile>;
}

export function MonthlyExpensesTable({ methods }: MonthlyExpensesTableProps) {
  const { fields, append, remove, replace } = useFieldArray({
    control: methods.control,
    name: 'expenses',
  });

  const { handleDisplaySort, getSortIcon } = useTableSort({
    getData: () => methods.getValues('expenses'),
    onSort: (sortedData) => replace(sortedData),
  });

  const handleAddExpense = () => {
    append({
      id: generateId(),
      amount: 0,
      description: '',
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDisplaySort('description')}
                className="hover:bg-transparent px-0 font-semibold"
              >
                Description
                {getSortIcon('description')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDisplaySort('amount')}
                className="hover:bg-transparent px-0 font-semibold"
              >
                Amount
                {getSortIcon('amount')}
              </Button>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No expenses added yet
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => {
              const amountError =
                methods.formState.errors?.expenses?.[index]?.amount?.message;
              const descriptionError =
                methods.formState.errors?.expenses?.[index]?.description
                  ?.message;
              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <TextInput
                      name={`expenses.${index}.description`}
                      placeholder="Description"
                    />
                    {descriptionError && (
                      <span className="text-xs text-red-500 pt-1 block pl-2">
                        {descriptionError}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextInput
                      name={`expenses.${index}.amount`}
                      type="currency"
                      placeholder="Amount"
                    />
                    {amountError && (
                      <span className="text-xs text-red-500 pt-1 block pl-2">
                        {amountError}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          onClick={handleAddExpense}
          className="w-full max-w-sm"
        >
          Add Expense
        </Button>
      </div>
      {fields.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
          <span className="font-medium">Total Monthly Expenses</span>
          <span className="font-medium">
            $
            {methods
              .watch('expenses')
              .reduce(
                (total, expense) =>
                  total + (parseFloat(expense.amount?.toString() || '0') || 0),
                0
              )
              .toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
