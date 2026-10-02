# Strong password checker

Notes for [src/screens/StrongPassword.tsx](../../src/screens/StrongPassword.tsx).

Brief: <https://www.reactchallenges.com/challenges/strong-password>

## The goal

Build a password field that:

1. Checks the password against a list of rules as the user types.
2. Can be shown or hidden with a toggle.
3. Hides the password **without** using `type="password"` and without using CSS to disguise the characters.

The third point is what makes the exercise hard. With a normal password field the browser does the hiding. Here we have to do it ourselves.

## The main idea

Keep the real password in React state and put only asterisks in the field.

```
  what the user sees in the field      what React state holds

        * * * * *                            t i g e r
```

Because the field only ever contains asterisks while hidden, copying it or inspecting the page shows asterisks, not the password.

The catch: the field can no longer tell us what the password is. If the user types `s`, the field would contain `*****s`, and saving that would wipe out the real password. So we have to catch each edit before it happens and apply it to the real password ourselves.

## What is stored where

| Thing | Kind | Why |
|---|---|---|
| `password` | state | The real password. The only source of truth. |
| `toggle` | state | `true` = shown, `false` = hidden. |
| `passwordToDisplay` | derived with `useMemo` | Asterisks when hidden, the real password when shown. Worked out from `password` and `toggle`, so it is never stored separately. |
| `errorState` | derived with `useMemo` | Each rule marked valid or not, worked out from `password`. |
| `inputRef` | ref | Gives us the actual field so we can listen to it and read the cursor position. |
| `cursorIndexRef` | ref | Where the cursor should go after the next re-render. A ref, because changing it should not cause a re-render. |

There is one state for the password, not two. A second state for the asterisks would have to be kept in sync by hand and would eventually drift.

## How one key press flows through

```
 user presses a key
        │
        ▼
 browser: "I am about to change the field"   (the beforeinput event)
        │
        ▼
 onBeforeInput
   1. cancel the browser's change
   2. ignore anything that is not typing, Backspace or Delete
   3. read where the cursor / selection is
   4. work out the range to replace and the new text
   5. save where the cursor should end up   → cursorIndexRef
   6. update the real password              → setPassword
        │
        ▼
 React re-renders
   passwordToDisplay  → new row of asterisks
   errorState         → rules re-checked
        │
        ▼
 layout effect puts the cursor back using cursorIndexRef
```

When the password is **shown**, none of this is needed. The field holds the real text, so the ordinary `onChange` saves it directly. The listener is only attached while hidden.

## Why a native listener and not React's `onBeforeInput`

React's own `onBeforeInput` prop only fires when text is inserted. It does not fire for Backspace or Delete. So the listener is attached to the field directly inside a `useEffect`, and removed again when the toggle changes or the screen is left.

## The handler

```tsx
const onBeforeInput = (e: InputEvent) => {
  const type = e.inputType;

  e.preventDefault(); // stop the browser changing the field

  const isTyping = type === "insertText";
  const isBackspace = type === "deleteContentBackward";
  const isDelete = type === "deleteContentForward";

  // ignore anything that is not typing, Backspace or Delete
  if (!isTyping && !isBackspace && !isDelete) {
    return;
  }

  let startOfString = input.selectionStart ?? 0;
  let endOfString = input.selectionEnd ?? startOfString;

  const textValue = isTyping ? (e.data ?? "") : "";

  const isNoSelection = startOfString === endOfString;

  if (isNoSelection && isBackspace) {
    startOfString = Math.max(0, startOfString - 1);
  }
  if (isNoSelection && isDelete) {
    endOfString = endOfString + 1;
  }

  cursorIndexRef.current = startOfString + textValue.length;

  setPassword(
    (prev) =>
      prev.slice(0, startOfString) + textValue + prev.slice(endOfString),
  );
};
```

### The pieces

- **`e.inputType`** is the browser's name for the kind of edit.

  | What the user does | `inputType` | Handled? |
  |---|---|---|
  | Presses a character key | `insertText` | Yes |
  | Backspace | `deleteContentBackward` | Yes |
  | Delete | `deleteContentForward` | Yes |
  | Paste | `insertFromPaste` | No, ignored |
  | Cut | `deleteByCut` | No, ignored |
  | Drag text in | `insertFromDrop` | No, ignored |
  | Accepts an autocorrect fix | `insertReplacementText` | No, ignored |
  | Option/Cmd + Backspace | `deleteWordBackward` and similar | No, ignored |
  | Undo / redo | `historyUndo` / `historyRedo` | No, ignored |

