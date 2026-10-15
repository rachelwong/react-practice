import NestedCheckboxList from "@/components/NestedCheckboxList";
import ScreenLayout from "@/components/ScreenLayout";
import { useMemo, useState } from "react";

const initialState = [
  {
    id: 1,
    label: "Fruits",
    children: [
      { id: 2, label: "Apple" },
      { id: 3, label: "Banana" },
      {
        id: 4,
        label: "Citrus",
        children: [
          { id: 5, label: "Orange" },
          { id: 6, label: "Lemon" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Vegetables",
    children: [
      { id: 8, label: "Carrot" },
      { id: 9, label: "Broccoli" },
    ],
  },
];

/**
 *
 * Top-to-Bottom flow — When a parent is checked or unchecked, all its children follow the same state.
 * Bottom-to-Top flow — When a child’s state changes, we validate whether all of its parent’s children are checked, and update the parent accordingly.
 *
 */

export type TreeNode = {
  id: number;
  label: string;
  children?: TreeNode[];
};

// this is a flattened state {id: un/checked}
// so that you can use the id to immediately find the checked state
export type CheckState = Record<number, boolean>;

// flattened for easier access based on id
// item's id -> item's parent node (all data incl id and children), or null if root.
export type IndexMapType = Map<number, TreeNode | null>;

const buildIndex = ({
  data,
  parent = null,
  indexMap = new Map(),
}: {
  data: TreeNode[];
  parent: TreeNode | null;
  indexMap: IndexMapType;
}) => {
  // for every tree node, create an entry in the indexMap as {id: label}
  // and then check if it has any children
  // if it does, pass that node's children and do the same again recursively
  data.forEach((item) => {
    indexMap.set(item.id, parent);
    if (item?.children?.length) {
      buildIndex({ data: item.children, parent: item, indexMap });
    }
  });
};

const CheckboxGroup = () => {
  // this builds a dictionary that points to the parent label for every object's id
  // no matter where they are situated in the tree
  // use this as a reference to check up the tree as to whether the parent node should be checked

  const indexOfParents = useMemo<IndexMapType>(() => {
    const index = new Map();
    buildIndex({ data: initialState, parent: null, indexMap: index });
    return index;
  }, [initialState]);

  console.log("index", indexOfParents);

  // SSOT for all checkbox states
  const [checked, setChecked] = useState<CheckState>({});

  return (
    <ScreenLayout
      title="Nested checkbox"
      brief="https://medium.com/sltc-sean-learns-to-code/how-i-build-a-nested-checkbox-react-component-7eef982d1ea9"
      description={
        <ul>
          <li>
            If a checkbox is checked / unchecked, all of its descendants should
            become checked / unchecked.
          </li>
          <li>
            If all descendants of a checkbox are checked, that checkbox should
            be checked
          </li>
          <li>
            If any of the descendants of a checkbox is unchecked, that checkbox
            should also be unchecked
          </li>
        </ul>
      }
    >
      <div className="max-w-3xl mx-auto flex flex-col w-full h-auto">
        <NestedCheckboxList
          data={initialState}
          checked={checked}
          setChecked={setChecked}
          indexMap={indexOfParents}
        />
      </div>
    </ScreenLayout>
  );
};

export default CheckboxGroup;
