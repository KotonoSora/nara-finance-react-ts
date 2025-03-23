import clsx from "clsx";

export default function DayCell(props: DayItem) {
  const { month, day, isCurrentMonth, isWeekend, isToday } = props;

  return (
    <div
      className={clsx(
        `p-4 text-center flex justify-center items-start border`,
        {
          "text-destructive": isWeekend,
          "text-foreground": isCurrentMonth && !isWeekend,
          "text-muted": !isCurrentMonth,
          "text-primary": isToday && !isWeekend,
        },
      )}
    >
      {day === 1 ? `${day}/${month + 1}` : day}
    </div>
  );
}
