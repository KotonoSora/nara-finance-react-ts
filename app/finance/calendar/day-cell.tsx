import clsx from "clsx";

export default function DayCell({
  month,
  day,
  isCurrentMonth,
  isWeekend,
  isToday,
}: DayItem) {
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
      {day === 1 ? `${day}/${month + 1}` : day}
    </div>
  );
}
