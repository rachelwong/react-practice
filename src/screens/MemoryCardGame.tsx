import Layout from "@/components/Layout";
import MemoryCard from "@/components/MemoryCard";
import { Button } from "@/components/ui/button";
import { randomShuffleArray } from "@/utils";
import {
  Bridge,
  Carrot,
  Ham,
  Hop,
  Lighthouse,
  RadioTower,
  Rose,
  RotateCcw,
  Skull,
} from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type Attributes,
  type ReactNode,
} from "react";

const NUM_TO_MATCH = 2;

const symbols = [
  { symbol: <RadioTower />, id: "radio" },
  { symbol: <Skull />, id: "skull" },
  { symbol: <Rose />, id: "rose" },
  { symbol: <Carrot />, id: "carrot" },
  { symbol: <Ham />, id: "ham" },
  { symbol: <Hop />, id: "hop" },
  { symbol: <Lighthouse />, id: "lighthouse" },
  { symbol: <Bridge />, id: "bridge" },
];

const cards: { symbol: ReactNode; id: string }[] = symbols
  .flatMap((item) => [item, item]) // duplicate
  .map((x) => {
    if (isValidElement(x.symbol)) {
      return {
        ...x,
        symbol: cloneElement(x.symbol, {
          className: "size-30",
        } as Attributes),
      };
    }
    return x;
  }); // enlarge symbol

const MemoryCardGame = () => {
  const [wins, setWins] = useState<string[]>([]); // max 16
  const [currentSelected, setCurrentSelected] = useState<string[]>([]); // max 2
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState(() =>
    randomShuffleArray({ items: cards }),
  );

  const gameWon = wins.length === symbols.length;

  const validateSelection = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let numUniqueCards = [...new Set(currentSelected)].length;
    if (numUniqueCards !== NUM_TO_MATCH) {
      let newWin = [...new Set(currentSelected)][0];
      setWins((prev) => [...prev, newWin]);
    }
    setCurrentSelected([]);
    setSelectedIndex([]);
  };

  const onSelectCard = async ({ id, index }: { id: string; index: number }) => {
    // only update selection when there are less than 2 cards selected
    if (currentSelected.length < NUM_TO_MATCH + 1) {
      setCurrentSelected((prev) => [...prev, id]);
      setSelectedIndex((prev) => [...prev, index]);
    }
  };

  const resetGame = () => {
    setCurrentSelected([]);
    setSelectedIndex([]);
    setWins([]);
    setShuffledCards(randomShuffleArray({ items: cards }));
  };

  useEffect(() => {
    // only validate when there are two cards
    if (currentSelected.length === NUM_TO_MATCH) {
      validateSelection();
    }
  }, [currentSelected.length]);

  return (
    <Layout
      title="Memory Card game"
      brief={{
        href: "https://www.reactchallenges.com/challenges/memory-card-game",
      }}
    >
      <div className="flex flex-col items-center justify-start mx-auto gap-y-3">
        <h2 className="font-extrabold text-3xl">
          {gameWon
            ? "You've won!"
            : `You have matched ${wins.length} out of ${shuffledCards.length / 2} pairs`}
        </h2>
        <Button
          size="lg"
          onClick={() => {
            resetGame();
          }}
        >
          <RotateCcw />
          Reset
        </Button>
        <div className="grid grid-cols-4 grid-rows-4 gap-4 max-w-3xl mx-auto my-6">
          {shuffledCards.map((card, index) => {
            return (
              <MemoryCard
                key={`${card.id}-${index}`}
                isSelected={selectedIndex.includes(index)}
                isDisabled={currentSelected.length === NUM_TO_MATCH}
                hasWon={wins.includes(card.id)}
                index={index}
                onSelect={onSelectCard}
                card={card}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default MemoryCardGame;
