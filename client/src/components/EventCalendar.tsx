import { Calendar } from "./ui/calendar";
import { DayComponent } from "./DayComponent";
import { useHolidays } from "@/hooks/useHolidays";
import { useUserEvents } from "@/hooks/useUserEvents";
import { AddEmail } from "./AddEmail";
import { CountrySelector } from "./CountrySelector";
import { getUserInfoFromLS } from "@/lib/localstorage";
import { useRef } from "react";

const EventCalendar = () => {
  const { holidays, fetchHolidays } = useHolidays();
  const { events, refetch, addingOrUpdating, deleteEvent, deleting } =
    useUserEvents();

  const yearRef = useRef(new Date().getFullYear());

  const handleMonthChange = (date: Date) => {
    const month = date.getMonth() + 1;
    yearRef.current = date.getFullYear();

    if (month === 12) {
      const country =
        getUserInfoFromLS().country || process.env.NEXT_PUBLIC_FALLBACK_COUNTRY;
      fetchHolidays(date.getFullYear() + 1, country!);
      fetchHolidays(date.getFullYear() - 1, country!);
    }
  };

  return (
    <div>
      <div>
        <CountrySelector
          onValueChange={({ code }) => fetchHolidays(yearRef.current, code)}
        />
      </div>

      <Calendar
        className="w-full p-0 mt-4"
        onDayClick={(day) => console.log(day.toISOString())}
        numberOfMonths={2}
        pagedNavigation
        classNames={{
          month: "bg-cyan-50 rounded-lg p-4",
        }}
        onMonthChange={handleMonthChange}
        components={{
          Day: (props) => (
            <DayComponent
              holidays={holidays}
              props={props}
              events={events}
              refetchUserEvents={refetch}
              addingOrUpdating={addingOrUpdating}
              deleteEvent={deleteEvent}
              deleting={deleting}
            />
          ),
        }}
      />

      <AddEmail refetchEvents={refetch} />
    </div>
  );
};

export { EventCalendar };
