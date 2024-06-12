import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export interface Holiday {
  date: string;
  observed: string;
  country: string;
  name: string;
  public: boolean;
  uuid: string;
  subdivisions?: string[] | undefined;
}

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const url = process.env.NEXT_PUBLIC_API_SERVER + "/holidays";
        const response = await fetch(url);
        const data = await response.json();

        if (data?.holidays && Array.isArray(data.holidays)) {
          setHolidays(data.holidays);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "An error occurred while fetching holidays",
          variant: "destructive",
        });
      }
      setLoading(false);
    })();
  }, []);

  return { holidays, loading };
};
