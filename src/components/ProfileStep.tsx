import { useMultiStepForm } from "@/context/MultiStepFormContext";
import { Input } from "@base-ui/react/input";
import DateField from "./DateField";
import { Field, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ProfileStep = () => {
  const {
    state: { formData },
    onChangeName,
    validateName,
    genderOptions,
  } = useMultiStepForm();
  return (
    <div className="flex flex-col gap-y-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
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
      <DateField />
      <Field>
        <FieldLabel>Gender</FieldLabel>
        <Select items={genderOptions}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Gender</SelectLabel>
              {genderOptions.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
};

export default ProfileStep;
