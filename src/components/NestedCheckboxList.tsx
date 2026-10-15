import type {
  CheckState,
  IndexMapType,
  TreeNode,
} from "@/screens/CheckboxGroup";
import type { Dispatch } from "react";
import NestedCheckboxItem from "./NestedCheckboxItem";

interface NestedCheckboxListProps {
  data: TreeNode[];
  checked: CheckState;
  setChecked: Dispatch<React.SetStateAction<CheckState>>;
  indexMap: IndexMapType;
}

const NestedCheckboxList = ({
  data,
  checked,
  setChecked,
  indexMap,
}: NestedCheckboxListProps) => {
  return (
    <ul>
      {data.map((item) => (
        <li>
          <NestedCheckboxItem
            checked={checked}
            data={item}
            setChecked={setChecked}
          />
          {item?.children?.length && (
            <NestedCheckboxList
              data={item.children}
              checked={checked}
              setChecked={setChecked}
              indexMap={indexMap}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default NestedCheckboxList;
