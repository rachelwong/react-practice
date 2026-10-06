import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { DateTimeFormat } from "@/constants";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useMemo, useState } from "react";

const daysOfWeek = ["Mo", "Tu", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CalendarDayType = {
  date?: Date;
  dayOfMonth?: string;
  weekdayIndex?: number;
  isVisible: boolean;
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const numWeekDays = daysOfWeek.length;

  const monthRender = useMemo(() => {
    const daysOfMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    }).map((day) => ({
      date: day,
      dayOfMonth: format(day, "d"),
      // getDay: 0 = Sunday ... 6 = Saturday; shift so 0 = Monday to match daysOfWeek
      weekdayIndex: (getDay(day) + 6) % numWeekDays,
      isVisible: true,
    }));

    const leading = daysOfMonth[0].weekdayIndex; // prevMonth
    const trailing = daysOfMonth.at(-1)?.weekdayIndex ?? 0; // nextMonth

    // last `leading` days of the previous month
    const prevMonthEndingDays =
      leading > 0
        ? eachDayOfInterval({
            start: subDays(endOfMonth(currentMonth), leading),
            end: subDays(endOfMonth(currentMonth), 1),
          }).map((x) => {
            return {
              ...x,
              date: x,
              dayOfMonth: format(x, "d"),
              weekdayIndex: (getDay(x) + 6) % numWeekDays,
              isVisible: false,
            };
          })
        : [];

    const nextMonth = addMonths(currentMonth, 1);
    // first `6 - trailing` days of the next month (day 1 onwards)
    const nextMonthStart = startOfMonth(nextMonth);

    const nextMonthStartingDays =
      6 - trailing > 0
        ? eachDayOfInterval({
            start: nextMonthStart,
            end: addDays(nextMonthStart, 6 - trailing - 1),
          }).map((x) => {
            return {
              date: x,
              dayOfMonth: format(x, "d"),
              weekdayIndex: (getDay(x) + 6) % numWeekDays,
              isVisible: false,
            };
          })
        : [];

    const totalDaysToRender = [
      ...prevMonthEndingDays,
      ...daysOfMonth,
      ...nextMonthStartingDays,
    ];

    return Array.from(
      { length: Math.ceil(totalDaysToRender.length / numWeekDays) },
      (_, index) =>
        totalDaysToRender.slice(
          index * numWeekDays,
          index * numWeekDays + numWeekDays,
        ),
    );
  }, [currentMonth]);

  const decrementMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const incrementMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const formattedSelectedDay = selectedDay
    ? formatInTimeZone(
        selectedDay,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        DateTimeFormat.DMY,
      )
    : null;

  return (
    <Layout
      brief="https://www.reactchallenges.com/challenges/calendar"
      title="Custom calendar"
      description="No limits"
    >
      <div className="max-w-xl mx-auto w-full h-auto flex flex-col items-start justify-start gap-y-3">
        {!!formattedSelectedDay && (
          <h3 className="text-2xl text-slate-700 mx-auto text-center">
            Selected: {formattedSelectedDay}
          </h3>
        )}
        <div className="flex flex-row justify-center items-center gap-x-4 text-center mx-auto w-full">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              decrementMonth();
            }}
          >
            Prev
          </Button>
          <p className="text-center font-extrabold">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {JSON.stringify(currentMonth.getFullYear())}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              incrementMonth();
            }}
          >
            Next
          </Button>
        </div>
        <div className="days-of-week grid grid-cols-7 gap-x-4 w-full h-10">
          {daysOfWeek.map((dayLabel) => {
            return (
              <div
                key={dayLabel}
                className="w-full h-full bg-neutral-100 rounded-10 text-center flex flex-row items-center justify-center"
              >
                {dayLabel}
              </div>
            );
          })}
        </div>
        {monthRender.map((week) => (
          <div
            key={JSON.stringify(week)}
            className="week grid grid-cols-7 gap-x-4 w-full h-10"
          >
            {week.map((day: CalendarDayType) => {
              if (day.isVisible) {
                return (
                  <button
                    onClick={() => {
                      if (day.date) {
                        setSelectedDay(day.date!);
                      }
                    }}
                    key={day.dayOfMonth}
                    className="hover:cursor-pointer w-full h-full border-1 border-neutral-800 rounded-10 text-center flex flex-row items-center justify-center"
                  >
                    {day.dayOfMonth}
                  </button>
                );
              }
              return (
                <div
                  key={day.weekdayIndex}
                  className="invisible-days w-full h-full bg-white rounded-10 text-center flex flex-row items-center justify-cente text-neutral-100"
                >
                  {day.dayOfMonth}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Calendar;
