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
import { formatMsDuration } from "@/utils/DateTimeUtils";
import { useActor } from "@xstate/react";
import { InfoIcon, Play } from "lucide-react";
import { useEffect, useState } from "react";

const MAX_TOTAL_POINTS = 100;
const MAX_NUMBER_QUESTIONS = 10;
const MAX_DURATION = 600000; // 10 mins in milliseconds

const FilmQuiz = () => {
  const [globalTime, setGlobalTime] = useState<number>(MAX_DURATION);
  const [snapshot, send] = useActor(quizMachine, {
    input: {
      maxNumberPoints: MAX_TOTAL_POINTS,
      totalNumberQuestions: MAX_NUMBER_QUESTIONS,
      maxDuration: MAX_DURATION,
    },
  });

  useEffect(() => {
    if (!snapshot.matches("quiz") || snapshot.matches({ quiz: "errorQuiz" })) {
      return;
    }

    const deadline = Date.now() + snapshot.context.maxDuration;
    // reset for restarting a new quiz
    setGlobalTime(snapshot.context.maxDuration);

    const displayGlobalTimer = setInterval(() => {
      setGlobalTime(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000) * 1000),
      );
    }, 250);

    const globalTimeout = setTimeout(() => {
      send({ type: "OUT_OF_TIME" });
    }, snapshot.context.maxDuration);

    return () => {
      clearInterval(displayGlobalTimer);
      clearTimeout(globalTimeout);
    };
  }, [
    snapshot.matches("quiz"),
    send,
    snapshot.context.maxDuration,
    snapshot.matches({ quiz: "errorQuiz" }),
  ]);

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
              questionTimeout={() => {
                send({ type: "QUESTION_TIME_OUT" });
              }}
              item={snapshot.context.currQuestion}
              baseTimeValue={
                snapshot.context.maxDuration /
                snapshot.context.totalNumberQuestions
              }
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
      <div className="flex flex-col items-center justify-center gap-y-4 my-3">
        <p className="text-3xl text-slate-900 font-extrabold">State machine</p>
        <img
          className="max-w-3xl h-auto"
          src={"/film_quiz_state_machine.png"}
          alt="state machine"
        />
      </div>
    </Layout>
  );
};

export default FilmQuiz;
