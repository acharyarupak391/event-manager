import { toast } from "@/components/ui/use-toast";
import { getUserInfoFromLS } from "@/lib/localstorage";
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

  const fetched = useRef<{ years: number[]; countries: string[] }>({
    years: [],
    countries: [],
  });

  const fetchHolidays = useCallback(async (year: number, country: string) => {
    if (
      fetched.current.years.includes(year) &&
      fetched.current.countries.includes(country)
    ) {
      return;
    }

    // don't fetch holidays for future years
    if (year > new Date().getFullYear() || !country) {
      return;
    }

    setLoading(true);
    try {
      const url =
        process.env.NEXT_PUBLIC_API_SERVER +
        "/holidays/" +
        year +
        "?country=" +
        country;

      const response = await fetch(url);
      const data = await response.json();

      if (data?.holidays && Array.isArray(data.holidays)) {
        setHolidays((prev) => [...prev, ...data.holidays]);
        fetched.current.years.push(year);
        fetched.current.countries.push(country);
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
    const country =
      getUserInfoFromLS().country || process.env.NEXT_PUBLIC_FALLBACK_COUNTRY;
    fetchHolidays(new Date().getFullYear(), country!);
  }, [fetchHolidays]);

  return { holidays, loading, fetchHolidays };
};