- **`e.data`** is the character that was typed. It is `null` for deletions, which is why `textValue` falls back to an empty string. Without that, the word "null" would be joined onto the password.

- **`selectionStart` / `selectionEnd`** say where the cursor or selection is. If nothing is highlighted, both are the same number.

- **The `??` fallbacks** are there because TypeScript says these could be `null` (they are for field types that cannot select text, such as number fields). For a text field they are always numbers.

## Every edit is "replace a range with some text"

Typing, Backspace and Delete all end in the same line:

```
new password = (everything before the range) + (new text) + (everything after the range)
```

The only thing that differs between them is what the range is and what the new text is.

Positions are the **gaps between characters**, not the characters themselves. The examples use the password `tiger`.

```
  t   i   g   e   r
|   |   |   |   |   |
0   1   2   3   4   5
```

### Typing in the middle

Cursor after `tig`, user types `X`. Nothing is selected, so the range is empty and nothing is removed.

```
  t   i   g   e   r
|   |   |   |   |   |
0   1   2   3   4   5
            ▲
   startOfString = endOfString = 3

slice(0, 3)   textValue   slice(3)
   "tig"    +    "X"    +   "er"      →  "tigXer"

cursor = 3 + 1 = 4   (just after the X)
```

### Typing at the end

Same code. The cursor is at 5, so there is nothing after the range.

```
  t   i   g   e   r
|   |   |   |   |   |
0   1   2   3   4   5
                    ▲
   startOfString = endOfString = 5

slice(0, 5)   textValue   slice(5)
  "tiger"   +    "X"    +    ""       →  "tigerX"

cursor = 5 + 1 = 6
```

### Backspace

Cursor after `tig`. The range is empty, so there is nothing to remove yet. Backspace stretches it **one to the left**.

```
  t   i   g   e   r
|   |   |▓▓▓|   |   |
0   1   2   3   4   5
        ▲   ▲
    start   end          startOfString = 3 - 1 = 2

slice(0, 2)   textValue   slice(3)
   "ti"     +    ""     +   "er"      →  "tier"

cursor = 2 + 0 = 2   (moved back one)
```

`Math.max(0, …)` stops the start going below 0 when the cursor is already at the very beginning. A negative number would make `slice` count from the end of the string and remove the wrong character.

### Delete

Cursor after `tig`. Delete stretches the range **one to the right**.

```
  t   i   g   e   r
|   |   |   |▓▓▓|   |
0   1   2   3   4   5
            ▲   ▲
        start   end      endOfString = 3 + 1 = 4

slice(0, 3)   textValue   slice(4)
   "tig"    +    ""     +   "r"       →  "tigr"

cursor = 3 + 0 = 3   (stays where it was)
```

No upper limit is needed here. If the end goes past the length of the string, `slice` just treats it as the end.

### With characters highlighted

`ige` is highlighted, so start is 1 and end is 4. `isNoSelection` is false, so neither stretching line runs. The range is already the selection.

Typing `X`:

```
  t   i   g   e   r
|   |▓▓▓▓▓▓▓▓▓▓▓|   |
0   1   2   3   4   5
    ▲           ▲
  start         end

slice(0, 1)   textValue   slice(4)
   "t"      +    "X"    +   "r"       →  "tXr"

cursor = 1 + 1 = 2
```

Backspace or Delete on the same selection:

```
slice(0, 1)   textValue   slice(4)
   "t"      +    ""     +   "r"       →  "tr"

cursor = 1 + 0 = 1
```

### Summary

| Action | Range that gets replaced | New text | Cursor ends at |
|---|---|---|---|
| Type, nothing selected | Empty, at the cursor | The typed character | One to the right |
| Backspace, nothing selected | The one character before the cursor | Nothing | One to the left |
| Delete, nothing selected | The one character after the cursor | Nothing | Same place |
| Type over a selection | The selection | The typed character | Just after the new character |
| Backspace/Delete a selection | The selection | Nothing | Start of the selection |

