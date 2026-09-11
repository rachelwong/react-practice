import DateField from "@/components/DateField";
import Layout from "@/components/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { threeYearRange } from "@/constants";
import useBasicForm from "@/hooks/useBasicForm";

const BasicForm = () => {
  const formHeading = (
    <>
      <h3>Basic form</h3>
      <p>Handling form validation with useReducer pattern with no API calls</p>
    </>
  );

  const {
    state,
    onChangeName,
    validateName,
    onChangeCardNumber,
    validateCardNumber,
    clearForm,
    onChangeSameAddress,
    validateCVVnumber,
    onChangeCVVnumber,
    onChangeYear,
    onChangeMonth,
    disableSubmit,
    isFormError,
  } = useBasicForm();

  return (
    <Layout heading={formHeading}>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Basic Payment Form</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Name on Card
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="John Smith"
                  onBlur={(e) => validateName(e.target.value)}
                  onChange={(e) => onChangeName(e.target.value)}
                  value={state.name}
                  aria-invalid={!!state.nameError || undefined}
                />
                {!!state.nameError && (
                  <p className="text-xs text-red-900">{state.nameError}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Card Number
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  onBlur={(e) => validateCardNumber(e.target.value)}
                  onChange={(e) => onChangeCardNumber(e.target.value)}
                  value={state.cardNumber}
                  aria-invalid={!!state.cardNumberError || undefined}
                />
                {!!state.cardNumberError ? (
                  <p className="text-xs text-red-900">
                    {state.cardNumberError}
                  </p>
                ) : (
                  <FieldDescription className="text-xs text-slate-600">
                    Enter your 16-digit card number
                  </FieldDescription>
                )}
              </Field>
              <div className="grid gap-4">
                <DateField
                  month={state.month}
                  year={state.year}
                  yearValues={threeYearRange.map((x) => x.toString())}
                  onYearChange={onChangeYear}
                  onMonthChange={onChangeMonth}
                  error={state.expiryError}
                />
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                  <Input
                    id="checkout-7j9-cvv"
                    placeholder="123"
                    value={state.cvv}
                    aria-invalid={!!state.cvvError || undefined}
                    onBlur={(e) => validateCVVnumber(e.target.value)}
                    onChange={(e) => onChangeCVVnumber(e.target.value)}
                  />
                  {!!state.cvvError && (
                    <p className="text-xs text-red-900">{state.cvvError}</p>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address (optional)</FieldLegend>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox
                  id="checkout-7j9-same-as-shipping-wgm"
                  onCheckedChange={(checked) => {
                    onChangeSameAddress(checked);
                  }}
                  checked={!!state.sameAddress}
                />
                <FieldLabel
                  htmlFor="checkout-7j9-same-as-shipping-wgm"
                  className="font-normal"
                >
                  Same as shipping address
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="vertical">
            {isFormError && (
              <Alert className="max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50 my-3">
                <AlertTitle className="text-md">
                  Form has incorrect data
                </AlertTitle>
                <AlertDescription className="text-xs text-red-700">
                  Update your information or clear the form to restart
                </AlertDescription>
              </Alert>
            )}
            <Button size="lg" type="submit" disabled={disableSubmit}>
              Submit
            </Button>
            <Button
              size="lg"
              variant="outline"
              type="button"
              onClick={() => clearForm()}
            >
              Clear
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Layout>
  );
};

export default BasicForm;
