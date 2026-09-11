export const FORM_STEP_ID = {
  ACCOUNT: 0,
  PROFILE: 1,
  REVIEW: 2,
};

export const GENDER = {
  FEMALE: "Female",
  MALE: "Male",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

export type MultiStepFormData = {
  email: string; // account
  password: string; // account
  name: string; // profile
  dateOfBirth: {
    // profile
    day: string;
    month: string;
    year: string;
  };
  gender?: (typeof GENDER)[keyof typeof GENDER];
};

export type MultiStepFormState = MultiStepFormData & {
  emailError: string | null; // basic email validation
  passwordError: string | null; // must be over 8 characters with numbers, at least 1 capital and 1 symbol
  name: string | null; // alphabets, spaces, apostrophes only
  dateOfBirthError: string | null; // must be over 18 as of today
};
