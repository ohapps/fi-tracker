import { Expense, Income, Retirement, UserProfile } from "@/types/profile";
import { getCurrentUser } from "./get-current-user";

export const getUserProfile = async (): Promise<UserProfile> => {
    const user = await getCurrentUser();
    return {
        email: user.email,
        expenses: user.expenses?.map((expense: Expense) => ({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
        })) ?? [],
        income: user.income?.map((income: Income) => ({
            id: income.id,
            description: income.description,
            amount: income.amount,
        })) ?? [],
        retirement: user.retirement?.map((retirement: Retirement) => ({
            id: retirement.id,
            description: retirement.description,
            amount: retirement.amount,
        })) ?? [],
        withdrawalRate: user.withdrawalRate || 4,
    } as UserProfile;
}