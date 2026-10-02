import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import useSimpleWordle from "@/hooks/useSimpleWordle";
import classNames from "classnames";
import { CirclePlus, Delete, LogIn } from "lucide-react";
import { useEffect } from "react";

const SimpleWordle = () => {
  const {
    state,
    keyboardRows,
    getMysteryWord,
    onKeyClick,
    onRemoveLastChar,
    onSubmit,
    resetGame,
  } = useSimpleWordle({});

  useEffect(() => {
    getMysteryWord();
  }, []);

  const haveWon = state.attempts.includes(state.mysteryWord);

  const haveLost =
    !haveWon && state.maxNumberOfAttempts === state.attempts.length;

  const inProgress =
    !haveWon && state.maxNumberOfAttempts !== state.attempts.length;

  return (
    <Layout
      title="Wordle"
      brief="https://www.reactchallenges.com/challenges/wordle-simplified"
    >
      <div className="max-w-3xl mx-auto h-full flex flex-col items-center justify-start gap-y-3 w-full my-10">
        <h1 className="text-4xl font-extrabold text-neutral-900 text-center">
          {haveWon && "You have guessed correctly!"}
          {haveLost &&
            `You have lost! The word was ${state.mysteryWord.toUpperCase()}`}
          {inProgress &&
            `You have ${state.maxNumberOfAttempts - state.attempts.length} tries remaining.`}
        </h1>
        {haveWon ||
          (haveLost && (
            <Button
              size="lg"
              className="bg-green-400"
              onClick={() => resetGame()}
            >
              <CirclePlus />
              New game
            </Button>
          ))}
        <div className="flex flex-col gap-y-4">
          {!!state.attempts.length &&
            state.attempts.map((attempt, attemptIndex) => {
              return (
                <div
                  key={attempt + attemptIndex}
                  className="flex flex-row w-full text-center text-4xl font-extrabold items-center justify-between h-auto gap-x-3"
                >
                  {attempt.split("").map((char, charIndex) => {
                    const indexOfMatch = state.mysteryWord
                      .split("")
                      .indexOf(char); // -1 not found
                    const correctCharAndPosition =
                      indexOfMatch !== -1 && indexOfMatch === charIndex;
                    const charFound =
                      indexOfMatch !== -1 && indexOfMatch !== charIndex;

                    return (
                      <div
                        key={char + charIndex}
                        className={classNames(
                          "flex flex-row items-center justify-center p-7 text-neutral-100 w-full",
                          {
                            "bg-green-500": correctCharAndPosition,
                            "bg-yellow-400": charFound,
                            "bg-neutral-300": indexOfMatch === -1,
                          },
                        )}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          <div className="border-1 border-neutral-700 p-7 text-center text-4xl font-extrabold text-neutral-800">
            {state.currentTry || (
              <span className="text-neutral-200">Your current word</span>
            )}
          </div>
          <p className="text-md text-neutral-400 text-center">
            You may type on your physical keyboard or use below virtual
            keyboard.
          </p>
          {keyboardRows.map((row, rowIndex) => {
            return (
              <div
                key={`${row.join()}-${rowIndex}`}
                className="flex flex-row align-center justify-center gap-x-2"
              >
                {row.map((keyboardBtn) => (
                  <Button
                    disabled={haveWon || haveLost}
                    key={keyboardBtn}
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      onKeyClick(keyboardBtn);
                    }}
                    className="text-3xl p-5 border-1 rounded border-neutral-900"
                  >
                    {keyboardBtn}
                  </Button>
                ))}
                {rowIndex + 1 === keyboardRows.length && (
                  <div className="flex flex-row gap-x-2">
                    <Button
                      disabled={haveWon || haveLost}
                      size="lg"
                      variant="secondary"
                      className="px-6 py-5 border-1 rounded border-neutral-900"
                      onClick={() => {
                        onRemoveLastChar();
                      }}
                    >
                      <Delete size={50} />
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="px-6 py-5 border-1 rounded border-neutral-900"
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      <LogIn size={50} />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default SimpleWordle;
