import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { OnlineEventStepType } from "@/schema/eventSchema";
import { useActionState } from "react";
import { Spinner } from "./ui/spinner";

export interface OnlineEventFormState {
  onlineFormData: OnlineEventStepType;
  errors: Partial<Record<keyof OnlineEventStepType, string>>;
}

interface OnlineEventStepProps {
  formData: OnlineEventStepType;
  reducerAction: (
    prevState: OnlineEventFormState,
    formData: FormData,
  ) => Promise<OnlineEventFormState>;
  onBack: () => void;
}

const OnlineEventStep = ({
  formData,
  reducerAction,
  onBack,
}: OnlineEventStepProps) => {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, {
    onlineFormData: formData,
    errors: {},
  });

  return (
    <Card className="p-6">
      <CardTitle>Step 2</CardTitle>
      <form action={dispatchAction}>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="event-start-date">Start date</FieldLabel>
            <input
              id="event-start-date"
              type="date"
              name="startDate"
              aria-invalid={!!state.errors.startDate}
              onClick={(e) => e.currentTarget.showPicker()}
            />
            {state.errors.startDate && (
              <FieldError>{state.errors.startDate}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-end-date">End date</FieldLabel>
            <input
              type="date"
              id="event-end-date"
              name="endDate"
              onClick={(e) => e.currentTarget.showPicker()}
              aria-invalid={!!state.errors.endDate}
            />
            {state.errors.endDate && (
              <FieldError>{state.errors.endDate}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-email">Email</FieldLabel>
            <Input
              id="event-email"
              name="email"
              aria-invalid={!!state.errors.email}
            />
            {state.errors.email && (
              <FieldError>{state.errors.email}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel>Registration required?</FieldLabel>
            <div className="">
              <Checkbox
                id="event-registratio-required"
                name="registrationRequired"
                className="w-6 h-6"
              />
            </div>
          </Field>
        </CardContent>
        <CardAction className="flex flex-row justify-between items-center w-full">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              onBack();
            }}
            disabled={isPending}
          >
            Back
          </Button>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? <Spinner /> : "Next"}
          </Button>
        </CardAction>
      </form>
    </Card>
  );
};

export default OnlineEventStep;
