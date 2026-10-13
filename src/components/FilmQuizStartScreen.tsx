import { Play } from "lucide-react";
import { Button } from "./ui/button";

const FilmQuizStartScreen = ({
  maxDuration,
  totalNumberQuestions,
  maxNumberPoints,
  onStart,
}: {
  maxDuration: number;
  totalNumberQuestions: number;
  maxNumberPoints: number;
  onStart: () => void;
}) => {
  const durationInMinutes = maxDuration / 60000;
  const durationInSeconds = maxDuration / 1000;
  const baseTimePerQuestion = Math.ceil(
    durationInSeconds / totalNumberQuestions,
  );

  const basePointsPerQuestion = Math.ceil(
    maxNumberPoints / totalNumberQuestions,
  );

  return (
    <div className="w-full h-auto flex flex-col justify-start items-center gap-y-3">
      <h3 className="text-3xl font-extrabold tet-slate-900">Film Quiz</h3>
      <p>
        Total {durationInMinutes} minutes to complete {totalNumberQuestions}{" "}
        quiz questions for maximum score of {maxNumberPoints}
      </p>
      <p>Each question has different time weight to complete</p>
      <p>
        Different penalty ratio applies to each question if you get it
        wrong.{" "}
      </p>
      <p>One attempt per question, you can't go back</p>
      <p>
        Points per question = {maxNumberPoints} points / {totalNumberQuestions}{" "}
        questions = {basePointsPerQuestion} points
      </p>
      <p>
        Time per question = {durationInSeconds} seconds / {totalNumberQuestions}{" "}
        questions = {baseTimePerQuestion} seconds
      </p>
      <Button
        size="lg"
        onClick={() => {
          onStart();
        }}
      >
        <Play />
        Start Quiz
      </Button>
    </div>
  );
};

export default FilmQuizStartScreen;
