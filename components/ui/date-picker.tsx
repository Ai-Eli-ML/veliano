"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  disabled?: boolean
  fromDate?: Date // Minimum selectable date
  toDate?: Date // Maximum selectable date
}

export function DatePicker({
  date,
  setDate,
  className,
  disabled = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate: Date | undefined) => {
              setDate(newDate)
              setIsOpen(false)
            }}
            initialFocus
            fromDate={fromDate}
            toDate={toDate}
            defaultMonth={date}
          />
          {date && (
            <div className="p-3 border-t border-border flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDate(undefined)
                  setIsOpen(false)
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
} 