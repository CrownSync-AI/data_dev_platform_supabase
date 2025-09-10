import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DateCalendar>;

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        className={cn("p-3", className)}
        {...props}
      />
    </LocalizationProvider>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };