// listen for keyboard shortcuts when cursor not in textarea
// listen for Cmd or Ctrl by default
// accept array of keys or single key (i.e. Ctrl + C or Ctrl + Shift + N) to listen for

import { useEffect, useRef } from "react";

// disabled checking for keyboard shortcuts when inside a textfield
const isTyping = () => {
  const el = document.activeElement;

  return !!el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT");
};

const useKeyboardShortcuts = (
  keys: string[] | string,
  onKeyPressed: () => void,
) => {
  const keysPressed = useRef<Set<string>>(new Set());

  // calling onKeyPressed directly will run it every time the effect runs
  // it could be tied to state
  // alternatie would be to be pass in onKeyPressed already as a useCallback
  const callbackRef = useRef(onKeyPressed);

  // updates only on every render
  useEffect(() => {
    callbackRef.current = onKeyPressed;
  });

  useEffect(() => {
    const normalisedKeys =
      typeof keys === "string"
        ? [keys.toLowerCase()]
        : keys.map((x) => x.toLowerCase());

    const needsShift = normalisedKeys.includes("shift");

    const keysToMatch = normalisedKeys.filter((x) => x !== "shift");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTyping()) {
        return;
      }

      // collect keys pressed if Ctrl or Command pressed
      const isCommandCtrlKey = event.ctrlKey || event.metaKey;
      if (!isCommandCtrlKey) {
        return;
      }
      const capturedKeystroke = event.key.toLowerCase();

      if (
        capturedKeystroke !== "control" &&
        capturedKeystroke !== "meta" &&
        capturedKeystroke !== "shift"
      ) {
        keysPressed.current.add(capturedKeystroke);
      }

      if (
        event.shiftKey === needsShift &&
        keysToMatch.every((match) => keysPressed.current.has(match))
      ) {
        // this blocks natural browser behaviour for undo/redo
        event.preventDefault();
        callbackRef.current();
        keysPressed.current.clear();
      }
    };

    const handleKeyUp = () => {
      keysPressed.current.clear();
    };

    window.addEventListener("keyup", handleKeyUp);

    //on key up, reset all collection

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys]);
};

export default useKeyboardShortcuts;
