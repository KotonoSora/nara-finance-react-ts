export const DEFAULT_LOCALE = "en-US";

export const CALENDAR_LOCALE: any = {
  "en-US": {
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dateFormat: {
      month: "long",
      year: "numeric",
    } as const,
  },
} as const;

export function getLocalizedDaysOfWeek(
  locale = DEFAULT_LOCALE,
  startFromMonday = true,
): string[] {
  const days =
    CALENDAR_LOCALE[locale]?.daysOfWeek || CALENDAR_LOCALE["en-US"].daysOfWeek;
  if (startFromMonday) {
    return [...days.slice(1), days[0]];
  }
  return days;
}

export function formatDate(date: Date, locale = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(
    locale,
    CALENDAR_LOCALE[locale]?.dateFormat || CALENDAR_LOCALE["en-US"].dateFormat,
  ).format(date);
}
