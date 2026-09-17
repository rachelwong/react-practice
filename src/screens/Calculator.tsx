import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const OPERATOR = {
  MULTIPLY: "x",
  DIVIDE: "/",
  SUBTRACT: "-",
  ADD: "+",
  EQUAL: "=",
  PERCENTAGE: "%",
};

const operators = {
  [OPERATOR.MULTIPLY]: (a: number, b: number) => a * b,
  [OPERATOR.ADD]: (a: number, b: number) => a + b,
  [OPERATOR.SUBTRACT]: (a: number, b: number) => a - b,
  [OPERATOR.DIVIDE]: (a: number, b: number) => a / b,
  [OPERATOR.PERCENTAGE]: (a: number) => a / 100,
};

const Calculator = () => {
  const [operator, setOperator] = useState<
    (typeof OPERATOR)[keyof typeof OPERATOR] | null
  >(null);

  const [prev, setPrev] = useState<string>("");

  const [current, setCurrent] = useState<string>("");

  const onOperator = (value: (typeof OPERATOR)[keyof typeof OPERATOR]) => {
    if (value === OPERATOR.PERCENTAGE) {
      setOperator(null);
      const result = operators[value](Number(current), Number(current)); // do rounding
      setCurrent(result.toString());
      return;
    }

    if (!current.length || value === operator) {
      // nothing currently on screen, then no operator
      // if operator is the same, then don't update
      console.error(
        `onOperator: current: ${current} prev: ${prev} operator: ${operator}`,
      );

      return; // can't have ['x']
    }
    // set operation for current
    setOperator(value);
    setPrev(current);
    setCurrent("");
    return;
  };

  const onInput = (value: string) => {
    // can't have more than 1 decimal point
    if (value === "." && current.includes(value)) {
      return;
    }
    // nothing currently on screen
    if (!current.length) {
      setCurrent(value.toString());
      return;
    }

    // add to existing
    setCurrent((prev) => prev.concat(value.toString()));
    return;
  };

  const onSubmit = () => {
    if (!current || !prev || !operator) {
      console.error(
        `onSubmit: current: ${current} prev: ${prev} operator: ${operator}`,
      );
      return;
    }
    setPrev("");
    setOperator(null);
    const result = operators[operator](Number(prev), Number(current)); // do rounding
    setCurrent(result.toString());
  };

  const onAllClear = () => {
    setOperator(null);
    setPrev("");
    setCurrent("");
  };

  return (
    <Layout
      heading={
        <>
          <h3>Calculator</h3>
          <p>
            Original brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/react-calculator"
              target="_blank"
            >
              https://www.reactgrind.com/problems/react-calculator
            </a>
          </p>
        </>
      }
    >
      <div className="relative flex flex-col w-full h-full">
        <div className="w-md relative flex flex-col">
          <div className="relative block screen bg-neutral-900 rounded px-4 py-2 h-10 text-neutral-100 font-extrabold text-3xl">
            {current.toString()}
          </div>
          <div className="num-pad-container flex flex-row w-full">
            <div className="num-pad-main w-3/4">
              <div className="num-pad grid grid-cols-3 grid-rows-3">
                <Button onClick={() => onAllClear()}>AC</Button>
                <Button onClick={() => onOperator(OPERATOR.PERCENTAGE)}>
                  %
                </Button>
                <Button
                  onClick={() => {
                    onOperator(OPERATOR.DIVIDE);
                  }}
                >
                  /
                </Button>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <Button key={num} onClick={() => onInput(num.toString())}>
                    {num}
                  </Button>
                ))}
              </div>
              <div className="num-pad-bottom-row grid grid-cols-3">
                <Button
                  className="col-start-1 col-end-3"
                  onClick={() => onInput("0")}
                >
                  0
                </Button>
                <Button onClick={() => onInput(".")}>.</Button>
              </div>
            </div>
            <div className="num-pad-right grid grid-rows-6 grid-cols-1 w-1/4">
              <Button onClick={() => onOperator(OPERATOR.MULTIPLY)}>x</Button>
              <Button onClick={() => onOperator(OPERATOR.SUBTRACT)}>-</Button>
              <Button onClick={() => onOperator(OPERATOR.ADD)}>+</Button>
              <Button
                className="row-start-4 row-end-6"
                onClick={() => onSubmit()}
              >
                =
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calculator;
