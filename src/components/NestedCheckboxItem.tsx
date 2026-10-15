import type { CheckState, TreeNode } from "@/screens/CheckboxGroup";
import type { Dispatch } from "react";
import { Checkbox } from "./ui/checkbox";

interface NestedCheckboxItemProps {
  data: TreeNode;
  checked: CheckState;
  setChecked: Dispatch<React.SetStateAction<CheckState>>;
}

const NestedCheckbox = ({
  data,
  checked,
  setChecked,
}: NestedCheckboxItemProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-4">
      <p className="font-extrabold">{data.label}</p>
      <Checkbox
        checked={checked[data.id]}
        className="h-10 w-10"
        onCheckedChange={() => {
          setChecked((prev) => {
            return { ...prev, [data.id]: !prev[data.id] };
          });
        }}
      />
    </div>
  );
};

export default NestedCheckbox;
