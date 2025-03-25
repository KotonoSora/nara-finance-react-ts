import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import DayCell from "~/finance/features/calendar/day-cell";
import { isDateInRange } from "~/finance/shared/utils/date";
import { getTransactionSummaryForDate } from "~/finance/shared/utils/transaction";

export default function Calendar({
  calendarDetail,
  selectedDate,
  currentViewDate,
  onDateSelect,
  onMonthChange,
  onDateRangeSelect,
  transactions,
}: ICalendarProps) {
  const { daysOfWeek, currentDate, currentMonth, currentYear } = calendarDetail;

  const year: number = currentViewDate.getFullYear();
  const month: number = currentViewDate.getMonth();

  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  const nextMonth: number = new Date(year, month + 2, 0).getMonth();
  const firstDayOfWeek: number = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonthDays: number = new Date(year, month, 0).getDate();
  const prevMonth: number = new Date(year, month, 0).getMonth();

  const titleCurrentMonth: string = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
  }).format(currentViewDate);

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const changeMonth = (offset: number) => {
    onMonthChange(new Date(year, month + offset, 1));
  };

  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);

  const handleDragStart = (date: Date) => {
    setDragStart(date);
    setDragEnd(null);
  };

  const handleDragEnter = (date: Date) => {
    if (dragStart) {
      setDragEnd(date);
    }
  };

  const handleDragEnd = () => {
    if (dragStart && dragEnd) {
      const [start, end] = [dragStart, dragEnd].sort(
        (a, b) => a.getTime() - b.getTime(),
      );
      onDateRangeSelect?.({ from: start, to: end });
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const createDayItem = (
    date: Date,
    options: {
      month: number;
      day: number;
      isCurrentMonth: boolean;
      isWeekend: boolean;
      isToday: boolean;
    },
  ): DayCellProps => {
    const summary = getTransactionSummaryForDate(date, transactions);
    const isInDateRange =
      dragStart && dragEnd ? isDateInRange(date, dragStart, dragEnd) : false;

    return {
      ...options,
      selected: selectedDate
        ? selectedDate.getTime() === date.getTime()
        : false,
      onDateClick: handleDateClick,
      transactionCount: summary?.count || 0,
      transactionSummary: summary?.summary,
      onMouseDown: () => handleDragStart(date),
      onMouseEnter: () => handleDragEnter(date),
      onMouseUp: handleDragEnd,
      isInRange: isInDateRange,
    };
  };

  const items = [
    // Previous month days
    ...Array.from({ length: firstDayOfWeek }, (_, i) => {
      const date = new Date(
        year,
        prevMonth,
        prevMonthDays - firstDayOfWeek + i + 1,
      );
      return createDayItem(date, {
        month: prevMonth,
        day: prevMonthDays - firstDayOfWeek + i + 1,
        isCurrentMonth: false,
        isWeekend: false,
        isToday: false,
      });
    }),

    // Current month days
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return createDayItem(date, {
        month,
        day: i + 1,
        isCurrentMonth: true,
        isWeekend:
          (firstDayOfWeek + i) % 7 === 5 || (firstDayOfWeek + i) % 7 === 6,
        isToday:
          i + 1 === currentDate &&
          month === currentMonth &&
          year === currentYear,
      });
    }),

    // Next month days
    ...Array.from(
      { length: 7 - ((firstDayOfWeek + daysInMonth) % 7) },
      (_, i) => {
        const date = new Date(year, nextMonth, i + 1);
        return createDayItem(date, {
          month: nextMonth,
          day: i + 1,
          isCurrentMonth: false,
          isWeekend: false,
          isToday: false,
        });
      },
    ),
  ] as DayCellProps[];

  return (
    <div className="rounded-xl border bg-card shadow-sm p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => changeMonth(-1)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-accent/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="font-semibold text-lg">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(currentViewDate)}
          </div>
          <Button
            onClick={() => changeMonth(1)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-accent/50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center border-b pb-4">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px mt-4">
        {items.map((item, index) => (
          <DayCell key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
