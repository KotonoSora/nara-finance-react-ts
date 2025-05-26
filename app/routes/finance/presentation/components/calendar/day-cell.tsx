import clsx from "clsx";

import type { DayCellProps } from "~/routes/finance/presentation/types/ui.types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function DayCell(props: DayCellProps) {
  const {
    month,
    day,
    isCurrentMonth,
    isWeekend,
    isToday,
    selected,
    onDateClick,
    transactionCount = 0,
    transactionSummary,
    isInRange,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;

  const handleClick = () => {
    if (onDateClick) {
      // Use proper year from current view
      const now = new Date();
      onDateClick(new Date(now.getFullYear(), month, day));
    }
  };

  const baseClassName = clsx(
    "relative p-1 sm:p-2 text-xs sm:text-sm flex justify-center items-center transition-all duration-200",
    "min-h-[60px] sm:min-h-[72px]", // Responsive minimum height for mobile/desktop
    // Base styles
    "hover:bg-accent/50 hover:backdrop-blur-sm",
    "before:absolute before:inset-0 before:z-0",
    "cursor-pointer select-none",
    {
      // Current month styles
      "bg-background": isCurrentMonth && !isWeekend && !isToday && !selected,

      // Weekend styles
      "bg-destructive/5 hover:bg-destructive/10": isWeekend && isCurrentMonth,
      "text-destructive font-medium": isWeekend && isCurrentMonth,

      // Other month styles
      "text-muted-foreground/50 hover:text-muted-foreground": !isCurrentMonth,
      "bg-muted/30": !isCurrentMonth,

      // Today styles
      "before:border-2 before:border-primary": isToday && !selected,
      "text-primary font-semibold": isToday && !selected,

      // Selected styles
      "before:bg-primary": selected,
      "text-primary-foreground font-bold": selected,
      "hover:before:bg-primary/90": selected,

      // Range selection styles
      "bg-primary/20": isInRange && !selected,
    },
  );

  const getTransactionSummaryText = () => {
    if (!transactionCount) return null;
    const summaryText = [];
    if (transactionSummary?.income) {
      summaryText.push(`Income: $${transactionSummary.income.toFixed(2)}`);
    }
    if (transactionSummary?.expense) {
      summaryText.push(`Expenses: $${transactionSummary.expense.toFixed(2)}`);
    }
    return (
      <div className="p-2 text-xs sm:text-sm">
        <div className="font-semibold mb-1">{`${transactionCount} Transaction${
          transactionCount > 1 ? "s" : ""
        }`}</div>
        {summaryText.map((text, i) => (
          <div
            key={i}
            className={clsx("font-medium", {
              "text-chart-2": text.includes("Income"),
              "text-destructive": text.includes("Expenses"),
            })}
          >
            {text}
          </div>
        ))}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={baseClassName}
            onClick={handleClick}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            role="gridcell"
            aria-label={`${day} ${new Date(2024, month).toLocaleString("default", { month: "long" })}${
              transactionCount ? `, ${transactionCount} transactions` : ""
            }`}
          >
            <div className="relative flex flex-col items-center gap-0.5 sm:gap-1">
              <span className="relative z-10 h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full text-xs sm:text-sm">
                {day === 1 ? `${day}/${month + 1}` : day}
              </span>
              {transactionCount > 0 && (
                <div className="flex flex-col items-center text-[8px] sm:text-[10px] leading-tight">
                  {transactionSummary && (
                    <>
                      {transactionSummary.income > 0 && (
                        <span className="text-chart-2 font-medium">
                          +${transactionSummary.income.toFixed(2)}
                        </span>
                      )}
                      {transactionSummary.expense > 0 && (
                        <span className="text-destructive font-medium">
                          -${transactionSummary.expense.toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        {transactionCount > 0 && (
          <TooltipContent side="bottom">
            {getTransactionSummaryText()}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
