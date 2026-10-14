import { padLeadingZero } from "@/utils/DateTimeUtils";
import { useState } from "react";
import SelectField from "./SelectField";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type DateType = {
  day: string;
  month: string;
  year: string;
};

interface ReducerProfileStepProps {
  onChangeName: (val: string) => void;
  onChangeGender: (val: string) => void;
  validateName: () => void;
  onChangeDob: (val: string) => void;
  validateDob: (val: string) => void;
  dateOfBirth: { value: string; error: string | null };
  name: { value: string; error: string | null };
  gender?: { value: string; options: string[] };
}

const ReducerProfileStep = ({
  onChangeName,
  onChangeGender,
  validateName,
  onChangeDob,
  validateDob,
  dateOfBirth,
  name,
  gender,
}: ReducerProfileStepProps) => {
  const existingDate = !!dateOfBirth.value ? dateOfBirth.value.split("/") : [];

  const [date, setDate] = useState<DateType>({
    day: existingDate[0] ?? "",
    month: existingDate[1] ?? "",
    year: existingDate[2] ?? "",
  });

  const setDateValue = (field: keyof DateType, value: string) => {
    const next = { ...date, [field]: value.trim() };
    setDate(next);
    onChangeDob(`${next.day}/${next.month}/${next.year}`);
  };

  const handleDateValidate = () => {
    const next = {
      ...date,
      day: padLeadingZero(date.day),
      month: padLeadingZero(date.month),
    };
    // updates local state and useReducer state with the corrected padded values
    setDate(next);
    const dateStr = `${next.day}/${next.month}/${next.year}`;
    onChangeDob(dateStr);
    validateDob(dateStr);
  };

  return (
    <div className="flex flex-col gap-y-4 w-full h-auto">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          type="text"
          value={name.value}
          onChange={(e) => onChangeName(e.target.value)}
          onBlur={validateName}
          placeholder="Name"
        />
      </Field>
      {!!name.error && (
        <p className="text-bold text-xs text-red-900">{name.error}</p>
      )}
      <Field>
        <FieldLabel>Date of Birth</FieldLabel>
        <FieldGroup id="dateOfBirth" className="flex">
          <div
            className="date-of-birth flex flex-row items-start justify-between gap-x-4"
            onBlur={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node | null)) {
                return;
              }
              handleDateValidate();
            }}
          >
            <Input
              maxLength={2}
              value={date.day}
              onChange={(e) => {
                setDateValue("day", e.target.value);
              }}
              placeholder="dd"
            />
            <Input
              maxLength={2}
              value={date.month}
              onChange={(e) => {
                setDateValue("month", e.target.value);
              }}
              placeholder="mm"
            />
            <Input
              maxLength={4}
              value={date.year}
              onChange={(e) => {
                setDateValue("year", e.target.value);
              }}
              placeholder="yyyy"
            />
          </div>
        </FieldGroup>
      </Field>
      {!!dateOfBirth.error && (
        <p className="text-bold text-xs text-red-900">{dateOfBirth.error}</p>
      )}
      {!!gender?.options && (
        <SelectField
          selectOptions={gender.options.map((x) => {
            return { label: x, value: x };
          })}
          value={gender.value}
          onChange={(val) => {
            onChangeGender(val);
          }}
          label={"Gender"}
        />
      )}
    </div>
  );
};

export default ReducerProfileStep;
