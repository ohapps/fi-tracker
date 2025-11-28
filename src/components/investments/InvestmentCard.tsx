import { Investment } from '@/types/investments';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

interface InvestmentCardProps {
  investment: Investment;
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">{investment.description}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="text-sm text-gray-600">
          Investment Type: {investment.type}
        </div>
        <div className="text-sm text-gray-600">
          Classification: {investment.accountType}
        </div>
        <div className="text-sm text-gray-600">
          Cost Basis: ${investment.costBasis.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">
          Current Debt: ${investment.currentDebt.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">
          Current Value: ${investment.currentValue.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Updated:{' '}
          {investment.updatedAt
            ? new Date(investment.updatedAt).toLocaleDateString()
            : '-'}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href={`/investments/${investment.id}`}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Edit Investment
        </Link>
      </CardFooter>
    </Card>
  );
}
