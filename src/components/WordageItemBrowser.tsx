import type { WordageItem } from "@/screens/Wordage";
import { type DragEvent } from "react";

interface WordageItemBrowserProps {
  allAvailableStartItems: WordageItem[];
  pageSize: number;
  onDragStart: (id: string) => void;
  currDragId: string | null;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

const WordageItemBrowser = ({
  allAvailableStartItems,
  pageSize,
  onDragStart,
  currDragId,
  onDrop,
  onDragEnd,
  onDragOver,
}: WordageItemBrowserProps) => {
  const currentPage = allAvailableStartItems.slice(0, pageSize);

  const nextItems = currentPage.slice(1);
  const currDraggable = currentPage[0];

  return (
    <div
      className="start-zone max-w-2xl w-full h-16 relative"
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => {
        onDrop(e);
      }}
    >
      <div
        className={`-z-5 next-items absolute h-full top-0 left-1/2 w-4/5 mx-auto -translate-x-1/2 transition-transform duration-300 ${!!currDragId && !!nextItems.length ? "scale-125" : "scale-100"}`}
      >
        {nextItems.length === 2 && (
          <div className="absolute w-full opacity-75 -z-2 rounded-lg bg-blue-100 text-neutral-500 font-extrabold border-neutral-300 border-1 h-10 px-6 flex flex-row items-center justify-start">
            {nextItems.at(-1)?.id}
          </div>
        )}
        {!!nextItems.length && (
          <div className="absolute w-full -z-1 top-5 rounded-lg bg-blue-100 text-neutral-500 font-extrabold border-neutral-300 border-1 h-10 px-6 flex flex-row items-center justify-start">
            {!!nextItems.length && nextItems[0]?.id}
          </div>
        )}
      </div>
      <div
        draggable
        onDragStart={() => onDragStart(currDraggable.id)}
        onDragEnd={() => onDragEnd()}
        className={`z-0 absolute bottom-0 left-0 curr-draggable w-full rounded-lg text-neutral-500 font-extrabold border-neutral-300 border-1 h-10 px-6 flex flex-row items-center justify-start ${!!currDragId ? "invisible cursor-grabbing" : "visible bg-blue-100"} hover:cursor-grab`}
      >
        <span>{currDraggable?.id}</span>
      </div>
    </div>
  );
};

export default WordageItemBrowser;
