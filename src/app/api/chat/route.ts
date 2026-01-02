import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';
import { calculatePortfolioSummary } from '@/server/utils/portfolio/calculate-portfolio-summary';
import { getCurrentUser } from '@/server/utils/user/get-current-user';
import { getInvestmentsWithPerformance } from '@/server/utils/investment/get-investments-with-performance';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const [portfolioSummary, user, investments] = await Promise.all([
      calculatePortfolioSummary(),
      getCurrentUser(),
      getInvestmentsWithPerformance(),
    ]);

    const systemPrompt = `
You are a financial assistant for "Fi-Tracker", a platform helping users track their journey to Financial Independence (FI).
You have access to the user's current portfolio summary, their profile details, and detailed performance for each investment over the last 12 months.

PORTFOLIO SUMMARY:
${JSON.stringify(portfolioSummary, null, 2)}

INVESTMENT LIST & PERFORMANCE (Last 12 Months):
${JSON.stringify(
  investments.map((inv) => ({
    name: inv.description,
    type: inv.type,
    account: inv.accountType,
    currentValue: inv.currentValue,
    currentDebt: inv.currentDebt,
    performance: inv.performance,
  })),
  null,
  2
)}

USER PROFILE DETAILS:
- Income: ${JSON.stringify(user.income, null, 2)}
- Expenses: ${JSON.stringify(user.expenses, null, 2)}
- Retirement: ${JSON.stringify(user.retirement, null, 2)}
- Withdrawal Rate: ${user.withdrawalRate}%

Use this information to answer questions about their portfolio, progress towards FI, specific investment performance, and financial health.
Be encouraging, professional, and provide clear insights.
When discussing numbers, format them clearly as currency.
If the user asks for financial advice, always include a disclaimer that you are an AI and not a financial advisor.
Keep your responses concise but informative.
`;

    const result = streamText({
      model: google('gemini-3-flash-preview'),
      messages: [{ role: 'system', content: systemPrompt }, ...modelMessages],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
