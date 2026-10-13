import FilmQuizQuestion from "@/components/FilmQuizQuestion";
import FilmQuizResults from "@/components/FilmQuizResults";
import FilmQuizStartScreen from "@/components/FilmQuizStartScreen";
import Layout from "@/components/Layout";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import quizMachine from "@/context/FilmQuizMachine";
import { useActor } from "@xstate/react";
import { intervalToDuration } from "date-fns";
import { InfoIcon, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_TOTAL_POINTS = 100;
const MAX_NUMBER_QUESTIONS = 10;
const MAX_DURATION = 600000; // 10 mins in milliseconds

const formatMsDuration = (ms: number) => {
  const duration = intervalToDuration({ start: 0, end: ms });

  // Use padStart to ensure seconds are always two digits (e.g., "05" instead of "5")
  const minutes = duration.minutes || 0;
  const seconds = String(duration.seconds || 0).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const FilmQuiz = () => {
  const globalQuizTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [globalTime, setGlobalTime] = useState<number>(MAX_DURATION);
  const [snapshot, send] = useActor(quizMachine, {
    input: {
      maxNumberPoints: MAX_TOTAL_POINTS,
      totalNumberQuestions: MAX_NUMBER_QUESTIONS,
      maxDuration: MAX_DURATION,
    },
  });

  useEffect(() => {
    if (!snapshot.can({ type: "OUT_OF_TIME" })) {
      return;
    }
    if (globalQuizTimerRef.current !== null) {
      clearTimeout(globalQuizTimerRef.current);
    }

    globalQuizTimerRef.current = setTimeout(() => {
      send({ type: "OUT_OF_TIME" });
    }, snapshot.context.maxDuration);

    return () => {
      if (globalQuizTimerRef.current) {
        clearTimeout(globalQuizTimerRef.current);
      }
    };
  }, [
    send,
    snapshot.can({ type: "OUT_OF_TIME" }),
    snapshot.context.maxDuration,
  ]);

  useEffect(() => {
    if (!snapshot.matches("quiz")) {
      return;
    }

    const handleTimerDisplay = setInterval(() => {
      setGlobalTime((prev) => prev - 1000);
    }, 1000);

    return () => {
      clearInterval(handleTimerDisplay);
    };
  }, [snapshot.matches("quiz")]);

  return (
    <Layout
      title="Film Quiz"
      brief="https://www.reactchallenges.com/challenges/react-quiz"
    >
      <div className="p-6 flex w-full h-auto flex-col items-start justify-start rounded-md border-1 border-neutral-700 gap-y-6">
        {snapshot.hasTag("loading") && (
          <div className="flex flex-col w-full h-auto gap-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        )}
        {/* Start screen  */}
        {snapshot.matches("init") && (
          <FilmQuizStartScreen
            maxDuration={snapshot.context.maxDuration}
            totalNumberQuestions={snapshot.context.totalNumberQuestions}
            maxNumberPoints={snapshot.context.maxNumberPoints}
            onStart={() => {
              console.log("START!");
              send({ type: "START_QUIZ" });
            }}
          />
        )}
        {/* Quiz question  */}
        {snapshot.matches({ quiz: "idle" }) && (
          <div className="quiz-question flex flex-col items-start justify-start w-full h-auto gap-y-6">
            <div className="w-full flex flex-row justify-between items-center">
              <h1 className="text-3xl text-slate-800 font-extra-bold text-left">
                Question # {snapshot.context.currIndex + 1} /{" "}
                {snapshot.context.totalNumberQuestions}
              </h1>
              <p className="text-lg font-extrabold text-slate-900 text-right">
                Timer: {formatMsDuration(globalTime)}
              </p>
            </div>
            <FilmQuizQuestion
              handleSelectAnswer={(val: string) => {
                send({ type: "SUBMIT_ANSWER", answer: val });
              }}
              item={snapshot.context.currQuestion}
            />
          </div>
        )}
        {snapshot.matches({ quiz: "errorQuiz" }) && (
          <Alert className="w-full h-auto">
            <InfoIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              There was an error with processing your quiz request. Try again.
            </AlertDescription>
            <AlertAction>
              <Button onClick={() => send({ type: "START_QUIZ" })}>
                <Play />
                Start New Quiz
              </Button>
            </AlertAction>
          </Alert>
        )}
        {snapshot.matches("end") && (
          <FilmQuizResults
            onStart={() => send({ type: "START_QUIZ" })}
            results={snapshot.context.results}
            maxTotalPoints={snapshot.context.maxNumberPoints}
            totalNumberQuestions={snapshot.context.totalNumberQuestions}
            maxDuration={snapshot.context.maxDuration}
          />
        )}
      </div>
    </Layout>
  );
};

export default FilmQuiz;
