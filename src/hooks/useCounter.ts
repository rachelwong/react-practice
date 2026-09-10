import { useRef, useState, type Dispatch } from "react";

interface UseCounterProps {
  value: number;
  isSubmitting: React.RefObject<boolean>;
  setValue: Dispatch<React.SetStateAction<number>>;
  decrement: () => void;
  increment: () => void;
}

const useCounter = ({
  initialValue = 0,
  maxValue,
}: { initialValue?: number; maxValue?: number } = {}): UseCounterProps => {
  const [value, setValue] = useState<number>(initialValue);
  const isSubmitting = useRef(false);

  const decrement = async () => {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (!!value) {
        setValue((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Decrement error");
    } finally {
      isSubmitting.current = false;
    }
  };

  const increment = async () => {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setValue((prev) => {
        if (maxValue !== undefined && prev + 1 > maxValue) {
          return prev;
        }
        return prev + 1;
      });
    } catch (err) {
      console.error("Increment error");
    } finally {
      isSubmitting.current = false;
    }
  };

  return {
    value,
    setValue,
    isSubmitting,
    decrement,
    increment,
  };
};

export default useCounter;
