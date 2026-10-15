import type {
  CheckState,
  IndexMapType,
  TreeNode,
} from "@/screens/CheckboxGroup";
import type { Dispatch } from "react";
import { Checkbox } from "./ui/checkbox";

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
  const updateChildren = (
    item: TreeNode,
    isChecked: boolean,
    next: CheckState,
  ) => {
    // update itself first
    next[item.id] = isChecked;
    if (!item?.children?.length) {
      return;
    }
    // if it has children, update all its children to have the same state
    item.children?.forEach((child) => updateChildren(child, isChecked, next));
  };

  // from one id it can reach the parent, check all the parent's children,
  // then use parent.id to look up the grandparent,
  // and repeat until it hits null
  const updateParents = (itemId: number, next: CheckState) => {
    // find parent for current item
    const parentOfCurrentItem = indexMap.get(itemId);

    if (!parentOfCurrentItem) {
      return;
    }
    // change parent state to all its sibling shares same state
    next[parentOfCurrentItem.id] = !!parentOfCurrentItem.children?.every(
      (child) => next[child.id],
    );
    // traverse up the tree to find the next grandparent
    updateParents(parentOfCurrentItem.id, next);
  };

  const handleCheckChange = ({
    isChecked,
    item,
  }: {
    isChecked: boolean;
    item: TreeNode;
  }) => {
    setChecked((prev) => {
      // the next being passed along is preserved and tracked as its within the setChecked useState func
      const next = { ...prev };
      // if it has descendants
      // un/check all of them
      updateChildren(item, isChecked, next);
      // check if it has parent
      // if it has parent, find its siblings
      updateParents(item.id, next);

      // set the updated state
      return next;
    });
  };

  return (
    <ul>
      {data.map((item) => (
        <li className="flex flex-col gap-y-6" key={item.id}>
          <div className="flex flex-row gap-x-4 items-center justify-first">
            <Checkbox
              className="h-5 w-5"
              // coerce into boolean value even if initially it is undefined
              checked={!!checked[item.id]}
              onCheckedChange={(check) =>
                handleCheckChange({ isChecked: check, item })
              }
            />
            <p>{item.label}</p>
          </div>
          {item?.children?.length && (
            // indent every round of children
            // pl-6 will add on top
            <div className="pl-6 mb-4">
              <NestedCheckboxList
                data={item.children}
                checked={checked}
                setChecked={setChecked}
                indexMap={indexMap}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NestedCheckboxList;
