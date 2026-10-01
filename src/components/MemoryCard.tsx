import classNames from "classnames";
import { Diamond } from "lucide-react";
import type { ReactNode } from "react";
import "../styles/MemoryCard.scss";

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
      className={
        "card h-50 w-40 rounded rounded-2xl border-10 border-neutral-100 flex flex-rows items-center justify-center hover:cursor-pointer"
      }
    >
      <div
        className={classNames(
          "card__content text-center relative w-full h-full transition-transform duration-1000",
          {
            active: isSelected || hasWon,
          },
        )}
      >
        <div className="card__front absolute w-full h-full top-0 bottom-0 right-0 left-0 p-8 bg-neutral-100 flex items-center justify-center text-black">
          <Diamond size={100} />
        </div>
        <div className="card__back absolute top-0 bottom-0 right-0 left-0 w-full h-full flex flex-row items-center justify-center bg-green-100">
          {card.symbol}
        </div>
      </div>
    </button>
  );
};

export default MemoryCard;
