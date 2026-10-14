import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface ReducerAccountStepProps {
  onChangeEmail: (val: string) => void;
  onChangePassword: (val: string) => void;
  validateEmail: () => void;
  validatePassword: () => void;
  email: { value: string; error: string | null };
  password: { value: string; error: string | null };
}

const ReducerAccountStep = ({
  onChangeEmail,
  onChangePassword,
  validateEmail,
  validatePassword,
  email,
  password,
}: ReducerAccountStepProps) => {
  return (
    <div className="flex flex-col gap-y-4 w-full h-auto">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          value={email.value}
          onChange={(e) => onChangeEmail(e.target.value)}
          onBlur={validateEmail}
          placeholder="email"
        />
      </Field>
      {!!email.error && (
        <p className="text-bold text-xs text-red-900">{email.error}</p>
      )}
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          placeholder="password"
          type="text"
          value={password.value}
          onBlur={validatePassword}
          onChange={(e) => {
            onChangePassword(e.target.value);
          }}
        />

        {!!password.error && (
          <FieldDescription className="text-bold text-xs text-red-900">
            {password.error}
          </FieldDescription>
        )}
      </Field>
    </div>
  );
};

export default ReducerAccountStep;
