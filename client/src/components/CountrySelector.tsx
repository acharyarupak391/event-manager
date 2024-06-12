import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import countries from "../lib/countries.json";
import { getUserInfoFromLS, setUserInfoInLS } from "@/lib/localstorage";
import { useEffect, useMemo, useState } from "react";

export const CountrySelector = ({
  onValueChange,
}: {
  onValueChange: ({ name, code }: { name: string; code: string }) => void;
}) => {
  const [value, setValue] = useState<string>(
    getUserInfoFromLS().country ||
      process.env.NEXT_PUBLIC_FALLBACK_COUNTRY ||
      countries[0].code
  );

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === value),
    [value]
  );

  const handleChange = (value: string) => {
    const selectedCountry = countries.find((country) => country.code === value);
    if (selectedCountry) {
      setValue(selectedCountry.code);
      onValueChange(selectedCountry);
      setUserInfoInLS((prev) => ({ ...prev, country: selectedCountry.code }));
    }
  };

  return (
    <Select onValueChange={handleChange} value={value} required>
      <SelectTrigger className="w-max ml-auto gap-2" id="timezone-select">
        <SelectValue placeholder="Select a timezone">
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line */}
            <img
              src={selectedCountry?.flag}
              alt={selectedCountry?.name}
              className="w-auto h-4 flex-shrink-0"
            />
            {selectedCountry?.name}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
