import axios from "axios";
import type { EmailValidationResponse } from "./types/EmailValidationResponse";

const getEmailValidation = async (
  emailStr: string,
): Promise<EmailValidationResponse> => {
  const baseURL = `/email-api/api/validate?email=${emailStr}`;
  try {
    const { data } = await axios.get(baseURL);
    return data;
  } catch (err) {
    console.error(`Error validating ${emailStr} error: ${err}`);
    throw err;
  }
};

export default getEmailValidation;
