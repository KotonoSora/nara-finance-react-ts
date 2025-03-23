interface DayItem {
  month: number;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

interface ICalendarDetail {
  nowDate: Date;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  daysOfWeek: string[];
}

interface ICalendarProps {
  calendarDetail: ICalendarDetail;
}
