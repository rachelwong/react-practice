import {
  EXPENSE_CATEGORIES,
  EXPENSE_TIME_FILTER,
} from "@/constants/ExpenseTracker";
import {
  clearAllFilters,
  setCategoryFilter,
  setTimeFilters,
} from "@/context/expenseReducer";
import { useExpenseDispatch, useExpenseSelector } from "@/context/expenseStore";
import { convertForSelect } from "@/utils";
import { BookmarkX } from "lucide-react";
import SelectField from "./SelectField";
import { Button } from "./ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "./ui/combobox";

const ExpenseFilter = () => {
  const { categoryFilter, timeFilter } = useExpenseSelector(
    (state) => state.expenses,
  );

  const categories = convertForSelect(EXPENSE_CATEGORIES);
  const timeRanges = Object.values(EXPENSE_TIME_FILTER);
  const dispatch = useExpenseDispatch();

  return (
    <div className="w-full h-auto flex flex-col gap-y-2">
      <h3 className="text-lg font-extrabold text-left">Filters</h3>
      <div className="w-full h-auto flex flex-row flex-nowarp gap-x-4 justify-start items-end p-3 bg-sky-100">
        <SelectField
          selectOptions={categories}
          value={categoryFilter}
          onChange={(val: string) => {
            dispatch(setCategoryFilter(val));
          }}
          classnames="w-1/4"
          placeholder="By type"
        />
        <div className="w-1/4">
          <Combobox
            multiple
            value={timeFilter}
            items={timeRanges}
            // onValueChange hands you the whole new selected array, not just the toggled item
            // no need to manually change/toggle through the selection
            onValueChange={(value: string[]) => {
              dispatch(setTimeFilters(value));
            }}
          >
            <ComboboxChips>
              <ComboboxValue>
                {(value: string[]) =>
                  value.map((item) => (
                    <ComboboxChip key={item}>{item}</ComboboxChip>
                  ))
                }
              </ComboboxValue>
              <ComboboxChipsInput placeholder="By timeframe/s" />
              <ComboboxClear />
            </ComboboxChips>
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
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            dispatch(clearAllFilters());
          }}
        >
          <BookmarkX />
          <span>Clear Filters</span>
        </Button>
      </div>
    </div>
  );
};

export default ExpenseFilter;
