import { Calendar } from "./ui/calendar";
import { DayComponent } from "./DayComponent";
import { useHolidays } from "@/hooks/useHolidays";
import { useUserEvents } from "@/hooks/useUserEvents";
import { AddEmail } from "./AddEmail";

const EventCalendar = () => {
  const { holidays } = useHolidays();
  const { events, refetch, addingOrUpdating, deleteEvent, deleting } =
    useUserEvents();

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
