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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cursorIndexRef = useRef<number | null>(null); // current location of the text cursor

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
      return rule;
    });
  }, [password]);

  const passwordToDisplay = useMemo(() => {
    if (!toggle) {
      return password
        .split("")
        .map((_) => "*")
        .join("");
    } else {
      return password;
    }
  }, [password, toggle]);

  useEffect(() => {
    const input = inputRef.current;
    // if visible, do not intercept capturing
    if (toggle) {
      return;
    }

    // wait for inputRef to init
    if (!input) {
      return;
    }

    const onBeforeInput = (e: InputEvent) => {
      const type = e.inputType; // type of change made to editable content (inserting, deleting, formatting)

      e.preventDefault(); // stop browser from changing field, manually edit and capture

      const isTyping = type === "insertText"; // normal typing

      // full list of delete actions https://w3c.github.io/input-events/#interface-InputEvent-Attributes
      const isBackspace = type === "deleteContentBackward";
      const isDelete = type === "deleteContentForward";

      // do not capture any activity that is not
      // manual user typing or deleting/backspacing
      if (!isTyping && !isBackspace && !isDelete) {
        return;
      }

      let startOfString = input?.selectionStart ?? 0; // index number that shows the index of the first selected character
      let endOfString = input?.selectionEnd ?? startOfString; // index number of the character immediately following the last selected character
      // A caret with no selection has the same start and end
      // caret is sitting after the third character, selectionStart is 3 and selectionEnd is also 3.
      // only differ when the user has highlighted some characters

      const textValue = isTyping ? (e.data ?? "") : ""; // needs to coalesce into "" to avoid the text 'null'

      const isNoSelection = startOfString === endOfString;

      if (isNoSelection && isBackspace) {
        startOfString = Math.max(0, startOfString - 1);
      }
      if (isNoSelection && isDelete) {
        endOfString = endOfString + 1;
      }
      cursorIndexRef.current = startOfString + textValue.length;

      // start and end come from the cursor selection and only backspace/delete would cause change

      setPassword(
        (prev) =>
          prev.slice(0, startOfString) + textValue + prev.slice(endOfString),
      );
    };

    // attach event listener to password field
    input.addEventListener("beforeinput", onBeforeInput);

    // clean up action when component unmounts
    return () => {
      input?.removeEventListener("beforeinput", onBeforeInput);
    };
  }, [toggle]);

  // runs synchronously right after React updates the DOM but before the browser paints the screen
  // Because every time React rewrites the field with a new row of asterisks, the browser forgets where the cursor was and drops it at the end.
  // The useLayoutEffect block puts it back where it belongs
  // useEffect runs after the screen has been drawn
  // useLayoutEffect runs before the screen is drawn, so the cursor is already in the right place when you see it
  useLayoutEffect(() => {
    // check for null specifically and not falsey as that includes 0
    if (cursorIndexRef.current === null) {
      return;
    }

    inputRef.current?.setSelectionRange(
      cursorIndexRef.current,
      cursorIndexRef.current,
    );
    // reset
    cursorIndexRef.current = null;
  }, [password]);

  return (
    <Layout
      title="Strong password checker"
      brief="https://www.reactchallenges.com/challenges/strong-password"
      description={
        <p>
          Rolling validation and avoid input type='password' to obscure the
          password. Refer to the{" "}
          <a
            className="text-indigo-600 underline decoration-indigo-400 decoration-2 underline-offset-4 hover:text-indigo-900 hover:decoration-indigo-700"
            href="/docs/strong-password/README.md"
            target="_blank"
          >
            markdown file
          </a>{" "}
          for learnings
        </p>
      }
    >
      <div className="mx-auto max-w-3xl flex flex-col items-start justify-start gap-y-4">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            value={passwordToDisplay}
            id="strong-password"
            placeholder="Your password"
            autoComplete="new-password" // tells browser not to fill in a saved one
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="password-rules"
            // prevents copy, paste, drag-drop
            // blocks password managers
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            // type="password"
            onChange={(e) => {
              // when hidden, only onBeforeInput can change the password state
              if (!toggle) return;
              handleOnChange(e.target.value);
            }}
          />
          <InputGroupAddon
            align="inline-end"
            aria-label={toggle ? "Hide password" : "Show password"}
            onClick={() => {
              setToggle((prev) => !prev);
            }}
          >
            {toggle ? <Eye /> : <EyeOff />}
          </InputGroupAddon>
        </InputGroup>
        <div
          id="password-rules"
          className="flex flex-col items-start justify-start gap-y-2"
        >
          {errorState.map((rule, index) => {
            return (
              <p
                key={`${rule.id}-${index}`}
                className={classNames("text-lg", {
                  "text-green-700": rule?.valid === true,
                  "text-red-500": rule?.valid === false,
                })}
              >
                {rule.id} = {JSON.stringify(rule.valid)}
              </p>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default StrongPassword;
