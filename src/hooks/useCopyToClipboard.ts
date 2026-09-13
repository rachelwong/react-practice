import { useCallback, useEffect, useRef, useState } from "react";

interface UseCopyToClipboardProps {
  resetDelay?: number;
}

const useCopyToClipboard = ({
  resetDelay = 2000,
}: UseCopyToClipboardProps): {
  copied: boolean;
  error: null | string;
  copy: (text: string) => void;
} => {
  const [copied, setCopied] = useState<boolean>(false); // tracks has copied state
  const [error, setError] = useState<string | null>(null);

  // this ref either holds a timer handle, or it holds nothing yet
  // needs to be a ref and not a var so that timer is created when user clicks copy
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // wrapper function to handle browser's copy api
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setError(null);
        setCopied(true);

        // clear any timer if one exists
        // to prevent rapid clicking
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // creates a timer and assign it to the ref
        // which will fire the setCopied after the resetDelay if provided
        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (err) {
        setCopied(false);
        setError(`Failed to copy for value: ${text} with error: ${err}`);
      }
    },
    // resetDelay needs to be added because copy function uses it
    [resetDelay],
  );

  // when this component is to be removed on screen, remove whatever timerID in the ref and cancel
  // if user moves away faster than the resetDelay, the timer will still fire and try to run a state update with useIsCopied
  // but by then there is no component onscreen that uses isCopied
  useEffect(() => {
    return () => {
      if (timerRef?.current) {
        clearTimeout(timerRef?.current);
      }
    };
  }, []);

  return {
    copied,
    error,
    copy,
  };
};

export default useCopyToClipboard;
