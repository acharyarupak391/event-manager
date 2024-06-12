import { TimeZoneData } from "@/lib/timezones";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { useMemo, useState } from "react";

export const TimezoneSelect = ({
  timezones,
  onChange,
  prev,
}: {
  timezones: TimeZoneData[];
  onChange: (timezone: TimeZoneData) => void;
  prev?: string;
}) => {
  const defaultTimezone = useMemo(() => {
    const currentTimezone = timezones.find((tz) => tz.current) || timezones[0];
    if (prev) {
      return timezones.find((tz) => tz.timezone === prev) || currentTimezone;
    }

    return currentTimezone;
  }, [timezones, prev]);

  const [timezone, setTimezone] = useState<TimeZoneData | null>(
    defaultTimezone
  );

  return (
    <div>
      <Label htmlFor="timezone-select">Select your preferred timezone</Label>

      <Select
        onValueChange={(value) => {
          const selectedTimezone = timezones.find(
            (tz) => tz.timezone === value
          );
          if (selectedTimezone) {
            setTimezone(selectedTimezone);
            onChange(selectedTimezone);
          }
        }}
        value={timezone?.timezone}
        required
      >
        <SelectTrigger className="w-full" id="timezone-select">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>

        <SelectContent>
          {timezones.map((tz) => (
            <SelectItem key={tz.timezone} value={tz.timezone}>
              {tz.timezone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
