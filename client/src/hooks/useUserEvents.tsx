import { toast } from "@/components/ui/use-toast";
import { getUserInfoFromLS } from "@/lib/localstorage";
import { useCallback, useEffect, useState } from "react";

export interface UserEvent {
  id: number;
  user_name: string;
  user_email: string;
  event_name: string;
  event_description: string;
  event_start_date: Date;
  event_end_date: Date;
  participants: string[];
  created_at: Date;
  timezone: string;
}

export const useUserEvents = () => {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [addingOrUpdating, setAddingOrUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    const { email } = getUserInfoFromLS();

    if (!email) {
      return;
    }

    setAddingOrUpdating(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_SERVER + `/get-events/${email}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data?.events && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while fetching events",
        variant: "destructive",
      });
    }
    setAddingOrUpdating(false);
  }, []);

  const deleteEvent = useCallback(async (email: string, id: number) => {
    setDeleting(true);
    try {
      const url =
        process.env.NEXT_PUBLIC_API_SERVER + `/delete-event/${email}?id=${id}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      await response.json();

      toast({
        title: "Success",
        description: "Event deleted successfully",
        variant: "destructive",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while adding/updating event",
        variant: "destructive",
      });
    }
    setDeleting(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    addingOrUpdating,
    refetch: fetchEvents,
    deleteEvent,
    deleting,
  };
};
