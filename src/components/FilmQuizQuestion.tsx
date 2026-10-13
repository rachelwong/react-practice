import type { QuizItem } from "@/services/types/QuizResponse";
import { randomShuffleArray } from "@/utils";
import parse from "html-react-parser";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";

const FilmQuizQuestion = ({
  item,
  handleSelectAnswer,
}: {
  item: QuizItem | null;
  handleSelectAnswer: (answer: string) => void;
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const allAnswers = useMemo(() => {
    return !!item
      ? randomShuffleArray({
          items: [item.correct_answer, ...item.incorrect_answers],
        })
      : [];
  }, [item?.correct_answer, item?.incorrect_answers, randomShuffleArray]);

  const [selected, setSelected] = useState<string>("");

  if (!item) {
    return <Spinner />;
  }

  useEffect(() => {
    // clear any existing ref
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // timer to prevent calling api too quickly
    // requires at least 5 second gap https://opentdb.com/api_config.php
    timerRef.current = setTimeout(() => {
      setCanSubmit(true);
    }, 5500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 flex w-full h-auto flex-col items-start justify-start rounded-md border-1 border-neutral-700 gap-y-6">
      <div className="flex flex-row justify-end items-center">
        <Button
          disabled={!selected.length || !canSubmit}
          onClick={() => {
            handleSelectAnswer(selected);
          }}
        >
          Next
        </Button>
      </div>
      <div className="w-full flex flex-row justify-between items-center">
        <Badge className="bg-red-100 border-1 border-red-500 text-red-500">
          {item.penaltyRatio}
        </Badge>
        <Badge className="bg-green-200 border-1 border-green-500 text-green-500">
          {item.timeWeight}
        </Badge>
      </div>
      <p className="text-2xl font-extrabold text-left">{item.question}</p>
      <ul className="flex flex-col items-start justify-start h-auto w-full gap-y-6">
        {!!allAnswers.length &&
          allAnswers.map((answer) => (
            <li
              className="flex flex-row items-center justify-start flex-wrap text-lg gap-x-6"
              key={answer}
            >
              <Checkbox
                className="h-6 w-6"
                checked={selected === answer}
                onCheckedChange={() => {
                  if (answer === selected) {
                    setSelected("");
                  } else {
                    setSelected(answer);
                  }
                }}
              />
              <span>{parse(answer)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FilmQuizQuestion;
