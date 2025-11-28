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

interface MonthlyRetirementTableProps {
  methods: UseFormReturn<UserProfile>;
}

export function MonthlyRetirementTable({
  methods,
}: MonthlyRetirementTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'retirement',
  });

  const handleAddRetirement = () => {
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
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
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
                No retirement added yet
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => {
              const amountError =
                methods.formState.errors?.retirement?.[index]?.amount?.message;
              const descriptionError =
                methods.formState.errors?.retirement?.[index]?.description
                  ?.message;
              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <TextInput
                      name={`retirement.${index}.description`}
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
                      name={`retirement.${index}.amount`}
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
          onClick={handleAddRetirement}
          className="w-full max-w-sm"
        >
          Add Retirement
        </Button>
      </div>
      {fields.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
          <span className="font-medium">Total Monthly Retirement</span>
          <span className="font-medium">
            $
            {methods
              .watch('retirement')
              .reduce(
                (total, retirement) =>
                  total +
                  (parseFloat(retirement.amount?.toString() || '0') || 0),
                0
              )
              .toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
