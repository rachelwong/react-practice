import getFilmQuiz from "@/services/getFilmQuiz";
import type { QuizItem } from "@/services/types/QuizResponse";
import { decode } from "html-entities";
import { v4 as uuidv4 } from "uuid";
import { assign, fromPromise, setup } from "xstate";

export type QuizItemResult = QuizItem & {
  chosen_answer: string;
};

export interface QuizMachineContextType {
  totalNumberQuestions: number;
  currIndex: number;
  currQuestion: QuizItem | null;
  results: QuizItemResult[];
  timer: number;
  maxNumberPoints: number;
  maxDuration: number;
}

export type QuizMachineEventTypes =
  | { type: "SUBMIT_ANSWER"; answer: string }
  | { type: "START_QUIZ" };

const initialState = {
  totalNumberQuestions: 0,
  currIndex: 0,
  currQuestion: null,
  results: [],
  timer: 0, // TODO
  maxNumberPoints: 0,
  maxDuration: 0,
};

// randomly assign to and timeweight when assigning current question
const PENALTY_RATIO = [0.5, 1, 0];
const TIME_WEIGHT = [1, 1.5, 0.5];

const fetchOneQuizQuestion = fromPromise(async (): Promise<QuizItem | null> => {
  const response = await getFilmQuiz(1);
  return response?.results[0] || null;
});

const quizMachine = setup({
  types: {
    context: {} as QuizMachineContextType,
    events: {} as QuizMachineEventTypes,
    input: {} as {
      maxNumberPoints: number;
      totalNumberQuestions: number;
      maxDuration: number;
    },
  },
  actors: {
    fetchOneQuizQuestion,
  },
  guards: {
    isCurrIndexAtEnd: ({ context }) => {
      return context.currIndex === context.totalNumberQuestions;
    },
  },
  actions: {
    incrementCurrIndex: assign({
      currIndex: ({ context }) => context.currIndex + 1,
    }),
  },
}).createMachine({
  id: "quiz",
  initial: "init",
  context: ({ input }) => ({
    ...initialState,
    maxNumberPoints: input.maxNumberPoints,
    totalNumberQuestions: input.totalNumberQuestions,
    maxDuration: input.maxDuration,
  }),
  states: {
    init: {
      id: "init",
      on: {
        START_QUIZ: {
          target: "quiz",
        },
      },
    },
    quiz: {
      id: "quiz",
      initial: "checkQuizStatus",
      states: {
        checkQuizStatus: {
          tags: ["loading"],
          always: [
            { guard: "isCurrIndexAtEnd", target: "#end" },
            {
              target: "getQuestion",
            },
          ],
        },
        getQuestion: {
          tags: ["loading"],
          invoke: {
            src: "fetchOneQuizQuestion",
            onDone: {
              actions: assign({
                currQuestion: ({ event }) => {
                  if (!event.output) {
                    return null;
                  }
                  const randomPenaltyRatio =
                    PENALTY_RATIO[
                      Math.floor(Math.random()) * PENALTY_RATIO.length
                    ];
                  const randomTimeWeight =
                    TIME_WEIGHT[Math.floor(Math.random()) * TIME_WEIGHT.length];

                  return {
                    ...event.output,
                    id: uuidv4(),
                    // convert html entities in api response
                    question: decode(event.output.question),
                    correct_answer: decode(event.output.correct_answer),
                    incorrect_answers: event.output.incorrect_answers.map((x) =>
                      decode(x),
                    ),
                    penaltyRatio: randomPenaltyRatio,
                    timeWeight: randomTimeWeight,
                  };
                }, // In v5, promise data is in event.output
              }),
              target: "idle",
            },
            onError: {
              target: "errorQuiz",
            },
          },
        },
        idle: {
          on: {
            SUBMIT_ANSWER: {
              actions: [
                "incrementCurrIndex",
                assign({
                  results: ({ context, event }) => {
                    // Unlikely scenario but adding for checks
                    if (!context.currQuestion) {
                      return [...context.results];
                    }
                    return [
                      ...context.results,
                      { ...context.currQuestion, chosen_answer: event.answer },
                    ];
                  },
                  // RESET
                  currQuestion: () => null,
                }),
              ],
              target: "#quiz",
            },
          },
        },
        errorQuiz: {
          tags: "error",
          on: {
            START_QUIZ: {
              target: "#init",
            },
          },
        },
      },
    },
    end: {
      id: "end",
      on: {
        START_QUIZ: {
          target: "#init",
        },
      },
    },
  },
});

export default quizMachine;
