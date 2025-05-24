import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import DayCell from "~/routes/finance/features/calendar/day-cell";
import { isDateInRange } from "~/routes/finance/shared/utils/date";
import { getTransactionSummaryForDate } from "~/routes/finance/shared/utils/transaction";

export default function Calendar({
  calendarDetail,
  selectedDate,
  currentViewDate,
  onDateSelect,
  onMonthChange,
  onDateRangeSelect,
  transactions,
}: ICalendarProps) {
  const {
    daysInMonth,
    daysOfWeek,
    firstDayOfWeek,
    prevMonth,
    nextMonth,
    currentYear,
    currentMonth,
  } = calendarDetail;

  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const titleCurrentMonth = new Date(
    currentViewDate.getFullYear(),
    currentViewDate.getMonth(),
    1,
  ).toLocaleString("default", { month: "long", year: "numeric" });

  const changeMonth = (increment: number) => {
    const nextDate = new Date(currentViewDate);
    nextDate.setMonth(nextDate.getMonth() + increment);
    onMonthChange(nextDate);
  };

  const handleDragStart = (date: Date) => {
    setDragStart(date);
    setDragEnd(null);
    setIsSelecting(true);
  };

  const handleDragEnter = (date: Date) => {
    if (isSelecting && dragStart) {
      setDragEnd(date);
    }
  };

  const handleDragEnd = () => {
    setIsSelecting(false);
    if (dragStart && dragEnd && onDateRangeSelect) {
      const range = {
        from: dragStart < dragEnd ? dragStart : dragEnd,
        to: dragStart < dragEnd ? dragEnd : dragStart,
      };
      onDateRangeSelect(range);
    }
  };

  const getDayOptions = (date: Date) => {
    const options = {
      month: currentMonth,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isToday: date.toDateString() === new Date().toDateString(),
      selected: selectedDate
        ? selectedDate.toDateString() === date.toDateString()
        : false,
    };

    const summary = getTransactionSummaryForDate(date, transactions);
    const isInDateRange =
      dragStart && dragEnd ? isDateInRange(date, dragStart, dragEnd) : false;

    return {
      ...options,
      selected: selectedDate
        ? selectedDate.getTime() === date.getTime()
        : false,
      onDateClick: () => handleClick(date),
      transactionCount: summary?.count || 0,
      transactionSummary: summary?.summary,
      onMouseDown: () => handleDragStart(date),
      onMouseEnter: () => handleDragEnter(date),
      onMouseUp: handleDragEnd,
      isInRange: isInDateRange,
    };
  };

  const handleClick = (date: Date) => {
    if (!isSelecting) {
      onDateSelect(date);
    }
  };

  const getDaysGrid = () => {
    const days = [];

    // Previous month days
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDate = new Date(
        currentYear,
        prevMonth,
        daysInMonth - firstDayOfWeek + i + 1,
      );
      days.push(getDayOptions(prevMonthDate));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentMonthDate = new Date(currentYear, currentMonth, i);
      days.push(getDayOptions(currentMonthDate));
    }

    // Next month days
    const remainingCells = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDate = new Date(currentYear, nextMonth, i);
      days.push(getDayOptions(nextMonthDate));
    }

    return days;
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-200 p-2 sm:p-3 md:p-4">
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => changeMonth(-1)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent/50 border border-border/30"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="font-semibold text-base sm:text-lg text-foreground">
            {titleCurrentMonth}
          </div>
          <Button
            onClick={() => changeMonth(1)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent/50 border border-border/30"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border/20 rounded-lg overflow-hidden">
          {daysOfWeek.map((day, i) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2 sm:py-3 bg-muted/30"
            >
              {day}
            </div>
          ))}
          {getDaysGrid().map((props, i) => (
            <DayCell key={`${props.month}-${props.day}`} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
}
