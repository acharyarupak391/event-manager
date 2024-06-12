import { FormState } from "@/components/AddEventForm";
import { toast, useToast } from "@/components/ui/use-toast";
import { useCallback, useState } from "react";

export const useAddOrUpdateEvent = () => {
  const [loading, setLoading] = useState(false);

  const addOrUpdate = useCallback(async (eventData: FormState, id?: number) => {
    setLoading(true);

    const payload: Record<any, any> = {
      userName: eventData.name,
      userEmail: eventData.email,
      eventName: eventData.eventName,
      eventDescription: eventData.eventDescription,
      eventStartDate: eventData.eventStart.toISOString(),
      eventEndDate: eventData.eventEnd.toISOString(),
      participants: eventData.participants,
      timezone: eventData.timezone.timezone,
    };

    if (id) {
      payload["id"] = id;
    }

    try {
      const url =
        process.env.NEXT_PUBLIC_API_SERVER +
        (id ? "/update-event" : "/add-event");

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${id ? "updated" : "added"} successfully.${
            !id ? "\nYou will be notified once the event starts, via email" : ""
          }`,
          variant: "default",
        });
        return true;
      }
    } catch (error) {
      console.log(`${error}`);
      toast({
        title: "Error",
        description: `An error occurred while ${
          id ? "updating" : "adding"
        } the event`,
        variant: "destructive",
      });
    }

    setLoading(false);
    return false;
  }, []);

  return { addOrUpdate, loading };
};
