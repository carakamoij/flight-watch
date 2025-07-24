"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: { from?: Date; to?: Date } | undefined;
  onChange: (value: { from?: Date; to?: Date } | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Pick a date range",
  disabled = false,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-accent",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value as DateRange}
            onSelect={(newValue) => onChange(newValue as { from?: Date; to?: Date } | undefined)}
            numberOfMonths={2}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            className="bg-popover"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
