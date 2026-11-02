import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateEventStepType } from "@/schema/eventSchema";
import { useActionState } from "react";
import { Spinner } from "./ui/spinner";

interface EventBaseStepProps {
  formData: CreateEventStepType;
  reducerAction: (
    prevState: EventBaseFormState,
    formData: FormData,
  ) => Promise<EventBaseFormState>;
}

export interface EventBaseFormState {
  baseFormData: CreateEventStepType;
  // object only holds the fields that failed
  // for example: {name: 'Name is required'}
  errors: Partial<Record<keyof CreateEventStepType, string>>;
}

const EventBaseStep = ({ formData, reducerAction }: EventBaseStepProps) => {
  const [state, dispatchAction, isPending] = useActionState<
    EventBaseFormState,
    FormData
  >(reducerAction, { baseFormData: formData, errors: {} });

  return (
    <Card className="p-6">
      <CardTitle>Step 1</CardTitle>
      <form action={dispatchAction}>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="event-name">Event name</FieldLabel>
            <Input
              id="event-name"
              name="name"
              aria-invalid={!!state.errors.name}
              defaultValue={state.baseFormData.name}
            />
            {state.errors?.name && <FieldError>{state.errors.name}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-description">Description</FieldLabel>
            <Input
              id="event-description"
              name="description"
              aria-invalid={!!state.errors?.description}
              defaultValue={state.baseFormData.description ?? ""}
            />
            {state.errors?.description && (
              <FieldError>{state.errors.description}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-type">Type</FieldLabel>
            <Input
              id="event-type"
              name="eventType"
              aria-invalid={!!state.errors?.eventType}
              defaultValue={state.baseFormData.eventType ?? undefined}
            />
            {state.errors?.eventType && (
              <FieldError>{state.errors.eventType}</FieldError>
            )}
          </Field>
          <Field className="flex flex-col items-start justify-start">
            <FieldLabel>Online event?</FieldLabel>
            <div className="">
              <Checkbox
                id="onlineEvent"
                name="onlineEvent"
                className="w-6 h-6"
                defaultChecked={state.baseFormData.onlineEvent ?? undefined}
              />
            </div>
          </Field>
        </CardContent>
        <CardAction>
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? <Spinner /> : "Next"}
          </Button>
        </CardAction>
      </form>
    </Card>
  );
};

export default EventBaseStep;
