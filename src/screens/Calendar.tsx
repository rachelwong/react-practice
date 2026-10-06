import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";

const daysOfWeek = ["Mo", "Tu", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CalendarDayType = {
  date?: Date;
  dayOfMonth?: string;
  weekdayIndex: number;
  isVisible: boolean;
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getDaysOfMonth = (): CalendarDayType[] =>
    eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    }).map((day) => ({
      date: day,
      dayOfMonth: format(day, "d"),
      // getDay: 0 = Sunday ... 6 = Saturday; shift so 0 = Monday to match daysOfWeek
      weekdayIndex: (getDay(day) + 6) % 7,
      isVisible: true,
    }));

  const startingWeekDayIndex = getDaysOfMonth()[0].weekdayIndex;
  const endingWeekDayIndex = getDaysOfMonth().at(-1)?.weekdayIndex;

  const startingDaysToRender =
    startingWeekDayIndex !== undefined || startingWeekDayIndex !== 0
      ? Array.from(Array(startingWeekDayIndex!).keys()).map((x) => {
          return {
            isVisible: false,
            weekdayIndex: (x + 1) * -1,
          };
        })
      : [];

  const endingDaysToRender =
    (endingWeekDayIndex !== undefined || endingWeekDayIndex !== 0) &&
    endingWeekDayIndex !== 6
      ? Array.from(Array(6 - endingWeekDayIndex!).keys()).map((x) => {
          return {
            isVisible: false,
            weekdayIndex: x + 1,
          };
        })
      : [];

  const totalDaysToRender = [
    ...startingDaysToRender,
    ...getDaysOfMonth(),
    ...endingDaysToRender,
  ];

  const formattedDayRows = Array.from(
    { length: Math.ceil(totalDaysToRender.length / 7) },
    (_, index) => totalDaysToRender.slice(index * 7, index * 7 + 7),
  );

  const decrementMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const incrementMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Layout
      brief="https://www.reactchallenges.com/challenges/calendar"
      title="Custom calendar"
      description="No limits"
    >
      <div className="max-w-xl mx-auto w-full h-auto flex flex-col items-start justify-start gap-y-3">
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
        {formattedDayRows.map((week) => (
          <div
            key={JSON.stringify(week)}
            className="week grid grid-cols-7 gap-x-4 w-full h-10"
          >
            {week.map((day: CalendarDayType) => {
              if (day.isVisible) {
                return (
                  <div
                    key={day.dayOfMonth}
                    className="w-full h-full border-1 border-neutral-800 rounded-10 text-center flex flex-row items-center justify-center"
                  >
                    {day.dayOfMonth}
                  </div>
                );
              }
              return (
                <div
                  key={day.weekdayIndex}
                  className="invisible-days w-full h-full bg-white rounded-10 text-center flex flex-row items-center justify-cente text-white"
                >
                  {day.weekdayIndex}
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
