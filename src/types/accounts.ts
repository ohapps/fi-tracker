import z from 'zod';

export const accountSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be 100 characters or less'),
});

export type Account = z.infer<typeof accountSchema>;

export interface AccountMetrics {
  lifetimeROI: number;
  roi12m: number;
  lifetimeIncome: number;
  income12m: number;
  avgMonthlyIncome: number;
  lifetimeAppreciation: number;
}
