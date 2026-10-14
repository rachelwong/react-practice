import { setup } from "xstate";

export const multiStepFormValidators = {
  name: (value: string) => {},
  dateOfBirth: (value: string) => {},
  email: (value: string) => {},
  password: (value: string) => {},
};

const FormFieldMachine = setup({}).createMachine({});

export default FormFieldMachine;
