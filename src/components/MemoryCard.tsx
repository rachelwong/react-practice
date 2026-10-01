import classNames from "classnames";
import type { ReactNode } from "react";

interface MemoryCardProps {
  isSelected: boolean;
  isDisabled: boolean;
  hasWon: boolean;
  index: number;
  onSelect: ({ id, index }: { id: string; index: number }) => void;
  card: {
    symbol: ReactNode;
    id: string;
  };
}

const MemoryCard = ({
  isSelected,
  isDisabled,
  hasWon,
  index,
  onSelect,
  card,
}: MemoryCardProps) => {
  return (
    <button
      disabled={isDisabled}
      type="button"
      key={`${card.id}-${index}`}
      onClick={() => {
        onSelect({ id: card.id, index });
      }}
      className={classNames(
        "h-50 w-40 rounded rounded-2xl border-10 border-neutral-100 flex flex-rows items-center justify-center hover:cursor-pointer",
        {
          active: isSelected || hasWon,
        },
      )}
    >
      <div className="w-full h-full flex flex-row items-center justify-center bg-green-100">
        {card.symbol}
      </div>
    </button>
  );
};

export default MemoryCard;
