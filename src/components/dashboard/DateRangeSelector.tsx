"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import { useDateRangeContext } from "@/contexts/DateRangeContext";

type PresetDateRange = "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "lastMonth" | "custom";

interface DateRangeSelectorProps {
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
  defaultRange?: PresetDateRange;
}

export default function DateRangeSelector({ onDateRangeChange, defaultRange }: DateRangeSelectorProps) {
  const { selectedRange: contextRange, dateRange: contextDateRange, selectPreset, selectCustomRange } = useDateRangeContext();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>();

  // Criar datas sem hora para evitar problemas de timezone
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = subDays(today, 1);
  const last7 = subDays(today, 7);
  const last30 = subDays(today, 30);
  const thisMonthStart = startOfMonth(today);
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  const rangeOptions: Array<{ value: PresetDateRange; label: string; from: Date; to: Date }> = [
    { value: "today", label: "Hoje", from: today, to: today },
    { value: "yesterday", label: "Ontem", from: yesterday, to: yesterday },
    { value: "last7", label: "Últimos 7 dias", from: last7, to: today },
    { value: "last30", label: "Últimos 30 dias", from: last30, to: today },
    { value: "thisMonth", label: "Este mês", from: thisMonthStart, to: today },
    { value: "lastMonth", label: "Mês passado", from: lastMonthStart, to: lastMonthEnd },
  ];

  // Sincronizar com contexto quando mudar
  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange({ from: contextDateRange.from, to: contextDateRange.to });
    }
  }, [contextDateRange, onDateRangeChange]);

  const handleSelect = (range: PresetDateRange) => {
    selectPreset(range);
    const option = rangeOptions.find(r => r.value === range);
    if (option && onDateRangeChange) {
      onDateRangeChange({ from: option.from, to: option.to });
    }
  };

  const handleCustomDateConfirm = () => {
    if (!calendarRange?.from || !calendarRange?.to) return;
    
    const customRange = { from: calendarRange.from, to: calendarRange.to };
    selectCustomRange(customRange);
    if (onDateRangeChange) {
      onDateRangeChange(customRange);
    }
    setCustomModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {rangeOptions.map((option) => (
          <Button
            key={option.value}
            variant={contextRange === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleSelect(option.value)}
            data-testid={`button-date-range-${option.value}`}
          >
            {option.label}
          </Button>
        ))}
        <Popover open={customModalOpen} onOpenChange={setCustomModalOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={contextRange === "custom" ? "default" : "ghost"}
              size="sm"
              data-testid="button-date-range-custom"
            >
              Personalizado
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" data-testid="popover-date-range-custom">
            <div className="p-4">
              <Calendar
                mode="range"
                selected={calendarRange}
                onSelect={setCalendarRange}
                locale={ptBR}
                disabled={(date) => date > new Date()}
                numberOfMonths={2}
              />
              
              {calendarRange?.from && calendarRange?.to && (
                <div className="text-xs text-muted-foreground text-center py-3 border-t mt-3">
                  {format(calendarRange.from, "dd 'de' MMM", { locale: ptBR })} — {format(calendarRange.to, "dd 'de' MMM", { locale: ptBR })}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomModalOpen(false);
                    setCalendarRange(undefined);
                  }}
                  data-testid="button-cancel-custom-date"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomDateConfirm}
                  disabled={!calendarRange?.from || !calendarRange?.to}
                  data-testid="button-confirm-custom-date"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
