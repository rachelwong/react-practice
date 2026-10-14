import { assign, setup } from "xstate";
import accountStepMachine from "./AccountStepMachine";
import profileStepMachine from "./ProfileStepMachine";

export interface MultiStepFormContextType {
  currIndex: number;
  totalNumberOfSteps: number;
  profile: {
    name: string;
    dateOfBirth: string;
    gender: string;
  };
  account: {
    email: string;
    password: string;
  };
}

const initialState: MultiStepFormContextType = {
  currIndex: 0,
  totalNumberOfSteps: 0,
  profile: {
    name: "",
    dateOfBirth: "",
    gender: "",
  },
  account: {
    email: "",
    password: "",
  },
};

export type MultiStepFormEventType =
  | { type: "INCREMENT_STEP" }
  | { type: "DECREMENT_STEP" }
  | { type: "RESTART" }
  | {
      type: "PROFILE_SUBMITTED";
      value: { name: string; dateOfBirth: string; gender: string };
    }
  | {
      type: "ACCOUNT_SUBMITTED";
      value: { email: string; password: string };
    };

const multiStepFormMachine = setup({
  types: {
    context: {} as MultiStepFormContextType,
    events: {} as MultiStepFormEventType,
    input: {} as {
      totalNumberOfSteps: number;
    },
    children: {} as {
      profileForm: "profileStepMachine";
      accountForm: "accountStepMachine";
    },
  },
  actors: {
    profileStepMachine,
    accountStepMachine,
  },
  actions: {
    nextStep: assign({
      currIndex: ({ context }) =>
        context.currIndex + 1 <= context.totalNumberOfSteps
          ? context.currIndex + 1
          : context.currIndex,
    }),
    backStep: assign({
      currIndex: ({ context }) =>
        context.currIndex !== 0 ? context.currIndex - 1 : context.currIndex,
    }),
    resetData: assign({
      ...initialState,
      totalNumberOfSteps: ({ context }) => context.totalNumberOfSteps,
    }),
  },
}).createMachine({
  id: "multiStepForm",
  initial: "profile",
  context: ({ input }) => ({
    ...initialState,
    totalNumberOfSteps: input.totalNumberOfSteps,
  }),
  states: {
    profile: {
      tags: "progress",
      id: "profileStep",
      invoke: {
        id: "profileForm",
        src: "profileStepMachine",
        input: ({ context }) => ({
          name: context.profile.name,
          dateOfBirth: context.profile.dateOfBirth,
          gender: context.profile.gender,
        }),
      },
      on: {
        INCREMENT_STEP: {
          actions: "nextStep",
        },
        PROFILE_SUBMITTED: {
          target: "#accountStep",
          actions: [
            assign({ profile: ({ event }) => event.value }),
            "nextStep",
          ],
        },
      },
    },
    account: {
      tags: "progress",
      id: "accountStep",
      invoke: {
        id: "accountForm",
        src: "accountStepMachine",
        input: ({ context }) => ({
          email: context.account.email,
          password: context.account.password,
        }),
      },
      on: {
        DECREMENT_STEP: {
          actions: "backStep",
        },
        ACCOUNT_SUBMITTED: {
          target: "#reviewStep",
          actions: [
            assign({ account: ({ event }) => event.value }),
            "nextStep",
          ],
        },
      },
    },
    review: {
      tags: "final",
      id: "reviewStep",
      on: {
        DECREMENT_STEP: {
          actions: "backStep",
        },
        RESTART: {
          target: "#profileStep",
          actions: "resetData",
        },
      },
    },
  },
});

export default multiStepFormMachine;
