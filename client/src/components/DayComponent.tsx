import { cn } from "@/lib/utils";
import { DayProps } from "react-day-picker";
import { buttonVariants } from "./ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Holiday } from "@/hooks/useHolidays";
import { UserEvent } from "@/hooks/useUserEvents";
import { AddEventForm } from "./AddEventForm";

const DayComponent = ({
  holidays,
  props,
  events,
  refetchUserEvents,
  addingOrUpdating,
  deleteEvent,
  deleting,
}: {
  holidays: Holiday[];
  props: DayProps;
  events: UserEvent[];
  refetchUserEvents: () => void;
  addingOrUpdating: boolean;
  deleteEvent: (email: string, id: number) => Promise<void>;
  deleting: boolean;
}) => {
  const matchingHoliday = holidays.find(
    (holiday) =>
      props.date.toDateString() === new Date(holiday.date).toDateString()
  );

  const matchingEvent = events.find((event) => {
    const eventDate = new Date(event.event_start_date);
    return props.date.toDateString() === eventDate.toDateString();
  });

  const [showForm, setShowForm] = useState(false);

  const isToday = props.date.toDateString() === new Date().toDateString();

  return (
    <Popover open={showForm} onOpenChange={setShowForm}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-16 w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-200 relative",
            showForm && "outline-none ring-2 ring-primary ring-offset-0",
            matchingEvent &&
              "before:absolute before:w-2 before:h-2 before:bg-blue-600 before:rounded-full before:top-2 before:right-2",
            matchingHoliday &&
              "before:absolute before:w-2 before:h-2 before:bg-red-600 before:rounded-full before:top-2 before:left-2"
          )}
          onClick={() => setShowForm(true)}
        >
          <span
            className={cn(
              isToday &&
                "bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center"
            )}
          >
            {props.date.getDate()}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent sideOffset={0} className="w-max max-w-[800px] p-0">
        <AddEventForm
          holiday={matchingHoliday}
          event={matchingEvent}
          date={props.date}
          refetchEvents={refetchUserEvents}
          closePopup={() => setShowForm(false)}
          addingOrUpdating={addingOrUpdating}
          deleteEvent={deleteEvent}
          deleting={deleting}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DayComponent };
