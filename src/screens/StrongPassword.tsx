import Layout from "@/components/Layout";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  anyNumbers,
  anySpecialChars,
  atLeastOneLowerCase,
  atLeastOneUppercase,
} from "@/utils";
import classNames from "classnames";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

const PasswordValidation = {
  MIN_1_UPPERCASE: "There must be minimum 1 uppercase char",
  MIN_1_LOWERCASE: "There must be minimum 1 lowercase char",
  MIN_8_LENGTH: "Must be minimum 8 chars",
  MIN_1_NUMBER: "Must have at least 1 number",
  MIN_1_SPECIAL: "Must have at least 1 special char",
} as const;

type PasswordValidationType =
  (typeof PasswordValidation)[keyof typeof PasswordValidation];
// passing PasswordValidation as const as a type gives it the whole object
// this type looks at one of the values inside that object

interface ValidationRuleType {
  id: PasswordValidationType;
  valid: boolean;
}

const validationRules: ValidationRuleType[] = [
  { id: PasswordValidation.MIN_1_UPPERCASE, valid: false },
  { id: PasswordValidation.MIN_1_LOWERCASE, valid: false },
  { id: PasswordValidation.MIN_8_LENGTH, valid: false },
  { id: PasswordValidation.MIN_1_NUMBER, valid: false },
  { id: PasswordValidation.MIN_1_SPECIAL, valid: false },
];

const StrongPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false); // false = hide

  const handleOnChange = (val: string) => {
    setPassword(val);
  };

  const errorState = useMemo(() => {
    return validationRules.map((rule) => {
      if (rule.id === PasswordValidation.MIN_1_UPPERCASE) {
        return {
          ...rule,
          valid: atLeastOneUppercase.test(password),
        };
      }
      if (rule.id === PasswordValidation.MIN_1_LOWERCASE) {
        return {
          ...rule,
          valid: atLeastOneLowerCase.test(password),
        };
      }
      if (rule.id === PasswordValidation.MIN_1_NUMBER) {
        return {
          ...rule,
          valid: anyNumbers.test(password),
        };
      }
      if (rule.id === PasswordValidation.MIN_1_SPECIAL) {
        return {
          ...rule,
          valid: anySpecialChars.test(password),
        };
      }
      if (rule.id === PasswordValidation.MIN_8_LENGTH) {
        return {
          ...rule,
          valid: password.length >= 8,
        };
      }
    });
  }, [password, validationRules]);

  return (
    <Layout
      title="Strong password checker"
      brief="https://www.reactchallenges.com/challenges/strong-password"
    >
      <div className="mx-auto max-w-3xl flex flex-col items-start justify-start gap-y-4">
        <InputGroup>
          <InputGroupInput
            value={password}
            id="strong-password"
            placeholder="Your password"
            // type="password"
            onChange={(e) => {
              handleOnChange(e.target.value);
            }}
          />
          <InputGroupAddon
            align="inline-end"
            onClick={(e) => {
              setToggle((prev) => !prev);
            }}
          >
            {toggle ? <EyeOff /> : <Eye />}
          </InputGroupAddon>
        </InputGroup>
        <div className="">
          {errorState.map((rule, index) => {
            return (
              <p
                key={`${rule?.id}-${index}`}
                className={classNames("text-lg", {
                  "text-green-700": rule?.valid === true,
                  "text-red-500": rule?.valid === false,
                })}
              >
                {rule?.id} = {JSON.stringify(rule?.valid)}
              </p>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default StrongPassword;
