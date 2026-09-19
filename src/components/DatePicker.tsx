import classNames from "classnames";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const DatePicker = ({
  label,
  onChange,
  value,
  isError = false,
  errorMessage,
}: {
  label: string;
  onChange: (date: Date) => void;
  value: Date;
  isError?: boolean;
  errorMessage?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Field
      className="flex flex-col gap-y-1 items-start justify-start"
      data-invalid={isError || undefined}
    >
      {label && <FieldLabel htmlFor="date">{label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date"
              className="justify-start font-normal"
            >
              {value ? value.toLocaleDateString() : "Select date"}
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div
            className={classNames("calendar", {
              "border-destructive border-1": isError,
            })}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                }
                setOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {isError && errorMessage && (
        <FieldError className="text-xs text-red-500 text-left">
          {errorMessage}
        </FieldError>
      )}
    </Field>
  );
};

export default DatePicker;
