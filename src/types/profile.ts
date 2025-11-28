import z from "zod";

export const ExpenseSchema = z.object({
    id: z.string(),
    amount: z.number().positive('Amount must be greater than zero'),
    description: z.string().min(1, 'Description is required'),
});

export const IncomeSchema = z.object({
    id: z.string(),
    amount: z.number('Amount must be a valid number').positive('Amount must be greater than zero'),
    description: z.string().min(1, 'Description is required'),
});

export const RetirementSchema = z.object({
    id: z.string(),
    amount: z.number('Amount must be a valid number').positive('Amount must be greater than zero'),
    description: z.string().min(1, 'Description is required'),
});

export const UserProfileSchema = z.object({
    email: z.string().email(),
    expenses: z.array(ExpenseSchema),
    income: z.array(IncomeSchema),
    retirement: z.array(RetirementSchema),
    withdrawalRate: z.number().positive('Withdrawal rate must be greater than zero'),
});

export type Expense = z.infer<typeof ExpenseSchema>;
export type Income = z.infer<typeof IncomeSchema>;
export type Retirement = z.infer<typeof RetirementSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;