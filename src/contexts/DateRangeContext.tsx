"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

type PresetDateRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeContextType {
  selectedRange: PresetDateRange;
  dateRange: DateRange;
  setSelectedRange: (range: PresetDateRange) => void;
  setDateRange: (range: DateRange) => void;
  selectPreset: (preset: PresetDateRange) => void;
  selectCustomRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

const STORAGE_KEY = 'dashboard_date_range';

export function DateRangeProvider({ children }: { children: ReactNode }) {
  // Criar datas sem hora para evitar problemas de timezone
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = subDays(today, 1);
  const last7 = subDays(today, 7);
  const last30 = subDays(today, 30);
  const thisMonthStart = startOfMonth(today);
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  // Carregar estado inicial do localStorage ou usar padrão
  const getInitialState = (): { selectedRange: PresetDateRange; dateRange: DateRange } => {
    if (typeof window === 'undefined') {
      return { selectedRange: 'today', dateRange: { from: today, to: today } };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedRange = parsed.selectedRange || 'today';
        const storedDateRange = parsed.dateRange 
          ? { from: new Date(parsed.dateRange.from), to: new Date(parsed.dateRange.to) }
          : getPresetRange('today');
        
        return { selectedRange: storedRange, dateRange: storedDateRange };
      }
    } catch (error) {
      console.warn('Erro ao carregar filtro de data do localStorage:', error);
    }

    return { selectedRange: 'today', dateRange: { from: today, to: today } };
  };

  const getPresetRange = (preset: PresetDateRange): DateRange => {
    switch (preset) {
      case 'today':
        return { from: today, to: today };
      case 'yesterday':
        return { from: yesterday, to: yesterday };
      case 'last7':
        return { from: last7, to: today };
      case 'last30':
        return { from: last30, to: today };
      case 'thisMonth':
        return { from: thisMonthStart, to: today };
      case 'lastMonth':
        return { from: lastMonthStart, to: lastMonthEnd };
      default:
        return { from: today, to: today };
    }
  };

  const initialState = getInitialState();
  const [selectedRange, setSelectedRangeState] = useState<PresetDateRange>(initialState.selectedRange);
  const [dateRange, setDateRangeState] = useState<DateRange>(initialState.dateRange);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          selectedRange,
          dateRange: {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString(),
          },
        }));
      } catch (error) {
        console.warn('Erro ao salvar filtro de data no localStorage:', error);
      }
    }
  }, [selectedRange, dateRange]);

  const setSelectedRange = (range: PresetDateRange) => {
    setSelectedRangeState(range);
    if (range !== 'custom') {
      const presetRange = getPresetRange(range);
      setDateRangeState(presetRange);
    }
  };

  const setDateRange = (range: DateRange) => {
    setDateRangeState(range);
  };

  const selectPreset = (preset: PresetDateRange) => {
    setSelectedRange(preset);
  };

  const selectCustomRange = (range: DateRange) => {
    setSelectedRangeState('custom');
    setDateRangeState(range);
  };

  return (
    <DateRangeContext.Provider
      value={{
        selectedRange,
        dateRange,
        setSelectedRange,
        setDateRange,
        selectPreset,
        selectCustomRange,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRangeContext() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRangeContext deve ser usado dentro de DateRangeProvider');
  }
  return context;
}
