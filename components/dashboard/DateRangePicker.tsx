"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<Date>();
  const [preset, setPreset] = React.useState("last-7-days");

  const handlePresetChange = (value: string) => {
    setPreset(value);
    const today = new Date();
    
    switch (value) {
      case "today":
        setDate(today);
        break;
      case "last-7-days":
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        setDate(weekAgo);
        break;
      case "last-30-days":
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        setDate(monthAgo);
        break;
      case "custom":
        setDate(undefined);
        break;
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="last-7-days">Last 7 days</SelectItem>
          <SelectItem value="last-30-days">Last 30 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
      
      {preset === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
