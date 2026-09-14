import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useState, type ChangeEvent } from "react";

const Debounce = () => {
  const [raw, setRaw] = useState<string>("");
  const { debouncedValue } = useDebounce({ value: raw });

  const onHandleChange = (e: string) => {
    setRaw(e);
  };

  return (
    <Layout
      heading={
        <>
          <h3>useDebounce</h3>
          <p>
            Brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/use-debounce"
              target="_blank"
            >
              https://www.reactgrind.com/problems/use-debounce
            </a>
          </p>
        </>
      }
    >
      <div className="w-full flex flex-col align-start">
        <p>Raw: {raw}</p>
        <p>Debounced: {debouncedValue}</p>
        <Input
          className="mt-4"
          placeholder={"Type to test debounce"}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onHandleChange(e.target.value);
          }}
        />
      </div>
    </Layout>
  );
};

export default Debounce;
