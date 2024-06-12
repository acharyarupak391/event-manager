import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Label } from "./label";

type InputTagsProps = InputProps & {
  value: string[];
  onValueChange: (values: string[]) => void;
  label?: string;
};

export const InputTags = ({
  value,
  onValueChange,
  label,
  ...props
}: InputTagsProps) => {
  const [pendingDataPoint, setPendingDataPoint] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      // check email validity
      const isValid = inputRef.current?.checkValidity();
      if (!isValid) {
        inputRef.current?.reportValidity();
        return;
      }

      const newDataPoints = new Set([...value, pendingDataPoint]);
      onValueChange(Array.from(newDataPoints));
      setPendingDataPoint("");
    }
  };

  return (
    <div>
      <div className="w-full">
        {label && <Label htmlFor={props.id || "input-tags"}>{label}</Label>}
        <Input
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (e.key === "," || e.key === " ") {
              e.preventDefault();
              addPendingDataPoint();
            }
          }}
          placeholder="Add comma separated values"
          parentClassName="flex-1"
          id={props.id || "input-tags"}
          type="email"
          ref={inputRef}
          {...props}
        />
      </div>

      <div className="border mt-2 rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center max-h-28">
        {value.length > 0 ? (
          value.map((item, idx) => (
            <Badge key={idx} variant="secondary">
              {item}
              <button
                type="button"
                className="w-3 ml-2"
                onClick={() => {
                  onValueChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">
            Input an email and press comma(,) or press enter to enter value here
          </p>
        )}
      </div>
    </div>
  );
};
