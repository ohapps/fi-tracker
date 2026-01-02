import { getInvestments } from './get-investments';
import { getMonthlyPerformanceData } from '../transaction/get-monthly-performance-data';
import { InvestmentWithPerformance } from '@/types/investments';

export async function getInvestmentsWithPerformance(): Promise<InvestmentWithPerformance[]> {
  const investments = await getInvestments();

  const investmentsWithPerformance = await Promise.all(
    investments.map(async (inv) => {
      const performance = await getMonthlyPerformanceData(inv.id!);
      return {
        ...inv,
        performance,
      };
    })
  );

  return investmentsWithPerformance;
}
