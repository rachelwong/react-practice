import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, type ClipboardEvent } from "react";

const ANSWER = 739284;
const CODE_SIZE = ANSWER.toString().length;

const OtpInput = () => {
  const [value, setValue] = useState<string[]>(
    [...new Array(CODE_SIZE)].map(() => ""),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const isDirty = value.every((x) => !!x);
  const isValid = value.join("") === ANSWER.toString();

  const handlePaste = (
    event: ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.preventDefault(); // stop native browser behaviours
    const raw = event.clipboardData.getData("text").trim();
    if (raw.split("").some((x) => isNaN(Number(x)))) {
      return;
    }
    const strToPaste = raw.slice(0, CODE_SIZE - index);

    // each digit is written to next[index + i] and the empty boxes in front stay as they are
    setValue((prev) => {
      const next = [...prev];
      strToPaste.split("").forEach((digit, i) => {
        next[index + i] = digit;
      });
      return next;
    });

    // move focus to the next field after paste success
    const nextFocus = Math.min(index + strToPaste.length, CODE_SIZE - 1);
    focusInput(nextFocus);
  };

  return (
    <ScreenLayout
      title="OTP Input"
      brief="https://www.reactchallenges.com/challenges/otp-input"
      description="Validates once all fields are inputted. Includes focus management, paste action."
    >
      <div className="flex flex-col max-w-3xl justify-center items-start w-full h-auto gap-y-4 mx-auto">
        <p>Code is {JSON.stringify(ANSWER)}</p>
        <div className="flex flex-row justify-center items-center gap-x-6">
          {value.map((val, valIndex) => (
            <Input
              id={`field-${valIndex}`}
              className="w-20 h-30"
              max={9}
              min={0}
              minLength={1}
              maxLength={1}
              ref={(element) => {
                inputRefs.current[valIndex] = element || null;
              }}
              onPaste={(e) => handlePaste(e, valIndex)}
              key={valIndex}
              value={val}
              type="text"
              onKeyDown={(event) => {
                if (
                  !val &&
                  event.key.toLowerCase() === "backspace" &&
                  valIndex !== 0
                ) {
                  // stop browser
                  event.preventDefault();
                  // manually clear the field
                  setValue((prev) => {
                    return prev.map((x, xIndex) => {
                      if (xIndex === valIndex - 1) {
                        return "";
                      }
                      return x;
                    });
                  });
                  focusInput(valIndex - 1);
                }

                if (event.key.toLowerCase() === "arrowleft" && valIndex !== 0) {
                  event.preventDefault();
                  focusInput(valIndex - 1);
                }

                if (
                  event.key.toLowerCase() === "arrowright" &&
                  valIndex + 1 < value.length
                ) {
                  event.preventDefault();
                  focusInput(valIndex + 1);
                }
              }}
              // this always move cursor forward for any change, incl deletion
              onChange={(e) => {
                if (isNaN(Number(e.target.value.trim()))) {
                  return;
                }
                setValue((prev) => {
                  return prev.map((x, xIndex) => {
                    if (xIndex === valIndex) {
                      return e.target.value;
                    }
                    return x;
                  });
                });
                if (valIndex + 1 < value.length) {
                  focusInput(valIndex + 1);
                }
              }}
            />
          ))}
        </div>
        {isDirty &&
          (isValid ? (
            <p className="text-green-500 font-extrabold">Code verified!</p>
          ) : (
            <p className="text-red-500 font-extrabold">Invalid code.</p>
          ))}
        <Button
          size="lg"
          onClick={() => {
            setValue([...new Array(6)].map(() => ""));
          }}
        >
          Reset
        </Button>
      </div>
    </ScreenLayout>
  );
};

export default OtpInput;
