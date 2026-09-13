import Layout from "@/components/Layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import getEmailValidation from "@/services/getEmailValidation";
import type { EmailValidationResponse } from "@/services/types/EmailValidationResponse";
import { useCallback, useRef, useState, type ChangeEvent } from "react";

const AsyncFieldValidation = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<EmailValidationResponse | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  const isSubmittingRef = useRef<boolean>(false); // to prevent rapid submission

  const onChangeEmail = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setResponse(undefined);
    setEmail(e.target.value);
  };

  const validateEmail = useCallback(async () => {
    // this needs to be outside of try block or it will fall into finally block
    // and the ref will be resetted when it shouldn't
    if (isSubmittingRef.current) {
      return;
    }

    try {
      isSubmittingRef.current = true;

      // this needs to be above the artifical wait
      // so that the button is in the correct loading state when
      // it is immediately clicked
      setError(null);
      setLoading(true);
      setResponse(undefined);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data = await getEmailValidation(email);
      setResponse(data);
    } catch (err) {
      setError(`${err}`);
      console.error(`error validating email inside component ${err}`);
    } finally {
      setEmail("");
      setLoading(false);

      isSubmittingRef.current = false;
    }
    // email needs to be added in the dependency array here
    // otherwise email being sent to the API will be stale and
    // not be validating the most up to date email string provided
  }, [email]);

  return (
    <Layout
      heading={
        <>
          <h3>Email field with Async validation</h3>
          <p>
            Brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/async-form-validation"
              target="_blank"
            >
              https://www.reactgrind.com/problems/async-form-validation
            </a>
          </p>
          <p>
            Also using open source validation service{" "}
            <a
              href="https://rapid-email-verifier.fly.dev/#/default/get_validate"
              target="_blank"
            >
              https://rapid-email-verifier.fly.dev/#/default/get_validate
            </a>
          </p>
          <p>Claude code assisted code review</p>
        </>
      }
    >
      <div className="container w-120 mx-auto my-0">
        <Field>
          <FieldTitle>Email</FieldTitle>
          <Input
            placeholder="Input your email"
            type="email"
            disabled={loading}
            value={email}
            aria-label="email"
            onChange={(e) => onChangeEmail(e)}
          />
        </Field>
        <Button
          disabled={loading}
          size="lg"
          className="my-4"
          type="submit"
          onClick={validateEmail}
        >
          {loading ? "Validating…" : "Submit"}
        </Button>
        {!!response &&
          response?.status?.toUpperCase() === "VALID" &&
          !error &&
          !loading && (
            <Alert
              data-testid="success"
              className="bg-green-100 text-green-700"
            >
              Success! {response?.email} is valid
            </Alert>
          )}
        {((!!response && response?.status?.toUpperCase() !== "VALID") ||
          error) &&
          !loading && (
            <Alert
              className="bg-red-200 text-red-600"
              data-testid="email-error"
            >
              {error || `${response?.email} is invalid`}
            </Alert>
          )}
      </div>
    </Layout>
  );
};

export default AsyncFieldValidation;
