import { DROP_ZONE } from "@/constants/Wordage";
import type { NewWordageItem } from "@/hooks/useWordage";
import { CircleCheck, CircleX } from "lucide-react";
import { type DragEvent } from "react";
import { Fragment } from "react/jsx-runtime";

interface NewWordageGameItemProps {
  isDraggable: boolean;
  item: NewWordageItem;
  itemIndex: number;
  onDragOver: ({
    event,
    zone,
    targetIndex,
  }: {
    event: DragEvent<HTMLDivElement>;
    zone: string;
    targetIndex: number;
  }) => void;
  itemToDropBefore: boolean;
  itemToDropAfter: boolean;
  gameOver: boolean;
  onDragStart: ({
    currentIndex,
    zone,
  }: {
    currentIndex: number;
    zone: string;
  }) => void;
  isDragged: boolean;
}

const NewWordageGameItem = ({
  isDraggable,
  item,
  itemIndex,
  onDragOver,
  onDragStart,
  itemToDropBefore,
  gameOver,
  isDragged,
  itemToDropAfter,
}: NewWordageGameItemProps) => {
  const bgColour = !gameOver
    ? "bg-sky-100"
    : item.confirmedCorrect
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <Fragment key={item.value}>
      {/* display a placeholder space BEFORE current item */}
      {itemToDropBefore && (
        <div className="w-full h-10 shrink-0 rounded-lg border-2 border-dashed border-sky-300" />
      )}
      <div
        draggable={isDraggable}
        className={`${bgColour} w-full rounded-lg overflow-hidden h-10 border-1 border-neutral-300 flex flex-row justify-start items-center ${!gameOver && !item.confirmedCorrect ? "hover:cursor-grab" : ""} ${isDragged ? "cursor-grabbing" : ""}`}
        // prevent cards being draggable after loss/win
        onDragStart={() =>
          onDragStart({ currentIndex: itemIndex, zone: DROP_ZONE })
        }
        onDragOver={(e) =>
          onDragOver({
            event: e,
            zone: DROP_ZONE,
            targetIndex: itemIndex,
          })
        }
      >
        <div className="item-number w-10 h-full bg-sky-700 text-white flex flex-col items-center justify-center">
          {!gameOver ? (
            itemIndex + 1
          ) : item.confirmedCorrect ? (
            <CircleCheck />
          ) : (
            <CircleX />
          )}
        </div>
        <div className="text-sky-900 w-full h-auto font-extrabold px-6 flex flex-row justify-between items-center">
          <span>{item.value}</span>
          {!gameOver &&
            (item.confirmedCorrect ? (
              <CircleCheck className="text-white fill-sky-700" />
            ) : (
              <CircleX className="text-white fill-sky-700" />
            ))}
        </div>
      </div>
      {/* display a placeholder space AFTER current item */}
      {itemToDropAfter && (
        <div className="w-full h-10 shrink-0 rounded-lg border-2 border-dashed border-sky-300" />
      )}
    </Fragment>
  );
};

export default NewWordageGameItem;
