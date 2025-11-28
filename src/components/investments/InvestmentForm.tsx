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
    formState: { isSubmitting },
  } = methods;

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
              <Button type="submit" disabled={isSubmitting || isPending}>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
