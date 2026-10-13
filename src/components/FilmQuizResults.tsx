import type { QuizItemResult } from "@/context/FilmQuizMachine";
import { decode } from "html-entities";
import { Play } from "lucide-react";
import { Button } from "./ui/button";

interface FilmQuizResultsProps {
  results: QuizItemResult[];
  maxTotalPoints: number;
  totalNumberQuestions: number;
  onStart: () => void;
}

const FilmQuizResults = ({
  results,
  maxTotalPoints,
  totalNumberQuestions,
  onStart,
}: FilmQuizResultsProps) => {
  const score = results.reduce((acc, cur) => {
    if (cur.chosen_answer === cur.correct_answer) {
      acc += maxTotalPoints / totalNumberQuestions;
    } else {
      acc +=
        (maxTotalPoints / totalNumberQuestions) * -1 * (cur?.penaltyRatio || 0);
    }
    return acc;
  }, 0);

  const formattedScore =
    score % 1 === 0 ? score : Math.round(score * 100) / 100;

  return (
    <div className="flex flex-col p-7 items-start justify-start w-full w-auto gap-y-6">
      <p className="text-3xl font-extrabold text-center">
        Your score: {formattedScore} / {maxTotalPoints}
      </p>
      <ol className="list-decimal w-full text-left h-auto flex flex-col gap-y-3">
        {results.map((result) => {
          const isCorrect = result.correct_answer === result.chosen_answer;
          return (
            <li className="text-left" key={result.id}>
              <p className="text-lg">
                <span className="mr-3">
                  {isCorrect ? decode(`&#9989`) : decode(`&#10060;`)}
                </span>
                {result.question}
              </p>
              {!isCorrect && (
                <p className="italic text-md">
                  Correct answer: {result.correct_answer}. You answered:{" "}
                  {result.chosen_answer}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <Button onClick={() => onStart()}>
        <Play />
        Start new Quiz
      </Button>
    </div>
  );
};

export default FilmQuizResults;
