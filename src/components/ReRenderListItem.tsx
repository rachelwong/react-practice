import { memo, useEffect, type ChangeEvent } from "react";
import { Input } from "./ui/input";

type ReRenderListItemProps = {
  item: {
    id: string;
    name: string;
    price: number;
  };
  index: number;
  onChange: ({
    e,
    id,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    id: string;
  }) => void;
};

// memo here will tell react to compare old vs new props
//  and skip re-rendering if they're the same:
// i.e. skip me if my props didn't change
const ReRenderListItem = memo(
  ({ item, index, onChange }: ReRenderListItemProps) => {
    useEffect(() => {
      console.error(`RerenderListItem #${index} rendered!`);
    });

    return (
      <div
        className={`bg-slate-${index}00 flex flex-row align-center justify-start gap-x-4 `}
      >
        <p>{item.name}</p>
        <Input
          value={item.price}
          onChange={(e) => {
            onChange({ e, id: item.id });
          }}
        />
      </div>
    );
  },
);

export default ReRenderListItem;
