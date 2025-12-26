import { FiTrackerStep } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export function FiTracker({
  steps,
  totalMonthlyIncome = 0,
  totalMonthlyExpenses = 0,
}: {
  steps: FiTrackerStep[];
  totalMonthlyIncome?: number;
  totalMonthlyExpenses?: number;
}) {
  const hasData = totalMonthlyIncome > 0 || totalMonthlyExpenses > 0;

  return (
    <Card className="w-full bg-gray-50">
      <CardHeader>
        <CardTitle>Financial Independence Stages</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">
              Please enter your income and expenses under your{' '}
              <Link href="/profile" className="text-primary hover:underline font-medium">
                profile
              </Link>{' '}
              to view your Financial Independence stages.
            </p>
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between w-full gap-6 md:gap-0">
            {/* Connecting Line (Horizontal - Desktop) */}
            <div
              className="hidden md:block absolute top-[15px] left-0 w-full h-[2px] bg-border"
              aria-hidden="true"
            >
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{
                  width:
                    steps.length > 1
                      ? `${(Math.max(0, steps.filter((s) => s.completed).length - 1) / (steps.length - 1)) * 100}%`
                      : '0%',
                }}
              />
            </div>

            {/* Connecting Line (Vertical - Mobile) */}
            <div
              className="md:hidden absolute left-[15px] top-0 h-full w-[2px] bg-border"
              aria-hidden="true"
            >
              <div
                className="w-full bg-primary transition-all duration-500 ease-in-out"
                style={{
                  height:
                    steps.length > 1
                      ? `${(Math.max(0, steps.filter((s) => s.completed).length - 1) / (steps.length - 1)) * 100}%`
                      : '0%',
                }}
              />
            </div>

            {steps.map((step, index) => {
              const isCompleted = step.completed;
              const isCurrent = !isCompleted && (index === 0 || steps[index - 1].completed);

              return (
                <div
                  key={step.step}
                  className="flex flex-row md:flex-col gap-4 md:gap-2 group flex-1 items-center md:items-center"
                >
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'relative flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-300 bg-background z-10',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'border-primary text-primary'
                          : 'border-muted-foreground text-muted-foreground'
                    )}
                  >
                    {step.step}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-background text-primary rounded-full p-[1px] border border-primary shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Description & Tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={cn(
                            'text-xs md:max-w-[100px] cursor-help transition-colors text-left md:text-center',
                            isCompleted || isCurrent
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground'
                          )}
                        >
                          {step.description}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{step.comments}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
