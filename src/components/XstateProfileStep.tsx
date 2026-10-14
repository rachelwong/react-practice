import type profileStepMachine from "@/context/ProfileStepMachine";
import { padLeadingZero } from "@/utils/DateTimeUtils";
import { useSelector } from "@xstate/react";
import { useState } from "react";
import type { ActorRefFrom } from "xstate";
import SelectField from "./SelectField";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type DateType = {
  day: string;
  month: string;
  year: string;
};

interface XstateProfileStepProps {
  actorRef: ActorRefFrom<typeof profileStepMachine>;
}

const XstateProfileStep = ({ actorRef }: XstateProfileStepProps) => {
  const { context } = useSelector(actorRef, (snapshot) => snapshot);

  const existingDate = !!context.dateOfBirth
    ? context.dateOfBirth.split("/")
    : [];

  const [date, setDate] = useState<DateType>({
    day: existingDate[0] ?? "",
    month: existingDate[1] ?? "",
    year: existingDate[2] ?? "",
  });

  const setDateValue = (field: keyof DateType, value: string) => {
    const next = { ...date, [field]: value.trim() };
    setDate(next);
    actorRef.send({
      type: "ON_CHANGE_DOB",
      value: `${next.day}/${next.month}/${next.year}`,
    });
  };

  const handleDateValidate = () => {
    const next = {
      ...date,
      day: padLeadingZero(date.day),
      month: padLeadingZero(date.month),
    };
    // updates local state and useXstate state with the corrected padded values
    setDate(next);
    const dateStr = `${next.day}/${next.month}/${next.year}`;
    actorRef.send({
      type: "ON_CHANGE_DOB",
      value: dateStr,
    });
    actorRef.send({
      type: "ON_BLUR_DOB",
    });
  };

  return (
    <div className="flex flex-col gap-y-4 w-full h-auto">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          type="text"
          value={context.name}
          onChange={(e) =>
            actorRef.send({ type: "ON_CHANGE_NAME", value: e.target.value })
          }
          onBlur={() => actorRef.send({ type: "ON_BLUR_NAME" })}
          placeholder="Name"
        />
      </Field>
      {!!context.nameError && (
        <p className="text-bold text-xs text-red-900">{context.nameError}</p>
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
      {!!context.dateOfBirthError && (
        <p className="text-bold text-xs text-red-900">
          {context.dateOfBirthError}
        </p>
      )}
      {!!context.genderOptions && (
        <SelectField
          selectOptions={context.genderOptions.map((x) => {
            return { label: x, value: x };
          })}
          value={context.gender}
          onChange={(val) => {
            actorRef.send({ type: "ON_CHANGE_GENDER", value: val });
          }}
          label={"Gender"}
        />
      )}
    </div>
  );
};

export default XstateProfileStep;
