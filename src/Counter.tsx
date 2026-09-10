import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "./components/Layout";
import useCounter from "./hooks/useCounter";

const TEST_INIT_VAL = 4;

const Counter = () => {
  const { value, setValue, isSubmitting, increment, decrement } = useCounter({
    initialValue: TEST_INIT_VAL,
  });

  return (
    <Layout>
      <h3>Counter</h3>
      <p>Limits: whole positive integers with optional maximum limit</p>
      <p>Prevents rapid double click of buttons with a 2 second wait</p>
      <div className="flex items-center justify-start gap-x-6">
        <Button size="lg" disabled={isSubmitting.current} onClick={decrement}>
          - Subtract
        </Button>
        <Input
          id="counter-value"
          placeholder="Enter value"
          type="number"
          value={value}
          min="0"
          // TODO check for decimals, negative numbers, non numeric input
          onChange={(val) => setValue(Number(val.target.value))}
        />
        <Button size="lg" disabled={isSubmitting.current} onClick={increment}>
          {" "}
          + Add{" "}
        </Button>
      </div>
    </Layout>
  );
};

export default Counter;
