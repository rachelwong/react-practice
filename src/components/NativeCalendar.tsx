import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const daysOfWeek = ["Mo", "Tu", "Wed", "Thu", "Fri", "Sat", "Sun"];

// new Date() -> milliseconds from epoch time (integer)
type NativeCalendarDayType = {
  date: Date;
  isVisible: boolean;
};

const NativeCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const numWeekDays = daysOfWeek.length;

  const monthRender = useMemo(() => {
    const getDaysOfMonth = ({
      year,
      month,
    }: {
      year: number;
      month: number;
    }) => {
      const days = [];

      // start from beginning of the selected month
      const startDate = new Date(year, month, 1);
      // for every day of that month, add to list and increment until end of month
      while (startDate.getMonth() === month) {
        days.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
      return days;
    };

    // positive dayCount = first days of month
    // negative dayCount = last days of month
    const getNumberDaysOfGivenMonth = ({
      year,
      month,
      dayCount,
    }: {
      year: number;
      month: number;
      dayCount: number;
    }): Date[] => {
      const dates: Date[] = [];

      // number of the last day of the given month
      const lastDay = new Date(year, month + 1, 0).getDate();

      if (dayCount > 0) {
        // get first days of month
        for (let day = 1; day <= dayCount; day++) {
          // if go beyond/past last date of the month, dont' add to list of dates
          if (day > lastDay) {
            break;
          }
          // add dates from the right/back of the array
          dates.push(new Date(year, month, day));
        }
      }
      if (dayCount < 0) {
        // get last days of month
        const count = Math.abs(dayCount); // convert to positive

        for (let i = 0; i < count; i++) {
          const dayToAdd = lastDay - i; // count back from the last day
          // don't go all the way past the first day of the month
          if (dayToAdd < 1) {
            break;
          }
          // add dates from the left/start of the array
          dates.unshift(new Date(year, month, dayToAdd));
        }
      }
      return dates;
    };

    const daysOfMonth = getDaysOfMonth({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    }).map((date) => {
      return {
        date,
        isVisible: true,
      };
    });

    // native javascript sunday starts at 0
    const firstDayOfCurrentMonth = daysOfMonth[0].date.getDay(); // prevMonth
    const lastDayOfCurrentMonth = daysOfMonth.at(-1)?.date.getDay() ?? 0; // nextMonth

    // make monday starts at 0
    const leading = (firstDayOfCurrentMonth + 6) % 7;
    const trailing = (lastDayOfCurrentMonth + 6) % 7;

    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );

    const upcomingMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );

    const prevMonthDays =
      leading > 0
        ? getNumberDaysOfGivenMonth({
            year: previousMonth.getFullYear(),
            month: previousMonth.getMonth(),
            dayCount: leading * -1,
          }).map((date) => {
            return {
              date,
              isVisible: false,
            };
          })
        : [];

    const upcomingMonthDays =
      6 - trailing > 0
        ? getNumberDaysOfGivenMonth({
            year: upcomingMonth.getFullYear(),
            month: upcomingMonth.getMonth(),
            dayCount: 6 - trailing,
          }).map((date) => {
            return {
              date,
              isVisible: false,
            };
          })
        : [];

    const totalDaysToRender = [
      ...prevMonthDays,
      ...daysOfMonth,
      ...upcomingMonthDays,
    ];

    return Array.from(
      { length: Math.ceil(totalDaysToRender.length / numWeekDays) },
      (_, index) =>
        totalDaysToRender.slice(
          index * numWeekDays,
          index * numWeekDays + numWeekDays,
        ),
    );
  }, [currentDate]);

  const decrementMonth = () => {
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
    );

    setCurrentDate(previousMonthDate);
    setSelectedDay(null);
  };

  const incrementMonth = () => {
    const nextMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    );

    setCurrentDate(nextMonthDate);
    setSelectedDay(null);
  };

  const formattedSelectedDay = selectedDay
    ? new Intl.DateTimeFormat("en-GB").format(selectedDay)
    : null;

  return (
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
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {JSON.stringify(currentDate.getFullYear())}
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
          {week.map((dayItem: NativeCalendarDayType) => {
            return (
              <button
                disabled={!dayItem.isVisible}
                onClick={() => {
                  if (dayItem.date) {
                    setSelectedDay(dayItem.date!);
                  }
                }}
                key={dayItem.date.getDate()}
                className={`${dayItem.isVisible ? "hover:cursor-pointer text-slate-800 border-1 border-neutral-800" : "text-neutral-200"} w-full h-full rounded-10 text-center flex flex-row items-center justify-center ${selectedDay === dayItem.date ? "bg-purple-200" : "bg-white"}`}
              >
                {dayItem.date.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default NativeCalendar;
