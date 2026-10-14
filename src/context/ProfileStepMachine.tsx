import { DateTimeFormat, GENDER_OPTIONS } from "@/constants";
import { alphabetOnly } from "@/utils";
import { isOver18, isValidDateString } from "@/utils/DateTimeUtils";
import { assign, raise, sendParent, setup, stateIn } from "xstate";

interface ProfileStepMachineContext {
  name: string;
  nameError: string | null;
  dateOfBirth: string;
  dateOfBirthError: string | null;
  gender: string;
  genderOptions: string[];
}

type ProfileStepMachineEvents =
  | {
      type: "ON_CHANGE_NAME";
      value: string;
    }
  | {
      type: "ON_CHANGE_DOB";
      value: string;
    }
  | {
      type: "ON_CHANGE_GENDER";
      value: string;
    }
  | {
      type: "ON_BLUR_NAME";
    }
  | {
      type: "ON_BLUR_DOB";
    }
  | {
      type: "SUBMIT";
    };

const initialState = {
  name: "",
  nameError: null,
  dateOfBirth: "",
  dateOfBirthError: null,
  gender: "",
  genderOptions: Object.values(GENDER_OPTIONS),
};

const profileStepMachine = setup({
  types: {
    context: {} as ProfileStepMachineContext,
    events: {} as ProfileStepMachineEvents,
    input: {} as {
      name: string;
      dateOfBirth: string;
      gender: string;
    },
  },
  actions: {
    submitProfile: sendParent(({ context }) => ({
      type: "PROFILE_SUBMITTED",
      value: {
        name: context.name,
        dateOfBirth: context.dateOfBirth,
        gender: context.gender,
      },
    })),
    setInvalidDateError: assign({
      dateOfBirthError: ({}) => "Invalid date",
    }),
    setDateOfBirthRequiredError: assign({
      dateOfBirthError: ({}) => "Date of birth is required",
    }),
    setInvalidAgeError: assign({
      dateOfBirthError: ({}) => "You must be over the age of 18 years old.",
    }),
    setNameRequiredError: assign({
      nameError: ({}) => "Name is required",
    }),
    setInvalidNameError: assign({
      nameError: ({}) => "Valid name is alphabets only.",
    }),
    clearNameError: assign({
      nameError: ({}) => null,
    }),
    clearDateOfBirthError: assign({
      dateOfBirthError: ({}) => null,
    }),
  },
  guards: {
    isDateOfBirthValid: ({ context }) =>
      context.dateOfBirth.trim().length > 0 &&
      isValidDateString({
        date: context.dateOfBirth,
        dateFormat: DateTimeFormat.DMY,
      }) &&
      isOver18({
        dateOfBirth: context.dateOfBirth,
        dateFormat: DateTimeFormat.DMY,
      }),
    isNameValid: ({ context }) =>
      context.name.trim().length > 0 && alphabetOnly.test(context.name),
    isDateOfBirthEmpty: ({ context }) => {
      return !context.dateOfBirth.trim().length;
    },
    isDateOfBirthInvalid: ({ context }) => {
      return !isValidDateString({
        date: context.dateOfBirth,
        dateFormat: DateTimeFormat.DMY,
      });
    },
    isInvalidAge: ({ context }) => {
      return !isOver18({
        dateOfBirth: context.dateOfBirth,
        dateFormat: DateTimeFormat.DMY,
      });
    },
    isNameEmpty: ({ context }) => {
      return !context.name.trim().length;
    },
    isNameInvalid: ({ context }) => {
      return !alphabetOnly.test(context.name);
    },
  },
}).createMachine({
  id: "profileStepMachine",
  context: ({ input }) => ({
    ...initialState,
    name: input.name,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
  }),
  initial: "editing",
  states: {
    submitted: {
      entry: "submitProfile",
    },
    editing: {
      type: "parallel",
      on: {
        SUBMIT: [
          {
            // machine asks whether the machine is in valid state for both name and dateOfBirth
            guard: stateIn({
              editing: { name: "valid", dateOfBirth: "valid" },
            }),
            target: "submitted",
          },
          // when user click submit button, this make the machine
          // act as if the user had clicked into and
          // then out of the name field and the date of birth field.
          // raise means "send an event to myself, right now".
          // Both events reach every region
          {
            actions: [
              raise({ type: "ON_BLUR_NAME" }),
              raise({ type: "ON_BLUR_DOB" }),
            ],
          },
        ],
      },
      states: {
        name: {
          initial: "idle",
          states: {
            idle: {
              always: { guard: "isNameValid", target: "valid" },
              on: {
                ON_CHANGE_NAME: {
                  target: "idle",
                  actions: [
                    assign({
                      name: ({ event }) => event.value,
                    }),
                    "clearNameError",
                  ],
                },
                ON_BLUR_NAME: [
                  {
                    guard: "isNameEmpty",
                    target: "invalid",
                    actions: "setNameRequiredError",
                  },
                  {
                    guard: "isNameInvalid",
                    actions: "setInvalidNameError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearNameError", // TODO not needed
                  },
                ],
              },
            },
            valid: {
              tags: "success",
              on: {
                ON_CHANGE_NAME: {
                  target: "idle",
                  actions: [
                    assign({
                      name: ({ event }) => event.value,
                    }),
                  ],
                },
                ON_BLUR_NAME: [
                  {
                    guard: "isNameEmpty",
                    target: "invalid",
                    actions: "setNameRequiredError",
                  },
                  {
                    guard: "isNameInvalid",
                    actions: "setInvalidNameError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearNameError", // TODO not needed
                  },
                ],
              },
            },
            invalid: {
              tags: "error",
              on: {
                ON_CHANGE_NAME: {
                  target: "idle",
                  actions: [
                    assign({
                      name: ({ event }) => event.value,
                    }),
                    "clearNameError",
                  ],
                },
                ON_BLUR_NAME: [
                  {
                    guard: "isNameEmpty",
                    target: "invalid",
                    actions: "setNameRequiredError",
                  },
                  {
                    guard: "isNameInvalid",
                    actions: "setInvalidNameError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearNameError", // TODO not needed
                  },
                ],
              },
            },
          },
        },
        dateOfBirth: {
          initial: "idle",
          states: {
            idle: {
              always: { guard: "isDateOfBirthValid", target: "valid" },
              on: {
                ON_CHANGE_DOB: {
                  target: "idle",
                  actions: [
                    assign({
                      dateOfBirth: ({ event }) => event.value,
                    }),
                    "clearDateOfBirthError",
                  ],
                },
                ON_BLUR_DOB: [
                  {
                    guard: "isDateOfBirthEmpty",
                    target: "invalid",
                    actions: "setDateOfBirthRequiredError",
                  },
                  {
                    guard: "isDateOfBirthInvalid",
                    actions: "setInvalidDateError",
                    target: "invalid",
                  },
                  {
                    guard: "isInvalidAge",
                    actions: "setInvalidAgeError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearDateOfBirthError", // TODO not needed
                  },
                ],
              },
            },
            valid: {
              tags: "success",
              on: {
                ON_CHANGE_DOB: {
                  target: "idle",
                  actions: [
                    assign({
                      dateOfBirth: ({ event }) => event.value,
                    }),
                  ],
                },
                ON_BLUR_DOB: [
                  {
                    guard: "isDateOfBirthEmpty",
                    target: "invalid",
                    actions: "setDateOfBirthRequiredError",
                  },
                  {
                    guard: "isDateOfBirthInvalid",
                    actions: "setInvalidDateError",
                    target: "invalid",
                  },
                  {
                    guard: "isInvalidAge",
                    actions: "setInvalidAgeError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearDateOfBirthError", // TODO not needed
                  },
                ],
              },
            },
            invalid: {
              tags: "error",
              on: {
                ON_CHANGE_DOB: {
                  target: "idle",
                  actions: [
                    assign({
                      dateOfBirth: ({ event }) => event.value,
                    }),
                    "clearDateOfBirthError",
                  ],
                },
                ON_BLUR_DOB: [
                  {
                    guard: "isDateOfBirthEmpty",
                    target: "invalid",
                    actions: "setDateOfBirthRequiredError",
                  },
                  {
                    guard: "isDateOfBirthInvalid",
                    actions: "setInvalidDateError",
                    target: "invalid",
                  },
                  {
                    guard: "isInvalidAge",
                    actions: "setInvalidAgeError",
                    target: "invalid",
                  },
                  {
                    target: "valid",
                    actions: "clearDateOfBirthError", // TODO not needed
                  },
                ],
              },
            },
          },
        },
        gender: {
          on: {
            ON_CHANGE_GENDER: {
              actions: assign({
                gender: ({ event }) => event.value,
              }),
            },
          },
        },
      },
    },
  },
});

export default profileStepMachine;
