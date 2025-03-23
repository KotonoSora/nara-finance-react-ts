import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";

import DayCell from "./day-cell";

export default function Calendar(props: ICalendarProps) {
  const { calendarDetail } = props;
  const { nowDate, currentYear, currentMonth, currentDate, daysOfWeek } =
    calendarDetail;

  const [selectedDate, setCurrentDate] = useState<Date>(nowDate);
  const year: number = selectedDate.getFullYear();
  const month: number = selectedDate.getMonth();

  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  const nextMonth: number = new Date(year, month + 2, 0).getMonth();
  const firstDayOfWeek: number = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonthDays: number = new Date(year, month, 0).getDate();
  const prevMonth: number = new Date(year, month, 0).getMonth();

  const titleCurrentMonth: string = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
  }).format(selectedDate);

  const items: DayItem[] = [
    ...Array.from({ length: firstDayOfWeek }, (_, i) => ({
      month: prevMonth,
      day: prevMonthDays - firstDayOfWeek + i + 1,
      isCurrentMonth: false,
      isWeekend: false,
      isToday: false,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      month,
      day: i + 1,
      isCurrentMonth: true,
      isWeekend:
        (firstDayOfWeek + i) % 7 === 5 || (firstDayOfWeek + i) % 7 === 6,
      isToday:
        i + 1 === currentDate && month === currentMonth && year === currentYear,
    })),
    ...Array.from(
      { length: 7 - ((firstDayOfWeek + daysInMonth) % 7) },
      (_, i) => ({
        month: nextMonth,
        day: i + 1,
        isCurrentMonth: false,
        isWeekend: false,
        isToday: false,
      }),
    ),
  ];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="p-4 flex flex-col">
      <div className="w-full pb-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => changeMonth(-1)} variant="outline">
            <ChevronLeft size={20} />
          </Button>
          <div className="text-xl font-bold flex items-center gap-2">
            {titleCurrentMonth}
          </div>
          <Button onClick={() => changeMonth(1)} variant="outline">
            <ChevronRight size={20} />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center font-bold">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="p-2">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow grid grid-cols-7 border">
        {items.map((item, index) => (
          <DayCell key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
