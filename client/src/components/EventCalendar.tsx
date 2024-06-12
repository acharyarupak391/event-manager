import { Calendar } from "./ui/calendar";
import { DayComponent } from "./DayComponent";
import { useHolidays } from "@/hooks/useHolidays";
import { useUserEvents } from "@/hooks/useUserEvents";
import { AddEmail } from "./AddEmail";

const EventCalendar = () => {
  const { holidays, fetchHolidays } = useHolidays();
  const { events, refetch, addingOrUpdating, deleteEvent, deleting } =
    useUserEvents();

  const handleMonthChange = (date: Date) => {
    const month = date.getMonth() + 1;

    if (month === 12) {
      fetchHolidays(date.getFullYear() + 1);
      fetchHolidays(date.getFullYear() - 1);
    }
  };

  return (
    <div>
      <Calendar
        className="w-full p-0"
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
