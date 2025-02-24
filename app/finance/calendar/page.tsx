import clsx from "clsx";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { Route } from "./+types/page";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar" },
    { name: "description", content: "Calendar for detail" },
  ];
}

interface DayItem {
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

const DayCell = ({ day, isCurrentMonth, isWeekend, isToday }: DayItem) => {
  return (
    <div
      className={clsx(
        `p-4 text-center flex justify-center items-start h-full border border-gray-300`,
        {
          "text-black": isCurrentMonth,
          "text-gray-400": !isCurrentMonth,
          "text-red-500": isWeekend,
          "bg-green-50": isToday,
        },
      )}
    >
      {day}
    </div>
  );
};

export default function Page() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth();
  const today: number = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek: number = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevMonthDays: number = new Date(year, month, 0).getDate();
  const daysOfWeek: string[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  let items: DayItem[] = [
    ...Array.from({ length: firstDayOfWeek }, (_, i) => ({
      day: prevMonthDays - firstDayOfWeek + i + 1,
      isCurrentMonth: false,
      isWeekend: (i + 1) % 7 === 0 || (i + 2) % 7 === 0,
      isToday: false,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      isWeekend:
        (firstDayOfWeek + i) % 7 === 5 || (firstDayOfWeek + i) % 7 === 6,
      isToday:
        i + 1 === today && month === currentMonth && year === currentYear,
    })),
  ];

  while (items.length % 7 !== 0) {
    items.push({
      day: items.length - daysInMonth - firstDayOfWeek + 1,
      isCurrentMonth: false,
      isWeekend: items.length % 7 === 5 || items.length % 7 === 6,
      isToday: false,
    });
  }

  const weeks: DayItem[] = [];
  for (let i = 0; i < items.length; i += 7) {
    const week = items.slice(i, i + 7);
    if (week.some((item) => item.isCurrentMonth)) {
      weeks.push(...week);
    }
  }
  items = weeks;

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="w-screen h-screen p-4 flex flex-col">
      <div className="w-full pb-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => changeMonth(-1)} variant="outline">
            <ChevronLeft size={20} />
          </Button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-xl font-bold flex items-center gap-2"
              >
                {`${year}-${String(month + 1).padStart(2, "0")}`}{" "}
                <ChevronDown size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (date) {
                    setCurrentDate(date);
                  }
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
      <div className="flex-grow grid grid-cols-7 border border-gray-300">
        {items.map((item, index) => (
          <DayCell key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
