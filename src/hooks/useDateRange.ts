// Hook para gerenciar range de datas

import { useState, useCallback, useMemo } from 'react';
import { subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import type { DateRange } from '@/types/common';

type PresetDateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';

export function useDateRange(defaultRange: PresetDateRange = 'today') {
  const [selectedRange, setSelectedRange] = useState<PresetDateRange>(defaultRange);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const today = useMemo(() => new Date(), []);
  const yesterday = useMemo(() => subDays(today, 1), [today]);
  const last7 = useMemo(() => subDays(today, 7), [today]);
  const last30 = useMemo(() => subDays(today, 30), [today]);
  const thisMonthStart = useMemo(() => startOfMonth(today), [today]);
  const lastMonthStart = useMemo(() => startOfMonth(subMonths(today, 1)), [today]);
  const lastMonthEnd = useMemo(() => endOfMonth(subMonths(today, 1)), [today]);

  const presets: Record<PresetDateRange, DateRange> = useMemo(() => ({
    today: { from: today, to: today },
    yesterday: { from: yesterday, to: yesterday },
    last7: { from: last7, to: today },
    last30: { from: last30, to: today },
    thisMonth: { from: thisMonthStart, to: today },
    lastMonth: { from: lastMonthStart, to: lastMonthEnd },
    custom: dateRange || { from: today, to: today },
  }), [today, yesterday, last7, last30, thisMonthStart, lastMonthStart, lastMonthEnd, dateRange]);

  const selectPreset = useCallback((preset: PresetDateRange) => {
    setSelectedRange(preset);
    if (preset !== 'custom') {
      setDateRange(presets[preset]);
    }
  }, [presets]);

  const selectCustomRange = useCallback((range: DateRange) => {
    setSelectedRange('custom');
    setDateRange(range);
  }, []);

  return {
    selectedRange,
    dateRange: dateRange || presets[selectedRange],
    selectPreset,
    selectCustomRange,
    presets,
  };
}

