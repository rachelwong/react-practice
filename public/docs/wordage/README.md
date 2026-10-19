# Wordage — business rules and acceptance criteria

Notes for the custom hook version: [src/hooks/useWordage.ts](../../../src/hooks/useWordage.ts), [src/components/NewWordage.tsx](../../../src/components/NewWordage.tsx), [src/components/NewWordageResult.tsx](../../../src/components/NewWordageResult.tsx) and [src/components/NewWordageGameItem.tsx](../../../src/components/NewWordageGameItem.tsx). The first version lives in [src/components/RoughWordage.tsx](../../../src/components/RoughWordage.tsx) and [src/components/WordageItemBrowser.tsx](../../../src/components/WordageItemBrowser.tsx).

Brief: <https://www.abc.net.au/news/2026-10-04/abc-wordage-quiz/107211586>

## Overview

Wordage is a sorting quiz. The player drags a list of items into the right order, with a limited number of submits and hints.

`useWordage` works for any game of this shape. It takes:

- `answer`: the items in the right order. Any length, any values. Each value must be unique.
- `maxSubmitCount`: how many submits the player gets. Defaults to 3.
- `maxHintCount`: how many hints the player gets. Defaults to 2.

In this page, **N** is the number of items in `answer`.

The screen has three parts:

- **Start list**: a stack of the items not yet placed. Only the top card can be picked up. Up to two more peek out behind it.
- **Game list**: a numbered list where the player builds and reorders their answer.
- **Controls**: Submit (used / max), Reset game, and Hint (used / max), plus a status line above the list. After a loss, a Reveal button also shows.

```
        ┌──────────────┐
        │  ░ next 2 ░  │      <- preview cards (not draggable)
        │  [ item D ]  │      <- top card (draggable)
        └──────────────┘
          status line
   ┌──────────────────────────┐
   │ 1 │ item A               │
   │ 2 │ item B           ✓   │  <- ticked = locked
   │ - - - - - - - - - - - -  │  <- dashed slot while dragging
   │ 3 │ item C               │
   └──────────────────────────┘
   [ Submit 1/3 ] [ Reset ] [ Hint 0/2 ]
```

