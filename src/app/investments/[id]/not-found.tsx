import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-2xl font-bold text-gray-700 mb-2 text-center">
        Investment Not Found
      </div>
      <div className="text-gray-500 text-center mb-6">
        The investment you are looking for does not exist or you do not have
        access.
      </div>
      <Link
        href="/investments"
        className="text-blue-600 hover:underline text-base font-medium"
      >
        &larr; Return to Investments
      </Link>
    </div>
  );
}
