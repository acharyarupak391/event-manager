import { Holiday } from "@/hooks/useHolidays";
import { UserEvent } from "@/hooks/useUserEvents";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TimePicker } from "./ui/time-picker";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import {
  TimeZoneData,
  isTimeError,
  getTimeZonesWithOffset,
  getInitialStartAndEndTime,
} from "@/lib/timezones";
import { TimezoneSelect } from "./TimezoneSelect";
import { useAddOrUpdateEvent } from "@/hooks/useAddOrUpdateEvent";
import { getUserInfoFromLS, setUserInfoInLS } from "@/lib/localstorage";
import { InputTags } from "./ui/input-tags";
import { cn } from "@/lib/utils";

const timezones = getTimeZonesWithOffset();
const currentTimezone = timezones.find((tz) => tz.current) || timezones[0];

export interface FormState {
  name: string;
  email: string;
  eventName: string;
  eventDescription: string;
  eventStart: Date;
  eventEnd: Date;
  participants: string[];
  timezone: TimeZoneData;
}

const AddEventForm = ({
  date,
  holiday,
  event,
  refetchEvents,
  closePopup,
  addingOrUpdating,
  deleteEvent,
  deleting,
}: {
  date: Date;
  holiday?: Holiday;
  event?: UserEvent;
  refetchEvents: () => void;
  closePopup: () => void;
  addingOrUpdating: boolean;
  deleteEvent: (email: string, id: number) => Promise<void>;
  deleting: boolean;
}) => {
  const userInfo = getUserInfoFromLS();

  const { startTime, endTime } = useMemo(() => {
    return getInitialStartAndEndTime(date);
  }, [date]);

  const [formState, setFormState] = useState<FormState>({
    name: event?.user_name || userInfo.name || "",
    email: event?.user_email || userInfo.email || "",
    eventName: event?.event_name || "",
    eventDescription: event?.event_description || "",
    eventStart: event?.event_start_date
      ? new Date(event.event_start_date)
      : startTime,
    eventEnd: event?.event_end_date ? new Date(event.event_end_date) : endTime,
    timezone:
      timezones.find((tz) => tz.timezone === event?.timezone) ||
      timezones.find((tz) => tz.timezone === userInfo?.timezone) ||
      currentTimezone,
    participants: event?.participants || [],
  });

  const { addOrUpdate } = useAddOrUpdateEvent();

  const timeError = useMemo(() => {
    return isTimeError(formState.eventStart, formState.eventEnd);
  }, [formState.eventStart, formState.eventEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitted = await addOrUpdate(formState, event?.id);

      if (submitted) {
        closePopup();
        refetchEvents();
        setUserInfoInLS((prev) => ({
          email: formState.email,
          name: formState.name,
          timezone: formState.timezone.timezone,
          country: prev.country,
        }));
      }
    } catch (error) {
      console.log(`${error}`);
    }
  };

  const handleDelete = async () => {
    if (event) {
      await deleteEvent(formState.email, event.id);
      refetchEvents();
      closePopup();
    }
  };

  const isPastDate = date.getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="p-6">
      <div
        className={cn(
          "p-2 text-sm w-max rounded-md",
          holiday ? "bg-red-50 text-red-800" : "bg-gray-100 text-gray-700"
        )}
      >
        {holiday ? (
          <>
            🎊 Holiday for <span className="font-bold">{holiday.date}</span>:{" "}
            <span className="font-bold italic">{holiday.name}</span>
          </>
        ) : (
          <>
            No holiday for{" "}
            <span className="font-bold">{date.toDateString()}</span>
          </>
        )}
      </div>

      {isPastDate ? (
        <div className="px-2 py-4 text-lg text-gray-600">
          <span>Cannot add event to past dates</span>
        </div>
      ) : userInfo.email ? (
        <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <Input
              parentClassName="flex-1"
              label="Your Name"
              placeholder="John Doe"
              id="user-name"
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              defaultValue={formState.name}
              required
            />
            <Input
              parentClassName="flex-1"
              label="Your Email"
              placeholder="johndoe@example.com"
              id="user-email"
              type="email"
              required
              disabled
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              defaultValue={formState.email}
            />

            <Input
              className="flex-1 disabled:text-gray-800"
              label="Event Name"
              placeholder="Get together"
              id="event-name"
              type="text"
              onChange={(e) =>
                setFormState({ ...formState, eventName: e.target.value })
              }
              defaultValue={formState.eventName}
              required
            />

            <Textarea
              label="Event Description"
              placeholder="Get together with friends. Talk about things. Have a beer!"
              id="event-description"
              onChange={(e) =>
                setFormState({ ...formState, eventDescription: e.target.value })
              }
              defaultValue={formState.eventDescription}
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between gap-6">
                <TimePicker
                  label="From"
                  date={formState.eventStart}
                  onChange={(_date) =>
                    setFormState({ ...formState, eventStart: _date })
                  }
                />
                <TimePicker
                  label="To"
                  date={formState.eventEnd}
                  onChange={(_date) =>
                    setFormState({ ...formState, eventEnd: _date })
                  }
                />
              </div>

              {timeError && (
                <span className="text-xs text-red-400 leading-none">
                  Start time should be at least 2 minutes after current time,
                  and end time should be after start time
                </span>
              )}
            </div>

            <TimezoneSelect
              timezones={timezones}
              onChange={(timezone) =>
                setFormState({ ...formState, timezone: timezone })
              }
              prev={userInfo.timezone}
            />

            <InputTags
              value={formState.participants}
              onValueChange={(participants) =>
                setFormState({ ...formState, participants })
              }
              label="Add Participants"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant={"outline"}
              className=""
              disabled={timeError || addingOrUpdating}
              loading={addingOrUpdating}
              type="submit"
            >
              {event ? "Update event" : "Add event for today"}
            </Button>

            {event && (
              <Button
                variant={"destructive"}
                onClick={() => handleDelete()}
                loading={deleting}
                disabled={deleting}
                type="button"
              >
                Delete event
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="px-2 py-4 text-lg text-gray-600">
          Enter your email to add/view your events.
        </div>
      )}
    </div>
  );
};

export { AddEventForm };
