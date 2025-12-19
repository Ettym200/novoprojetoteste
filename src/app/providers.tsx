"use client"

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { DateRangeProvider } from "@/contexts/DateRangeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DateRangeProvider>
          {children}
          <Toaster />
        </DateRangeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

