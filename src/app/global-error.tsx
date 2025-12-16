'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="relative w-full h-64">
                            <Image
                                src="/error-illustration.png"
                                alt="Error Illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Oops! Something went wrong.
                            </h2>
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. Please try again or contact support if the problem persists.
                            </p>
                        </div>
                        <Button
                            onClick={() => reset()}
                            className="w-full sm:w-auto min-w-[140px]"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Try again
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
