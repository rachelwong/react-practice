import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PhysicalEventStepType } from "@/schema/eventSchema";
import { useActionState } from "react";

export interface PhysicalEventFormState {
  physicalFormData: PhysicalEventStepType;
  errors: Partial<Record<keyof PhysicalEventStepType, string>>;
}

interface PhysicalEventStepProps {
  onBack: () => void;
  formData: PhysicalEventStepType;
  reducerAction: (
    prevState: PhysicalEventFormState,
    formDat: FormData,
  ) => Promise<PhysicalEventFormState>;
}

const PhysicalEventStep = ({
  onBack,
  formData,
  reducerAction,
}: PhysicalEventStepProps) => {
  const [state, dispatchAction, isPending] = useActionState<
    PhysicalEventFormState,
    FormData
  >(reducerAction, {
    physicalFormData: formData,
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
              onClick={(e) => e.currentTarget.showPicker()}
              aria-invalid={!!state.errors.startDate}
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
            <FieldLabel htmlFor="event-country">Country</FieldLabel>
            <Input
              id="event-country"
              name="country"
              aria-invalid={!!state.errors.country}
            />
            {state.errors.country && (
              <FieldError>{state.errors.country}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-city">City</FieldLabel>
            <Input
              id="event-city"
              name="city"
              aria-invalid={!!state.errors.city}
            />
            {state.errors.city && <FieldError>{state.errors.city}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-postcode">Postcode</FieldLabel>
            <Input id="event-postcode" name="postCode" />
            {state.errors.postCode && (
              <FieldError>{state.errors.postCode}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-address">Address</FieldLabel>
            <Input
              id="event-address"
              name="address"
              aria-invalid={!!state.errors.address}
            />
            {state.errors.address && (
              <FieldError>{state.errors.address}</FieldError>
            )}
          </Field>
        </CardContent>
        <CardAction className="flex flex-row justify-between items-center w-full">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={() => {
              onBack();
            }}
          >
            Back
          </Button>
          <Button disabled={isPending} size="lg" type="submit">
            Next
          </Button>
        </CardAction>
      </form>
    </Card>
  );
};

export default PhysicalEventStep;
