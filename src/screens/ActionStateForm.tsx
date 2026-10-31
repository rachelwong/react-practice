import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { anyNumbers, validEmail, validName } from "@/utils";
import { useActionState } from "react";

type SignupFormData = {
  name: string;
  email: string;
  country: string;
  error: { name: string; email: string; country: string } | null;
};

async function reducerAction(_: SignupFormData, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const invalidEmail = !validEmail.test(
    formData.get("email")?.toString() ?? "",
  );
  const invalidName = !validName.test(formData.get("name")?.toString() ?? "");

  const invalidCountry =
    anyNumbers.test(formData.get("country")?.toString() ?? "") ||
    !formData.get("country")?.toString().trim().length;

  const formValidation =
    invalidEmail || invalidName || invalidCountry
      ? {
          name: invalidName ? "Invalid name" : "",
          email: invalidEmail ? "Invalid email" : "",
          country: invalidCountry ? "Invalid country" : "",
        }
      : null;

  return {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    country: formData.get("country")?.toString() ?? "",
    error: formValidation,
  };
}

const ActionStateForm = () => {
  const [state, formAction, isPending] = useActionState<
    SignupFormData,
    FormData
  >(reducerAction, {
    name: "",
    email: "",
    country: "",
    error: null,
  });

  return (
    <ScreenLayout
      title="Form with useActionState"
      brief="https://www.reactchallenges.com/challenges/form-use-action-state"
    >
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <Card className="max-w-lg w-full">
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Form with useActionState</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="name" />
                {state.error?.name && (
                  <FieldError>{state.error?.name}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input name="email" type="email" />
                {state.error?.email && (
                  <FieldError>{state.error?.email}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <Input name="country" />
                {state.error?.country && (
                  <FieldError>{state.error?.country}</FieldError>
                )}
              </Field>
            </CardContent>
            <CardAction>
              <Button type="submit" size="lg" variant="outline">
                {isPending ? <Spinner /> : "Submit"}
              </Button>
            </CardAction>
          </form>
        </Card>
      </div>
    </ScreenLayout>
  );
};

export default ActionStateForm;
