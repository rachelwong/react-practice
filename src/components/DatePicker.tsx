import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldLabel } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const DatePicker = ({ label }: { label: string }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Field className="mx-auto w-44">
      <p>date: {JSON.stringify(date)}</p>
      <p>date: {JSON.stringify(open)}</p>
      {label && <FieldLabel htmlFor="date">{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date"
              className="justify-start font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePicker;
