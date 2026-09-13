import axios from "axios";
import type { EmailValidationResponse } from "./types/EmailValidationResponse";

const getEmailValidation = async (
  emailStr: string,
): Promise<EmailValidationResponse> => {
  // TODO could look at cloning corsAnywhere to deploy
  const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
  const baseURL = `https://rapid-email-verifier.fly.dev/api/validate?email=${emailStr}`;
  try {
    const { data } = await axios.get(corsAnywhere + baseURL);
    return data;
  } catch (err) {
    console.error(`Error validating ${emailStr} error: ${err}`);
    throw err;
  }
};

export default getEmailValidation;
