import { FiTrackerStep } from '@/types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

export function FiTracker({ steps }: { steps: FiTrackerStep[] }) {
  console.log(steps);
  return (
    <Card className="w-full bg-gray-50">
      <CardHeader>
        <CardTitle>Financial Independence Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex justify-between w-full">
          {/* Connecting Line */}
          <div className="absolute top-[15px] left-0 w-full h-[2px] bg-border" aria-hidden="true">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{
                width: steps.length > 1
                  ? `${(Math.max(0, steps.filter(s => s.completed).length - 1) / (steps.length - 1)) * 100}%`
                  : '0%'
              }}
            />
          </div>

          {steps.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = !isCompleted && (index === 0 || steps[index - 1].completed);

            return (
              <div
                key={step.step}
                className="flex flex-col gap-2 group flex-1 items-center"
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-300 bg-background z-10",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
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
                      <span className={cn(
                        "text-xs max-w-[100px] cursor-help transition-colors mt-1 text-center",
                        isCompleted || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
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
      </CardContent>
    </Card>
  );
}