The rules follow `useWordage`. Where the screen does not match the hook yet, the gap is listed in [Notes for the reattempt](#notes-for-the-reattempt).

## Business rules

### Setting up a game

1. Always provide an answer which is a list of items in the correct order.
2. The answer is shuffled so that no item starts in its right place. The first goes into the game list, the rest into the start list.
3. You get `maxSubmitCount` submits and `maxHintCount` hints.

### The start list

4. You can only drag the first item in the start list. The next two peek out behind it.
5. When the start list is empty, it disappears.

### The game list

6. Items go from the start list into the game list, never back.
7. Dragging over an item shows a dashed slot: above it if you're on its top half, below it if you're on its bottom half.
8. Dragging over the currently dragged item shows no slot.
9. Dropping puts the currently dragged item into the dashed slot. With no slot showing, a start item goes to the bottom and a game item stays where it was.
10. Every card shows its position number.
11. A confirmed correct item is locked in position: it can't be dragged, and other cards flow around it.
12. Once the game is over, no card can be dragged.

### Submitting

13. Submit works only when all items are in the game list and the game isn't over.
14. Each submit uses one try, even if the order hasn't changed since the last submit.
15. Every item in its right place gets a tick (`confirmedCorrect`).
16. All items ticked means you win.
17. Using all submits without a win means you lose.

### Hints

18. Can only get a hint when there are no start items, hints are left, and the game isn't over. You don't need to submit first.
19. If every item is already in its right place, the hint ticks them all, which wins the game.
20. Otherwise each hint does one of two things at random:
    - **Reveal**: tick a random item that is in its right place but not yet ticked. If there is none, do Fix instead.
    - **Fix**: pick a random wrong item, swap it with the item sitting in its right place, and tick it.
21. Each hint that does something uses one hint.

### Status line

22. While placing: "Drag and place N-1 items from start to end" at first, then "Items X / N".
23. All placed, before a submit: "Feeling confident? Hit submit".
24. After a submit that didn't win: ❌ "Items X/N correct". Moving a card or using a hint goes back to "Feeling confident? Hit submit".
25. Win: ✅ "Quiz completed!".
26. Lose: ❌ "X / N correct".
27. Game over: each card turns green ✓ if ticked, red ✗ if not, replacing its number.

### Reveal answer

28. After a loss, Reveal puts every item in its right place and ticks them all.
29. Reveal also uses up all submits and hints.

### Reset

30. Reset works any time and starts a fresh game with a new shuffle, keeping the same answer and limits.

## Diagrams

### Game flow: each submit either wins, uses up a try, or ends the game

```
 ┌───────────┐  all placed  ┌─────────────┐  submit   ◇──────────────◇  yes  ┌─────────────────┐
 │  Placing  │ ───────────▶ │   Playing   │ ────────▶ │ All ticked?  │ ────▶ │       Won       │
 │cards left │              │  all items  │           ◇──────────────◇       │ Quiz completed! │
 │  in pile  │              │ in the list │                  │ no            └─────────────────┘
 └───────────┘              └─────────────┘                  ▼
       ▲                           ▲  no, try again  ◇────────────────◇  yes  ┌─────────────────┐
       │                           └──────────────── │ All submits    │ ────▶ │      Lost       │
       │                                             │ used?          │       │  X / N correct  │
       │                                             ◇────────────────◇       └─────────────────┘
       │                                                                               ┆
       └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ Reset game, from any state ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

The game status is worked out from the data, not stored (`getGameStatus`): Placing until every item is in the game list, Won once every item is ticked, Lost once all submits are used, otherwise Playing. Won is checked before Lost, so a hint that ticks the last items also wins.

### How a hint decides

```
                 ┌────────────┐
                 │ Press Hint │
                 └─────┬──────┘
                       ▼
          ◇─────────────────────────◇   no    ┌───────────────────────┐
          │ Pile empty, hints left, │ ──────▶ │   Nothing happens     │
          │ any card not ticked?    │         │ (hint is not used up) │
          ◇─────────────────────────◇         └───────────────────────┘
                       │ yes
                       ▼
          ◇─────────────────────────◇   yes   ┌───────────────────────┐
          │ Every card already in   │ ──────▶ │ Tick every card       │
          │ its right place?        │         │ Hint count +1, you win│
          ◇─────────────────────────◇         └───────────────────────┘
                       │ no
                       ▼
              ◇────────────────◇  reveal  ◇──────────────────◇  yes  ┌──────────────────────┐
              │ Random 50 / 50 │ ───────▶ │ Any right card   │ ────▶ │ Reveal a correct one │
              ◇────────────────◇          │ not yet ticked?  │       │  tick a random one   │
                       │ fix              ◇──────────────────◇       └──────────┬───────────┘
                       ▼                           │ none, fall back            │
        ┌──────────────────────────────┐           │                            │
        │       Fix a wrong one        │ ◀─────────┘                            │
        │ pick a random wrong card,    │                                        │
        │ swap it into its right place,│                                        │
        │ and tick it                  │                                        │
        └──────────────┬───────────────┘                                        │
                       │              ┌──────────────────────────┐              │
                       └────────────▶ │      Hint count +1       │ ◀────────────┘
                                      └──────────────────────────┘
```

A hint only counts when it actually changes something. A hint also clears the last submit result from the status line.

## Acceptance criteria

Each check is written as Given / When / Then, and the rule numbers it covers are in brackets. Tick them off as the rebuild passes them.

### Start of game

- [ ] **Given** the page loads, **then** one item is in the game list at position 1, N-1 are in the start list, Submit shows 0/`maxSubmitCount` and Hint shows 0/`maxHintCount`. (2, 3)
- [ ] **Given** the page loads, **then** the status line reads "Drag and place N-1 items from start to end". (22)
- [ ] **Given** the start list has 3 or more cards, **then** one draggable card and two preview cards are visible. (4)
- [ ] **Given** I place every start card at the bottom in the order they come, **when** I submit, **then** no card gets a tick. (2)

### Dragging from the start list

- [ ] **Given** I drag the top start card over the top half of a game card, **then** a dashed slot shows above that card. (7)
- [ ] **Given** I drag over the bottom half, **then** the dashed slot shows below it. (7)
- [ ] **Given** a dashed slot is showing, **when** I drop, **then** the card lands in that slot and the numbers update. (9, 10)
- [ ] **Given** no dashed slot is showing, **when** I drop a start card in the game list, **then** it goes to the bottom. (9)
- [ ] **Given** I drop a start card back onto the start list, **then** nothing changes. (4)
- [ ] **Given** I place a second card, **then** the status line reads "Items 2 / N". (22)
- [ ] **Given** I place the last start card, **then** the start list disappears and the status reads "Feeling confident? Hit submit". (5, 23)

### Reordering the game list

- [ ] **Given** I drag a game card onto the start list, **then** it stays in the game list. (6)
- [ ] **Given** I drag a game card over itself, **then** no dashed slot shows. (8)
- [ ] **Given** I drop a game card on empty list space, **then** the order does not change. (9)
- [ ] **Given** a card has a tick, **then** I cannot pick it up. (11)
- [ ] **Given** a card has a tick, **when** I drop another card above it, **then** the ticked card keeps its position number. (11)
- [ ] **Given** the game is over, **then** I cannot pick up any card. (12)

### Submitting

- [ ] **Given** cards are still in the start list, **then** Submit is disabled. (13)
- [ ] **Given** all items are placed, **when** I submit, **then** Submit shows 1/`maxSubmitCount` and every item in its right place gets a tick. (14, 15)
- [ ] **Given** I submit, **when** I submit again without changing anything, **then** the submit count still goes up by one. (14)
- [ ] **Given** my submit was wrong, **then** the status reads ❌ "Items X/N correct"; **when** I move a card, **then** it goes back to "Feeling confident? Hit submit". (23, 24)
- [ ] **Given** the order is fully correct, **when** I submit, **then** I see "Quiz completed!" and every card turns green with a tick. (16, 25, 27)
- [ ] **Given** I have one submit left, **when** that submit is still wrong, **then** I see "X / N correct" and each card turns green or red. (17, 26, 27)
- [ ] **Given** the game is over, **then** Submit is disabled. (13)

### Hints

- [ ] **Given** cards are still in the start list, **then** Hint is disabled. (18)
- [ ] **Given** all items are placed and I have not submitted yet, **when** I press Hint, **then** either one correctly placed item gets a tick, or one wrong item moves to its right place with a tick; the hint count goes up by one. (18, 20, 21)
- [ ] **Given** every card is already in its right place but not all are ticked, **when** I press Hint, **then** every card gets a tick, I see "Quiz completed!" and the submit count does not go up. (19)
- [ ] **Given** I have used all hints, **then** Hint is disabled. (18)
- [ ] **Given** the game is over, **then** Hint is disabled. (18)

### Reveal answer

- [ ] **Given** I have lost, **when** I press Reveal, **then** every card moves to its right place with a tick, and Submit and Hint both show as used up. (28, 29)

### Reset

- [ ] **Given** any game state, **when** I press Reset game, **then** the board goes back to the start-of-game checks above with a new shuffle. (30)

## Notes for the reattempt

Gaps between the hook, the screen and the intent. Decide for each one whether to keep it or fix it.

| #   | What happens now | Description / intent says | Decide |
| --- | ---------------- | ------------------------- | ------ |
| 1   | Ticked cards keep their place and other cards flow around them on drop. | Once correct, it cannot be updated again. | Done |
| 2   | After the game ends, cards can't be dragged. Only the UI blocks this: the reducer still accepts `MOVE_GAME_ITEM`. | Game over should freeze the board. | Done (UI only) |
| 3   | Hint is disabled after the game ends. Only the UI blocks this: the reducer still accepts `GET_HINT` after a loss. | Not stated. | Done (UI only) |
| 4   | Hint works before the first submit. | Not stated. | Done |
| 5   | The shuffle never starts with an item in its right place (`fullRandomShuffleArray`, Sattolo). | Shuffle should never start correct. | Done |
| 6   | "Fix a wrong one" swaps the two cards. | The displaced card goes to the bottom, unless the bottom card is already correct. | Keep or fix |
| 7   | Submitting the same order again uses a try. The first version ignored repeat submits. | Not stated. | Keep or fix |
| 8   | If every card is already in its right place, a hint ticks them all and wins without a submit. | Not stated. | Keep or fix |
| 9   | Mid-game, every unticked card shows a ✗, even before any submit. | Not stated. | Keep or fix |
| 10  | Reveal ticks every card, so the status becomes Won and shows "Quiz completed!" instead of the loss. | Reveal should keep the loss result. | Fix |
| 11  | The Reveal button has no label. | Should say what it does. | Fix |
| 12  | Placing status line is wrong: the check `numGameItems - 1 === numStartItems` is false at the start, so it shows "Items N-1 / 1", and "Items X / N" shows the start count over the game count. | Rule 22. | Fix |
| 13  | Items are matched by `value`, so an answer with repeated values breaks hints and Reveal. | `answer` values must be unique. | Keep or fix |
| 14  | Drag and drop is not wired up yet: the start list is an empty div, the drag handlers only `console.log`, and `useDragAndDrop` is empty. | Rules 4 to 12. | To do |
| 15  | Position numbers only update after a drop, not during the drag. | Stretch: renumber while dragging. | Stretch |
| 16  | Hint picks its action at random. | Stretch: "lottery style" hint. | Stretch |

### How the code is split

All game rules live in the reducer inside `useWordage`. Components only draw and report events. The reducer is a pure function, so it can be tested without any dragging.

- `useWordage({ answer, maxSubmitCount = 3, maxHintCount = 2 })`: holds `startItems`, `inGameItems`, submits, hints and the last submit result. Returns `gameStatus`, `disableSubmit`, `disableGetHint`, `numberCorrectItems`, `numberWrongItems`, plus `onMoveStartItem`, `onMoveGameItem`, `onSubmit`, `onGetHint`, `onReveal` and `reset`. Works out status from the data instead of storing it.
- `useDragAndDrop`: empty for now. Will turn drag events into `onMoveStartItem` or `onMoveGameItem` based on where the drag started, and refuse game items dropped on the start list.
- `NewWordage`: wires the hook to the screen and holds the controls.
- `NewWordageResult`: the status line.
- `NewWordageGameItem`: one card, with its number or tick/cross, its value, and whether it can be dragged.
- Start list: not built yet.

Two lists (`startItems` and `inGameItems`), instead of one list with a `zone` field plus a separate submit copy, removes the "two lists drifting apart" risk from the first version.

```
              ┌───────────────────────────────┐
              │          useWordage           │  all rules live here
              │  (reducer + derived status)   │
              └───────────────┬───────────────┘
            state ▼ / ▲ events│
              ┌───────────────┴───────────────┐
              │          NewWordage           │  wires them up
              └───┬───────────┬───────────┬───┘
                  ▼           ▼           ▼
             start list  NewWordageResult  NewWordageGameItem
            (not built)   (status line)     (one per card)
```
