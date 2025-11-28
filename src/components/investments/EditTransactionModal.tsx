'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useTransition, useEffect } from 'react';
import { Button } from '../ui/button';
import { TextInput } from '../inputs/TextInput';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { useAtom } from 'jotai';
import { transactionActionAtom } from '@/atoms/transaction';
import { DatePicker } from '../inputs/DatePicker';
import { SelectInput } from '../inputs/SelectInput';
import {
  Transaction,
  TransactionSchema,
  TransactionType,
} from '@/types/investments';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveTransaction } from '@/server/actions/transactions/save-transaction';

export default function EditTransactionModal({
  investmentId,
}: {
  investmentId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [transactionAction, setTransactionAction] = useAtom(
    transactionActionAtom
  );
  const open =
    transactionAction?.action === 'edit' || transactionAction?.action === 'add';
  const title =
    transactionAction?.action === 'edit'
      ? 'Edit Transaction'
      : 'Add New Transaction';

  const methods = useForm<Transaction>({
    resolver: zodResolver(TransactionSchema),
    mode: 'onChange',
  });

  const submitDisabled = isPending || !methods.formState.isValid;

  const onSubmit = (data: Transaction) => {
    startTransition(async () => {
      const result = await saveTransaction(data);
      if (result.success) {
        toast.success('Transaction Saved');
        setTransactionAction(undefined);
      } else {
        toast.error('Failed to save transaction');
      }
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTransactionAction(undefined);
    }
  };

  useEffect(() => {
    if (transactionAction?.action === 'edit' && transactionAction.transaction) {
      methods.reset(transactionAction.transaction);
    } else {
      methods.reset({
        id: '',
        investmentId,
        transactionDate: new Date(),
        type: TransactionType.VALUE_CHANGE,
        amount: 0,
        description: '',
      });
    }
  }, [transactionAction, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <DatePicker name="transactionDate" label="Transaction Date" />
            <SelectInput
              name="type"
              label="Transaction Type"
              options={Object.values(TransactionType)}
            />
            <TextInput name="amount" label="Amount" type="currency" />
            <TextInput name="description" label="Description" />
            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-muted text-muted-foreground border border-muted"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitDisabled}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
