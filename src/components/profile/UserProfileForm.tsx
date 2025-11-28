'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserAction } from '@/server/actions/user/update-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { UserProfile, UserProfileSchema } from '@/types/profile';
import { MonthlyExpensesTable } from './MonthlyExpensesTable';
import { TextInput } from '../inputs/TextInput';
import { MonthlyIncomeTable } from './MonthlyIncomeTable';
import { MonthlyRetirementTable } from './MonthlyRetirementTable';

interface UserProfileFormProps {
  userProfile: UserProfile;
}

export default function UserProfileForm({ userProfile }: UserProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const methods = useForm<UserProfile>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: userProfile,
  });

  const onSubmit = (data: UserProfile) => {
    startTransition(async () => {
      const result = await updateUserAction(data);
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    });
  };

  useEffect(() => {
    methods.reset(userProfile);
  }, [userProfile]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-gray-50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col gap-4">
              <TextInput name="email" label="Email" readOnly />
              <TextInput
                name="withdrawalRate"
                label="Retirement Withdrawal Rate (%)"
                type="number"
              />
            </div>

            <Card className="bg-white">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Monthly Financials</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="expenses" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="expenses"
                      className="data-[state=active]:bg-blue-100"
                    >
                      Expenses
                      {methods.formState.errors.expenses && (
                        <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="income"
                      className="data-[state=active]:bg-blue-100"
                    >
                      Income
                      {methods.formState.errors.income && (
                        <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="retirement"
                      className="data-[state=active]:bg-blue-100"
                    >
                      Retirement
                      {methods.formState.errors.retirement && (
                        <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="expenses">
                    <MonthlyExpensesTable methods={methods} />
                  </TabsContent>
                  <TabsContent value="income">
                    <MonthlyIncomeTable methods={methods} />
                  </TabsContent>
                  <TabsContent value="retirement">
                    <MonthlyRetirementTable methods={methods} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} size="sm">
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
