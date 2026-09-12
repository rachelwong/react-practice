import { useMultiStepForm } from "@/context/MultiStepFormContext";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const AccountStep = () => {
  const {
    state: { formData },
    onChangeEmail,
    onChangePassword,
    validateEmail,
    validatePassword,
  } = useMultiStepForm();
  return (
    <div className="flex flex-col gap-y-4 bg-pink-100">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onChangeEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          placeholder="email"
        />
      </Field>
      {!!formData.emailError && (
        <p className="text-bold text-xs text-red-900">{formData.emailError}</p>
      )}
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          placeholder="password"
          value={formData.password}
          onBlur={(e) => {
            validatePassword(e.target.value);
          }}
          onChange={(e) => {
            onChangePassword(e.target.value);
          }}
        />
        {!!formData.passwordError && (
          <FieldDescription className="text-bold text-xs text-red-900">
            {formData.passwordError}
          </FieldDescription>
        )}
      </Field>
    </div>
  );
};

export default AccountStep;
