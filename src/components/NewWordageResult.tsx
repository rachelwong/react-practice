import { GAME_STATUS } from "@/constants/Wordage";
import { decode } from "html-entities";

interface NewWordageResultProps {
  gameStatus: (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
  numGameItems: number;
  numStartItems: number;
  numberCorrect: number;
  lastSubmitCorrectCount: number | null;
}

const NewWordageResult = ({
  gameStatus,
  numGameItems,
  numStartItems,
  numberCorrect,
  lastSubmitCorrectCount,
}: NewWordageResultProps) => {
  return (
    <div className="game-status flex flex-row items-center justify-center gap-x-4 py-4 text-neutral-400 font-extrabold w-full uppercase">
      <div>
        {gameStatus === GAME_STATUS.PLACING &&
          (numGameItems - 1 === numStartItems
            ? `Drag and place ${numStartItems} items from start to end`
            : `Items ${numStartItems} / ${numGameItems}`)}
        {gameStatus === GAME_STATUS.PLAYING &&
          (lastSubmitCorrectCount == null ? (
            `Feeling confident? Hit submit`
          ) : (
            <div className="flex flex-row items-center justify-start gap-x-4">
              <span>{decode("&#10060;")} </span>
              <p>{`Items ${numberCorrect}/${numGameItems} correct`}</p>
            </div>
          ))}
        {gameStatus === GAME_STATUS.WON && (
          <div className="flex flex-row items-center justify-start gap-x-4">
            <span>{decode("&#9989;")} </span>
            <p>Quiz completed!</p>
          </div>
        )}
        {gameStatus === GAME_STATUS.LOST && (
          <div className="flex flex-row items-center justify-start gap-x-4">
            <span>{decode("&#10060;")} </span>
            <p>{`${numberCorrect} / ${numGameItems} correct`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewWordageResult;