## Putting the cursor back

When React re-renders the field with a new row of asterisks, the browser moves the cursor to the end. That is fine when typing at the end, but wrong when editing in the middle.

`cursorIndexRef` only **records** where the cursor should go. A layout effect does the actual move, after React has updated the field:

```tsx
useLayoutEffect(() => {
  if (cursorIndexRef.current === null) return;
  inputRef.current?.setSelectionRange(
    cursorIndexRef.current,
    cursorIndexRef.current,
  );
  cursorIndexRef.current = null;
}, [password]);
```

It has to be a layout effect so the move happens before the screen is painted. Otherwise the cursor would visibly flash at the end first.

It depends on `password`, not `passwordToDisplay`. Typing one character over one highlighted character changes the password but leaves the row of asterisks identical, so an effect watching the asterisks would not run and the highlight would stay in place.

## Things the handler cannot block by itself

Some things never pass through `onBeforeInput`, so they are handled on the field.

| On the field | What it does |
|---|---|
| `onCopy`, `onCut`, `onPaste`, `onDrop` cancelled | Blocks the clipboard and drag-and-drop in both shown and hidden modes. Copy never changes the field, so the handler would never see it. |
| `onChange` returns early when hidden | Browser autofill can write into the field with no "before" event. Ignoring it makes React put the asterisks back. |
| `autoComplete="new-password"` | Asks the browser not to fill in a saved value. Browsers may ignore it. |
| `autoCapitalize="off"`, `autoCorrect="off"`, `spellCheck={false}` | Stops the browser or keyboard from changing or underlining the password, and from sending it to a spellcheck service. |

## The validation rules

`validationRules` is a fixed list of rules, each starting as not valid. `errorState` walks the list and marks each one valid or not for the current password:

| Rule | Check |
|---|---|
| At least 1 uppercase | `atLeastOneUppercase` pattern |
| At least 1 lowercase | `atLeastOneLowerCase` pattern |
| At least 1 number | `anyNumbers` pattern |
| At least 1 special character | `anySpecialChars` pattern |
| At least 8 characters | `password.length >= 8` |

The rules are always checked against the **real** password, never the asterisks. They are re-checked on every change because `errorState` depends on `password`.

The rules list has `id="password-rules"` and the field points at it with `aria-describedby`, so a screen reader reads the rules along with the field.

## Mistakes to watch for

- **`||` instead of `&&` in the "ignore everything else" check.** `!isTyping || !isBackspace || !isDelete` is always true, because an edit can only be one of the three, so the other two are always false. The handler returns every time and nothing can be typed. It has to be `&&`: "not typing **and** not Backspace **and** not Delete".
- **Applying the toggle twice.** `passwordToDisplay` already decides between asterisks and the real password. The field's value should just be `passwordToDisplay`.
- **Saving the field's value while hidden.** It contains asterisks, so it would overwrite the real password.
- **Joining `e.data` straight into the password.** It is `null` for deletions and turns into the word "null".
- **Comparing the old and new value to guess the edit.** If the password is `aaaa` and one `a` is removed, there is no way to tell which one. Reading the range before the edit avoids this.
- **Saving the cursor position but never using it.** The ref does nothing without the layout effect.

## What this approach cannot do

A real password field gets protections from the browser and the operating system that a page cannot recreate. This is fine for an exercise, but it is why real forms use `type="password"` and switch it to `text` for the toggle.

**Security**

- Phone keyboards may learn the password as a word. Only a real password field tells the keyboard not to.
- On macOS, a real password field stops other apps reading the keystrokes. This one does not.
- The browser may still offer to save the value in form history.

**Accessibility**

- A screen reader reads each typed character aloud. For a real password field it says "bullet" instead.
- Blocking paste fails the WCAG accessible-authentication rule and stops password managers from filling the field.
- Word and line deletes (Option/Cmd + Backspace) and undo/redo do nothing while hidden.
- Keyboards that build characters in several steps (Chinese, Japanese, some Android keyboards) are not handled.
- The toggle needs to be a real button with a name so it can be reached by keyboard and announced.
