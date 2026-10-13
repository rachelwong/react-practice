import type { QuizItem } from "@/services/types/QuizResponse";
import { randomShuffleArray } from "@/utils";
import { formatMsDuration } from "@/utils/DateTimeUtils";
import parse from "html-react-parser";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";

const FilmQuizQuestion = ({
  item,
  handleSelectAnswer,
  questionTimeout,
  baseTimeValue,
}: {
  item: QuizItem | null;
  handleSelectAnswer: (answer: string) => void;
  questionTimeout: () => void;
  baseTimeValue: number; // base time per question in milliseconds
}) => {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const questionDuration = baseTimeValue * (item?.timeWeight ?? 1);

  const [questionTimeDisplay, setQuestionTimeDisplay] = useState<number>(
    () => questionDuration,
  );

  const allAnswers = useMemo(() => {
    return !!item
      ? randomShuffleArray({
          items: [item.correct_answer, ...item.incorrect_answers],
        })
      : [];
  }, [item?.id]);

  const [selected, setSelected] = useState<string>("");

  // Handling question timeout computed from timeWeight and base time value per question
  useEffect(() => {
    if (!item) {
      return;
    }
    // calculated once so it's the fixed duration value
    const deadline = Date.now() + questionDuration;

    // Date.now() inside this block will move with each tick
    // and the duration will be shorter
    const displayTimer = setInterval(() => {
      // Math.max prevents going below 0
      // display and the timeout needs to not drift apart due to rounding
      // Math.ceil rounds up so that when 0:00 is displayed, the question timesout
      setQuestionTimeDisplay(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000) * 1000),
      );
    }, 250); // 250 instead of 1000, timers are not accurate so a slight delay can cascade
    // Math.ceil calculates and displays correct number, 250ms updates the timer accurately

    const timeout = setTimeout(() => {
      questionTimeout();
    }, questionDuration);

    return () => {
      clearInterval(displayTimer);
      clearTimeout(timeout);
    };
  }, [questionDuration, item?.id]);

  // timer to prevent calling api too quickly
  // requires at least 5 second gap https://opentdb.com/api_config.php
  useEffect(() => {
    const submitTimer = setTimeout(() => {
      setCanSubmit(true);
    }, 5500);

    return () => {
      clearTimeout(submitTimer);
    };
  }, []);

  // if above useEffect this will return too early
  if (!item) {
    return <Spinner />;
  }

  return (
    <div className="p-6 flex w-full h-auto flex-col items-start justify-start rounded-md border-1 border-neutral-700 gap-y-6">
      <div className="flex flex-row justify-between items-center w-full h-auto">
        <p className="text-lg text-slate-900 font-extrabold">
          Time to complete this question {formatMsDuration(questionTimeDisplay)}
        </p>
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
