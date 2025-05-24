import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

export function prepareCalendarData() {
  const today = new Date();
  return {
    nowDate: today,
    currentYear: today.getFullYear(),
    currentMonth: today.getMonth(),
    currentDate: today.getDate(),
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysInMonth: new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate(),
    firstDayOfWeek: new Date(today.getFullYear(), today.getMonth(), 1).getDay(),
    prevMonthDays: new Date(today.getFullYear(), today.getMonth(), 0).getDate(),
    prevMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1,
    nextMonth: today.getMonth() === 11 ? 0 : today.getMonth() + 1,
  };
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const startDate = start < end ? start : end;
  const endDate = start < end ? end : start;
  return date >= startDate && date <= endDate;
}

export function getTransactionSummaryForDate(date: Date, transactions: any[]) {
  const dateTransactions = transactions.filter(
    (t) => t.date.toDateString() === date.toDateString(),
  );

  return {
    income: dateTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    expense: dateTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
    count: dateTransactions.length,
  };
}

export function getMonthlyCalendarData() {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(
    (date) => ({
      date,
      dayNumber: parseInt(format(date, "d")),
      isToday: format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
    }),
  );

  return {
    days,
    nowDate: today,
    monthName: format(today, "MMMM yyyy"),
  };
}
