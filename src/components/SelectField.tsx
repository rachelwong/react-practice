import type { SelectOptionType } from "@/types/Select";
import classNames from "classnames";
import { Field, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectFieldProps {
  selectOptions: SelectOptionType[];
  value: string | null;
  onChange: (val: string) => void;
  label: string;
  // id?: string; // TODO reconsider whether required
  // error?: string;
  classnames?: string;
}

const SelectField = ({
  selectOptions,
  value,
  onChange,
  label,
  // id,
  // error,
  classnames,
}: SelectFieldProps) => {
  return (
    <Field className={classNames("w-full", classnames)}>
      <FieldLabel className="text-sm" htmlFor={`select-${label}`}>
        {label}
      </FieldLabel>
      <Select
        items={selectOptions}
        value={value}
        onValueChange={(value: string | null) => {
          if (value) {
            onChange(value);
          }
        }}
      >
        <SelectTrigger id={`select-${label}`} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            {selectOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

export default SelectField;
