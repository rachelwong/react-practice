import { validEmail, validPassword } from "@/utils";
import { assign, not, sendParent, setup, stateIn } from "xstate";

interface AccountStepMachineContext {
  email: string;
  emailError: string | null;
  password: string;
  passwordError: string | null;
}
const initialState: AccountStepMachineContext = {
  email: "",
  emailError: null,
  password: "",
  passwordError: null,
};

type AccountStepMachineEventType =
  | { type: "ON_CHANGE_EMAIL"; value: string }
  | { type: "ON_CHANGE_PASSWORD"; value: string }
  | { type: "ON_BLUR_EMAIL" }
  | { type: "ON_BLUR_PASSWORD" }
  | { type: "SUBMIT" };

const accountStepMachine = setup({
  types: {
    context: {} as AccountStepMachineContext,
    events: {} as AccountStepMachineEventType,
    input: {} as {
      email: string;
      password: string;
    },
  },
  guards: {
    isInvalidEmail: ({ context }) => !validEmail.test(context.email),
    isEmptyEmail: ({ context }) => !context.email.length,
    isEmptyPassword: ({ context }) => !context.password.length,
    isInvalidPassword: ({ context }) => !validPassword.test(context.password),
    isEmailValid: ({ context }) => validEmail.test(context.email),
    isPasswordValid: ({ context }) => validPassword.test(context.password),
  },
  actions: {
    clearEmailError: assign({
      emailError: null,
    }),
    clearPasswordError: assign({
      passwordError: null,
    }),
    setInvalidPasswordError: assign({
      passwordError:
        "Password must be longer than 8 characters, with at least 1 capital letter, 1 number, and 1 symbol with no spaces.",
    }),
    setEmptyPasswordError: assign({
      passwordError: "Password is required",
    }),
    setEmptyEmailError: assign({
      emailError: "Email is required",
    }),
    setInvalidEmailError: assign({
      emailError: "Input an valid email address.",
    }),
  },
}).createMachine({
  id: "accountStepMachine",
  context: ({ input }) => ({
    ...initialState,
    email: input.email,
    password: input.password,
  }),
  type: "parallel",
  states: {
    email: {
      initial: "idle",
      states: {
        idle: {
          always: { guard: "isEmailValid", target: "valid" },
          on: {
            ON_CHANGE_EMAIL: {
              actions: [
                assign({
                  email: ({ event }) => event.value.trim(),
                }),
                "clearEmailError",
              ],
              target: "idle",
            },
            ON_BLUR_EMAIL: [
              {
                guard: "isEmptyEmail",
                actions: "setEmptyEmailError",
                target: "invalid",
              },
              {
                guard: "isInvalidEmail",
                actions: "setInvalidEmailError",
                target: "invalid",
              },
              {
                actions: "clearEmailError",
                target: "valid",
              },
            ],
          },
        },
        valid: {
          tags: "success",
          on: {
            ON_CHANGE_EMAIL: {
              actions: [
                assign({
                  email: ({ event }) => event.value.trim(),
                }),
                "clearEmailError",
              ],
              target: "idle",
            },
            ON_BLUR_EMAIL: [
              {
                guard: "isEmptyEmail",
                actions: "setEmptyEmailError",
                target: "invalid",
              },
              {
                guard: "isInvalidEmail",
                actions: "setInvalidEmailError",
                target: "invalid",
              },
              {
                actions: "clearEmailError",
                target: "valid",
              },
            ],
          },
        },
        invalid: {
          tags: "error",
          on: {
            ON_CHANGE_EMAIL: {
              actions: [
                assign({
                  email: ({ event }) => event.value.trim(),
                }),
                "clearEmailError",
              ],
              target: "idle",
            },
            ON_BLUR_EMAIL: [
              {
                guard: "isEmptyEmail",
                actions: "setEmptyEmailError",
                target: "invalid",
              },
              {
                guard: "isInvalidEmail",
                actions: "setInvalidEmailError",
                target: "invalid",
              },
              {
                actions: "clearEmailError",
                target: "valid",
              },
            ],
          },
        },
      },
    },
    password: {
      initial: "idle",
      states: {
        idle: {
          always: { guard: "isPasswordValid", target: "valid" },
          on: {
            ON_CHANGE_PASSWORD: {
              actions: [
                assign({
                  password: ({ event }) => event.value.trim(),
                }),
                "clearPasswordError",
              ],
              target: "idle",
            },
            ON_BLUR_PASSWORD: [
              {
                guard: "isEmptyPassword",
                actions: "setEmptyPasswordError",
                target: "invalid",
              },
              {
                guard: "isInvalidPassword",
                actions: "setInvalidPasswordError",
                target: "invalid",
              },
              {
                actions: "clearPasswordError",
                target: "valid",
              },
            ],
          },
        },
        valid: {
          tags: "success",
          on: {
            ON_CHANGE_PASSWORD: {
              actions: [
                assign({
                  password: ({ event }) => event.value.trim(),
                }),
                "clearPasswordError",
              ],
              target: "idle",
            },
            ON_BLUR_PASSWORD: [
              {
                guard: "isEmptyPassword",
                actions: "setEmptyPasswordError",
                target: "invalid",
              },
              {
                guard: "isInvalidPassword",
                actions: "setInvalidPasswordError",
                target: "invalid",
              },
              {
                actions: "clearPasswordError",
                target: "valid",
              },
            ],
          },
        },
        invalid: {
          tags: "error",
          on: {
            ON_CHANGE_PASSWORD: {
              actions: [
                assign({
                  password: ({ event }) => event.value.trim(),
                }),
                "clearPasswordError",
              ],
              target: "idle",
            },
            ON_BLUR_PASSWORD: [
              {
                guard: "isEmptyPassword",
                actions: "setEmptyPasswordError",
                target: "invalid",
              },
              {
                guard: "isInvalidPassword",
                actions: "setInvalidPasswordError",
                target: "invalid",
              },
              {
                actions: "clearPasswordError",
                target: "valid",
              },
            ],
          },
        },
      },
    },
    submit: {
      initial: "notReady",
      states: {
        notReady: {
          always: [
            {
              guard: stateIn({ email: "valid", password: "valid" }),
              target: "ready",
            },
            {
              target: "notReady",
            },
          ],
        },
        ready: {
          // user can update the email to invalid again
          // and submit still remains in ready
          always: {
            guard: not(stateIn({ email: "valid", password: "valid" })),
            target: "notReady",
          },
          on: {
            SUBMIT: {
              actions: sendParent(({ context }) => ({
                type: "ACCOUNT_SUBMITTED",
                value: {
                  email: context.email,
                  password: context.password,
                },
              })),
            },
          },
        },
      },
    },
  },
});

export default accountStepMachine;
