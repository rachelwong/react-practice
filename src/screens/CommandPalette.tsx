import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COMMANDS = [
  "Go to challenges",
  "Go to Katas",
  "Go to quizzes",
  "Go to dashboard",
  "Go to Referral Program",
  "Go to Contact",
  "Go to Terms of service",
];

const CommandPalette = () => {
  const [history, setHistory] = useState<string>("--");
  const [toggle, setToggle] = useState<boolean>(false); // toggle palette
  const [index, setIndex] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");
  const paletteRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (e: MouseEvent) => {
    // contains() only accepts something on the page, like a div or a button.
    // Node is TypeScript's name for anything on the page
    if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
      setToggle(false);
    }
  };

  useEffect(() => {
    if (!toggle) {
      if (searchRef?.current) {
        searchRef.current.blur();
      }
      return;
    } else {
      searchRef.current?.focus();
    }
  }, [toggle, searchRef?.current]);

  useEffect(() => {
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let key = event.key.toLowerCase();

      if (key === "escape" && toggle) {
        setToggle(false);
        setIndex(0);
        setFilter("");
        return;
      }

      if (event.metaKey && key === "k") {
        event.preventDefault(); // stops default browser behaviour

        setToggle((prev) => !prev);
      }

      if (key === "arrowup") {
        event.preventDefault(); // stops default browser behaviour

        setIndex((prev) => {
          if (prev === 0) {
            return COMMANDS.length;
          }
          return prev - 1;
        });
      }

      if (key === "arrowdown") {
        event.preventDefault(); // stops default browser behaviour

        setIndex((prev) => {
          if (prev + 1 === COMMANDS.length) {
            return 0;
          }
          return prev! + 1;
        });
      }

      if (key === "enter") {
        setHistory(COMMANDS[index]);
        setToggle(false);
        setIndex(0);
        setFilter("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // every letter has a match and is in the right order
  const isFuzzyMatched = (target: string, queryFilter: string) => {
    let lastQueryPos = 0;
    const matchedQuery: string[] = [];

    const query = queryFilter.replace(/\s/g, "").toLowerCase().split("");
    const targetList = target.replace(/\s/g, "").toLowerCase().split("");

    for (const targetVal of targetList) {
      if (targetVal === query[lastQueryPos]) {
        matchedQuery.push(query[lastQueryPos]);
        lastQueryPos = lastQueryPos + 1;
      }
    }
    return matchedQuery.length === queryFilter.length;
  };

  const displayCommands = COMMANDS.filter((command) =>
    !command.trim().length ? command : isFuzzyMatched(command, filter),
  );

  return (
    <ScreenLayout
      title="Command Palette"
      brief="https://www.reactchallenges.com/challenges/command-palette"
    >
      {toggle && (
        <>
          <div className="flex flex-cols items-center justify-center before:content-['*'] before:absolute before:w-screen before:h-screen before:bg-black before:top-0 before:left-0 before:opacity-75 before:z-10" />
          <div className="absolute flex flex-cols items-center justify-center top-0 left-0 right-0 bottom-0">
            <Card
              ref={paletteRef}
              className="max-w-md w-full opacity-100 bg-white z-10 flex flex-col items-start justify-start"
            >
              <div className="px-4 w-full">
                <Input
                  ref={searchRef}
                  type="text"
                  value={filter}
                  placeholder="fuzzy search for commands"
                  onChange={(e) => {
                    setFilter(e.target.value);
                  }}
                />
              </div>
              {!displayCommands.length && !!filter.trim().length && (
                <p className="px-4 text-center font-bold text-slate-900">
                  No results for {filter}
                </p>
              )}
              {!!displayCommands.length &&
                displayCommands.map((command, commandIndex) => {
                  const isSelected = commandIndex === index;
                  return (
                    <button
                      type="button"
                      key={command}
                      onClick={() => {
                        setHistory(command);
                        setToggle(false);
                        setIndex(0);
                        setFilter("");
                      }}
                      className={classNames(
                        "text-left py-2 px-6 h-full w-full",
                        {
                          "bg-slate-300": isSelected,
                        },
                      )}
                    >
                      {command}
                    </button>
                  );
                })}
            </Card>
          </div>
        </>
      )}
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-y-3">
          <h3 className="text-2xl font-extrabold text-center">
            Command Palette
          </h3>
          <Button
            size="icon-lg"
            variant="outline"
            className="flex flex-row items-center px-10 gap-x-3"
            onClick={() => {
              setToggle(true);
            }}
          >
            <Search />
            <span className="flex flex-row items-center justify-center gap-x-1">
              <Command />K
            </span>
          </Button>
          <p>
            Last action: <span className="font-bold">{history}</span>
          </p>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default CommandPalette;
