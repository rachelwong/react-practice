import { useCallback, useState } from "react";

interface UseCopyToClipboardProps {
  resetDelay?: number;
}

const useCopyToClipboard = ({
  resetDelay = 2000,
}: UseCopyToClipboardProps): {
  isCopied: boolean;
  error: null | string;
  copy: (text: string) => void;
} => {
  const [isCopied, setIsCopied] = useState<boolean>(false); // tracks has copied state
  const [error, setError] = useState<string | null>(null);

  // wrapper function to handle browser's copy api
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setError(null);
      setIsCopied(true);

      const timerId = setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);

      return () => {
        clearTimeout(timerId);
      };
    } catch (err) {
      setIsCopied(false);
      setError(
        `Error attempting to copy for value: ${text} with error: ${err}`,
      );
    }
  }, []);

  return {
    isCopied,
    error,
    copy,
  };
};

export default useCopyToClipboard;
