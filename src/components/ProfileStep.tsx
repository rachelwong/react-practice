import { useMultiStepForm } from "@/context/MultiStepFormContext";
import { Input } from "@base-ui/react/input";
import DateField from "./DateField";
import SelectField from "./SelectField";
import { Field, FieldLabel } from "./ui/field";

const ProfileStep = () => {
  const {
    state: { formData },
    onChangeName,
    validateName,
    onChangeGender,
    genderOptions,
    onChangeDateOfBirth,
    yearValues,
  } = useMultiStepForm();
  return (
    <div className="flex flex-col gap-y-4 bg-amber-100">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => onChangeName(e.target.value)}
          onBlur={(e) => validateName(e.target.value)}
          placeholder="Name"
        />
      </Field>
      {!!formData.nameError && (
        <p className="text-bold text-xs text-red-900">{formData.nameError}</p>
      )}
      <DateField
        label="Date of Birth"
        day={formData.dateOfBirth.day}
        month={formData.dateOfBirth.month}
        year={formData.dateOfBirth.year}
        yearValues={yearValues}
        onDayChange={(val) => onChangeDateOfBirth({ day: val })}
        onMonthChange={(val) => onChangeDateOfBirth({ month: val })}
        onYearChange={(val) => onChangeDateOfBirth({ year: val })}
      />
      <SelectField
        selectOptions={genderOptions}
        value={formData.gender}
        onChange={onChangeGender}
        label={"Gender"}
      />
    </div>
  );
};

export default ProfileStep;
