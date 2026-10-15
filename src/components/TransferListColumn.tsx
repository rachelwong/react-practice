import type { TransferItem } from "@/screens/TransferList";
import { Checkbox } from "./ui/checkbox";

interface TransferListColumnProps {
  list: TransferItem[];
  side: "left" | "right";
  setList: (itemId: string) => void;
}

const TransferListColumn = ({
  list,
  side,
  setList,
}: TransferListColumnProps) => {
  return (
    <ul
      className={`${side} basis-1/3 flex flex-col gap-y-6 items-start justify-start w-full p-6 ${side === "left" ? "bg-sky-100" : "bg-violet-100"}`}
    >
      {list.map((item) => (
        <li
          className="flex flex-row items-center justify-start gap-x-6 p-4 bg-white w-full"
          key={item.id}
        >
          <Checkbox
            checked={item.value}
            onCheckedChange={() => setList(item.id)}
            className="w-10 h-10 "
          />
          {item.id}
        </li>
      ))}
    </ul>
  );
};

export default TransferListColumn;
