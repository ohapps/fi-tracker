import { NextResponse } from 'next/server';
import { getAccounts } from '@/server/utils/account/get-accounts';
import { getInvestments } from '@/server/utils/investment/get-investments';
import { getAccountMetrics } from '@/server/utils/account/get-account-metrics';
import { auth0 } from '@/server/security/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [accounts, investments] = await Promise.all([getAccounts(), getInvestments()]);

    const accountMetrics = await Promise.all(
      accounts.map((account) => getAccountMetrics(account.id!))
    );

    return NextResponse.json({
      accounts,
      investments,
      accountMetrics,
    });
  } catch (error) {
    console.error('Error fetching accounts data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
