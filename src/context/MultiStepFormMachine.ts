import { GENDER_OPTIONS } from "@/constants";
import { assertEvent, assign, setup } from "xstate";

export interface MultiStepFormContextType {
  currIndex: number;
  totalNumberOfSteps: number;
  profile: {
    name: {
      value: string;
      error: string | null;
    };
    dateOfBirth: {
      value: string;
      error: string | null;
    };
    gender?: {
      value: string;
      options: string[];
    };
  };
  account: {
    email: {
      value: string;
      error: string | null;
    };
    password: {
      value: string;
      error: string | null;
    };
  };
}

const genderOptions = Object.values(GENDER_OPTIONS);

const initialState: MultiStepFormContextType = {
  currIndex: 0,
  totalNumberOfSteps: 0,
  profile: {
    name: {
      value: "",
      error: null,
    },
    dateOfBirth: {
      value: "",
      error: null,
    },
    gender: {
      value: "",
      options: genderOptions,
    },
  },
  account: {
    email: {
      value: "",
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
  },
};
type ProfileField = "name" | "dateOfBirth";

type AccountField = "email" | "password";

type MultiStepFormField = AccountField | ProfileField;

const getFieldValue = (
  context: MultiStepFormContextType,
  field: MultiStepFormField,
): string =>
  field === "name" || field === "dateOfBirth"
    ? context.profile[field].value // field is ProfileField here
    : context.account[field].value; // field is AccountField here

export type MultiStepFormEventType =
  | { type: "NAME_CHANGE"; value: string }
  | { type: "NAME_BLUR"; value: string }
  | { type: "DOB_CHANGE"; value: string }
  | { type: "DOB_BLUR"; value: string }
  | { type: "GENDER_CHANGE"; value: string }
  | { type: "EMAIL_CHANGE"; value: string }
  | { type: "EMAIL_BLUR"; value: string }
  | { type: "PASSWORD_CHANGE"; value: string }
  | { type: "PASSWORD_BLUR"; value: string }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESTART" };

const multiStepFormMachine = setup({
  types: {
    context: {} as MultiStepFormContextType,
    events: {} as MultiStepFormEventType,
    input: {} as {
      totalNumberOfSteps: number;
    },
  },
  guards: {
    // when this is declared, it is not attached to any state or event
    // if not assertingEvent, then do it inline inside the event actions itself
    validateName: ({ event }) => {
      assertEvent(event, ["NAME_CHANGE", "NAME_BLUR"]);
      return !!event.value.toString();
    },
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
    }),
    clearNameError: assign({
      profile: ({ context }) => {
        return {
          ...context.profile,
          name: {
            ...context.profile.name,
            error: null,
          },
        };
      },
    }),
  },
}).createMachine({
  id: "multiStepForm",
  initial: "profileStep",
  context: ({ input }) => ({
    ...initialState,
    totalNumberOfSteps: input.totalNumberOfSteps,
  }),
  states: {
    profileStep: {
      tags: "progress",
      id: "profileStep",
      type: "parallel",
      states: {
        name: {
          initial: "empty",
          states: {
            empty: {
              on: {
                NAME_BLUR: [
                  { guard: "validateName", target: "#profileStep.name.valid" },
                  { target: "#profileStep.name.invalid" },
                ],
                NAME_CHANGE: {
                  actions: [
                    assign({
                      profile: ({ context, event }) => {
                        return {
                          ...context.profile,
                          name: {
                            ...context.profile.name,
                            value: event.value,
                          },
                        };
                      },
                    }),
                  ],
                },
              },
            },
            valid: {
              tags: "success",
              on: {
                NAME_BLUR: [
                  { guard: "validateName", target: "#profileStep.name.valid" },
                  { target: "#profileStep.name.invalid" },
                ],
                NAME_CHANGE: {
                  actions: [
                    assign({
                      profile: ({ context, event }) => {
                        return {
                          ...context.profile,
                          name: {
                            ...context.profile.name,
                            value: event.value,
                          },
                        };
                      },
                    }),
                  ],
                },
                NEXT: {
                  target: "#accountStep",
                },
              },
            },
            invalid: {
              tags: "error",
              exit: "clearNameError",
              on: {
                NAME_BLUR: [
                  { guard: "validateName", target: "#profileStep.name.valid" },
                  { target: "#profileStep.name.invalid" },
                ],
                NAME_CHANGE: {
                  actions: [
                    assign({
                      profile: ({ context, event }) => {
                        return {
                          ...context.profile,
                          name: {
                            ...context.profile.name,
                            value: event.value,
                          },
                        };
                      },
                    }),
                  ],
                },
              },
            },
          },
        },
      },
    },
    accountStep: {
      tags: "progress",
      id: "accountStep",
      on: {
        NEXT: {
          target: "reviewStep",
        },
        BACK: {
          target: "profileStep",
        },
        ON_BLUR: {},
        ON_CHANGE: {},
      },
    },
    reviewStep: {
      tags: "final",
      id: "reviewStep",
      on: {
        BACK: {
          target: "accountStep",
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
