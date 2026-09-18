import {
  EXPENSE_CATEGORIES,
  EXPENSE_TIME_FILTER,
} from "@/constants/ExpenseTracker";
import { convertForSelect } from "@/utils";
import SelectField from "./SelectField";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

interface ExpenseFilterProps {
  onFilterTime: (value: string) => void;
  onFilterType: (
    value: (typeof EXPENSE_TIME_FILTER)[keyof typeof EXPENSE_TIME_FILTER],
  ) => void;
}

const ExpenseFilter = ({ onFilterTime, onFilterType }: ExpenseFilterProps) => {
  const categories = convertForSelect(EXPENSE_CATEGORIES);
  const timeFilters = Object.values(EXPENSE_TIME_FILTER);

  return (
    <div className="w-full h-auto flex flex-col gap-y-2">
      <h3 className="text-lg font-extrabold text-left">Filters</h3>
      <div className="w-full h-auto flex flex-row flex-nowarp gap-x-4 justify-start items-end p-3 bg-sky-100">
        <SelectField
          selectOptions={categories}
          value={null}
          onChange={(val: string) => {
            onFilterTime(val);
          }}
          label={"Category"}
          classnames="w-1/4"
        />
        <div className="w-1/4">
          <Combobox items={timeFilters}>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No time filters found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilter;
