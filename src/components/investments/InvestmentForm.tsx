'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvestmentSchema, Investment, AccountType } from '@/types/investments';
import { TextInput } from '@/components/inputs/TextInput';
import { InvestmentType } from '@/types/investments';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SelectInput } from '../inputs/SelectInput';
import { Account } from '@/types/accounts';
import { useTransition } from 'react';
import { saveInvestment } from '@/server/actions/investments/save-investment';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { QuickUpdateModal } from './QuickUpdateModal';
import { useState } from 'react';

interface InvestmentFormProps {
  investment?: Investment;
  accounts: Account[];
}

export default function InvestmentForm({
  investment,
  accounts,
}: InvestmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const methods = useForm<Investment>({
    resolver: zodResolver(InvestmentSchema),
    defaultValues: investment,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const [isQuickUpdateOpen, setIsQuickUpdateOpen] = useState(false);

  const handleQuickUpdate = (type: string, amount: number) => {
    const currentVal = getValues('currentValue') || 0;
    const currentCost = getValues('costBasis') || 0;

    const adjustment = type === 'purchase' ? amount : -amount;
    const newVal = currentVal + adjustment;
    const newCost = currentCost + adjustment;

    setValue('currentValue', Math.max(newVal, 0), { shouldValidate: true });
    setValue('costBasis', Math.max(newCost, 0), { shouldValidate: true });

    handleSubmit(onSubmit)();
  };

  const onSubmit = (data: Investment) => {
    startTransition(async () => {
      const result = await saveInvestment(data);
      if (result.success) {
        toast.success('Investment Saved');
        if (!investment?.id && result.data) {
          redirect(`/investments/${result.data}`);
        }
      } else {
        toast.error('Failed to save investment');
      }
    });
  };

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle>Edit Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextInput name="description" label="Description" />
                <SelectInput
                  name="type"
                  label="Investment Type"
                  options={Object.values(InvestmentType)}
                />
                <SelectInput
                  name="accountType"
                  label="Classification"
                  options={Object.values(AccountType)}
                />
                <SelectInput
                  name="accountId"
                  label="Account"
                  options={accounts.map((a) => ({
                    value: a.id ?? '',
                    label: a.description,
                  }))}
                />
              </div>
              <div>
                <TextInput
                  name="currentValue"
                  type="currency"
                  label="Current Value"
                />
                <TextInput
                  name="costBasis"
                  type="currency"
                  label="Cost Basis"
                />
                <TextInput
                  name="currentDebt"
                  type="currency"
                  label="Current Debt"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {investment?.updatedAt && (
                  <>
                    Last updated:{' '}
                    {new Date(investment.updatedAt).toLocaleString()}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQuickUpdateOpen(true)}
                  disabled={isSubmitting || isPending}
                >
                  Quick Update
                </Button>
                <Button type="submit" disabled={isSubmitting || isPending}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>

      <QuickUpdateModal
        open={isQuickUpdateOpen}
        onOpenChange={setIsQuickUpdateOpen}
        onSave={handleQuickUpdate}
      />
    </Card>
  );
}
