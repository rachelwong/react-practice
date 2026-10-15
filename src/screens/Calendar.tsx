import NativeCalendar from "@/components/NativeCalendar";
import ScreenLayout from "@/components/ScreenLayout";
import DateFnsCalendar from "../components/DateFnsCalendar";

const Calendar = () => {
  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/DateFnsCalendar"
      title="Custom Calendars"
    >
      <div className="w-full flex-col items-start justify-start gap-y-20 mb-10">
        <div className="w-full flex flex-col items-start justify-center gap-y-6 h-auto text-center mb-20">
          <h3 className="text-center mx-auto text-lg font-extrabold text-neutral-800">
            Native javascript approach
          </h3>
          <NativeCalendar />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-y-6 h-auto text-center">
          <h3 className="text-center mx-auto text-lg font-extrabold text-neutral-800">
            Using date-fns library
          </h3>
          <DateFnsCalendar />
        </div>
      </div>
    </ScreenLayout>
  );
};

export default Calendar;
