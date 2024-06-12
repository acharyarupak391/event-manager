import { toast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const fetchedYears = useRef<number[]>([]);

  const fetchHolidays = useCallback(async (year: number) => {
    if (fetchedYears.current.includes(year)) {
      return;
    }

    // don't fetch holidays for future years
    if (year > new Date().getFullYear()) {
      return;
    }

    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_SERVER + "/holidays/" + year;
      const response = await fetch(url);
      const data = await response.json();

      if (data?.holidays && Array.isArray(data.holidays)) {
        setHolidays((prev) => [...prev, ...data.holidays]);
        fetchedYears.current.push(year);
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
  }, []);

  useEffect(() => {
    fetchHolidays(new Date().getFullYear());
  }, [fetchHolidays]);

  return { holidays, loading, fetchHolidays };
};
