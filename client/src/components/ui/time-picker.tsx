"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";

interface TimePickerProps {
  date: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export function TimePicker({ date, onChange, label }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div>
      {label && <Label>{label}</Label>}

      <div className="flex items-end gap-2">
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs text-gray-600">
            Hours
          </Label>
          <TimePickerInput
            picker="hours"
            date={date}
            setDate={(_date) => onChange(_date || new Date())}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs text-gray-600">
            Minutes
          </Label>
          <TimePickerInput
            picker="minutes"
            date={date}
            setDate={(_date) => onChange(_date || new Date())}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs text-gray-600">
            Seconds
          </Label>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={(_date) => onChange(_date || new Date())}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      </div>
    </div>
  );
}
