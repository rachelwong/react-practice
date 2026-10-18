# Wordage — business rules and acceptance criteria

Notes for [src/screens/Wordage.tsx](../../../src/screens/Wordage.tsx) and [src/components/WordageItemBrowser.tsx](../../../src/components/WordageItemBrowser.tsx), written down before a rebuild.

Brief: <https://www.abc.net.au/news/2026-10-04/abc-wordage-quiz/107211586>

## Overview

Wordage is a sorting quiz. The player drags six colours into the right order (red, orange, yellow, green, blue, purple) and gets 3 submits and 2 hints to do it. This page describes what the current code actually does, so the rebuild can match it on purpose rather than by accident.

The screen has three parts:

- **Start pile**: a stack of the colours not yet placed. Only the top card can be picked up. Up to two more peek out behind it.
- **Answer list**: a numbered list where the player builds and reorders their answer.
- **Controls**: Submit (x/3), Reset game, and Hint (x/2), plus a status line above the list.

```
        ┌──────────────┐
        │  ░ next 2 ░  │      <- preview cards (not draggable)
        │   [ blue ]   │      <- top card (draggable)
        └──────────────┘
          status line
   ┌──────────────────────────┐
   │ 1 │ red                  │
   │ 2 │ green            ✓   │  <- ticked = locked
   │ - - - - - - - - - - - -  │  <- dashed slot while dragging
   │ 3 │ orange               │
   └──────────────────────────┘
   [ Submit 1/3 ] [ Reset ] [ Hint 0/2 ]
```

Where the code and the on-screen description disagree, this page follows the code and lists the gap in [Notes for the reattempt](#notes-for-the-reattempt).

## Business rules

### Setting up a game

1. There are always six colours, and the winning order is fixed: red, orange, yellow, green, blue, purple.
2. At the start, the colours are shuffled. The first colour of the shuffle goes straight into the answer list. The other five go into the start pile in shuffled order.
3. The shuffle is not checked, so the starting order can by chance already be partly or fully correct.
4. The player starts with 0 of 3 submits used and 0 of 2 hints used.

### The start pile

5. Only the top card of the pile can be dragged. The next two cards are shown behind it as a preview. Cards further down are hidden.
6. While a card is being dragged, the top card disappears from the pile and the preview cards grow slightly.
7. Dropping a card back onto the pile does nothing. Cards cannot be reordered inside the pile.
8. When the pile is empty it disappears from the screen.

### Placing and reordering in the answer list

9. A card can only move from the pile into the answer list, never back.
10. While dragging over a card in the list, a dashed empty slot appears: above that card if the pointer is in its top half, below it if in its bottom half.
11. Dragging over the card you are holding shows no slot.
12. On drop, the card goes where the dashed slot was shown.
13. A card from the pile dropped on empty space in the list (no slot shown) goes to the bottom of the list.
14. A card already in the list dropped on empty space stays where it was.
15. Each card in the list shows its position number (1–6).
16. A card that has been confirmed correct (by a submit or a hint) is locked: it cannot be picked up again, and dropping another card never pushes it out of its place. The other cards flow around it.

### Submitting

17. Submit is only enabled once all six colours are in the answer list.
18. A submit is ignored if the order is exactly the same as the last submit, or if the game is already over. Ignored submits do not use up a try.
19. Each submit checks every position. Any colour in its correct position is marked correct and gets a tick.
20. The game is **won** when a submit has every colour in the right place.
21. The game is **lost** when 3 submits are used without a win.

### Hints

22. Hint is disabled while any cards are still in the pile, and once both hints are used.
23. A hint only does something after at least one submit, and only if that last submit had at least one wrong colour.
24. Each hint randomly picks one of two actions (50/50):
    - **Reveal a correct one**: find the first colour that is already in its right place but not yet ticked, and tick it. If there is none, fall back to the swap below.
    - **Fix a wrong one**: pick a random colour that is in the wrong place, swap it with whatever is sitting in its correct place, and tick it.
25. Using a hint uses one of the two hint tries.

### Status messages

26. While placing: if only the first card is in the list, show "Drag and place 5 items from start to end". Otherwise show "Items X / 6".
27. Once all six are placed and the game is still going: "Feeling confident? Hit submit".
28. On a win: a green tick and "Quiz completed!".
29. On a loss: a red cross and "X / 6 correct", counted from the last submit.
30. Once the game is over, every list card turns green with a tick if it is in the right place, or red with a cross if not. The tick or cross replaces the position number.

### Reset

31. Reset game can be pressed at any time. It reshuffles, puts one colour in the list and five in the pile, and clears submits, hints and any drag in progress.

## Diagrams

### Game flow: each submit either wins, uses up a try, or ends the game

```
 ┌───────────┐  all placed  ┌─────────────┐  submit   ◇──────────────◇  yes  ┌─────────────────┐
 │  Placing  │ ───────────▶ │   Playing   │ ────────▶ │ All in place? │ ────▶ │       Won       │
 │cards left │              │ all 6 in    │           ◇──────────────◇       │ Quiz completed! │
 │  in pile  │              │  the list   │                  │ no            └─────────────────┘
 └───────────┘              └─────────────┘                  ▼
       ▲                           ▲  no, try again  ◇────────────────◇  yes  ┌─────────────────┐
       │                           └──────────────── │ 3 submits used? │ ────▶ │      Lost       │
       │                                             ◇────────────────◇       │  X / 6 correct  │
       │                                                                      └─────────────────┘
       │                                                                               ┆
       └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ Reset game, from any state ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
```

The game status is worked out from the data, not stored: Placing until all six are in the list, then each submit either wins, sends you back to try again, or ends the game on the third miss. A submit with the same order as last time is ignored and never reaches the checks.

### How a hint decides

```
              ┌────────────┐
              │ Press Hint │
              └─────┬──────┘
                    ▼
        ◇────────────────────────◇   no    ┌──────────────────────┐
        │ Last submit had a      │ ──────▶ │   Nothing happens    │
        │ wrong colour?          │         │ (hint is not used up)│
        ◇────────────────────────◇         └──────────────────────┘
                    │ yes
                    ▼
           ◇────────────────◇  reveal  ◇──────────────────◇  yes  ┌──────────────────────┐
           │ Random 50 / 50 │ ───────▶ │ Any right colour │ ────▶ │ Reveal a correct one │
           ◇────────────────◇          │ not yet ticked?  │       │  tick the first one  │
                    │ fix              ◇──────────────────◇       └──────────┬───────────┘
                    ▼                           │ none, fall back            │
     ┌──────────────────────────────┐           │                            │
     │       Fix a wrong one        │ ◀─────────┘                            │
     │ pick a random wrong colour,  │                                        │
     │ swap it into its right place,│                                        │
     │ and tick it                  │                                        │
     └──────────────┬───────────────┘                                        │
                    │              ┌──────────────────────────┐              │
                    └────────────▶ │      Hint count +1       │ ◀────────────┘
                                   │ Hint shows 1/2, then 2/2 │
                                   └──────────────────────────┘
```

A hint only counts when it actually changes something. "Last submit had a wrong colour?" is also "no" before the first submit, which is why Hint looks enabled but does nothing then.

## Acceptance criteria

Each check is written as Given / When / Then, and the rule numbers it covers are in brackets. Tick them off as the rebuild passes them.

### Start of game

- [ ] **Given** the page loads, **then** one colour is in the answer list at position 1, five are in the pile, Submit shows 0/3 and Hint shows 0/2. (2, 4)
- [ ] **Given** the page loads, **then** the status line reads "Drag and place 5 items from start to end". (26)
- [ ] **Given** the pile has 3 or more cards, **then** one draggable card and two preview cards are visible. (5)

### Dragging from the pile

- [ ] **Given** I drag the top pile card over the top half of a list card, **then** a dashed slot shows above that card. (10)
- [ ] **Given** I drag over the bottom half, **then** the dashed slot shows below it. (10)
- [ ] **Given** a dashed slot is showing, **when** I drop, **then** the card lands in that slot and the numbers update. (12, 15)
- [ ] **Given** no dashed slot is showing, **when** I drop a pile card in the list, **then** it goes to the bottom. (13)
- [ ] **Given** I drop a pile card back onto the pile, **then** nothing changes. (7)
- [ ] **Given** I place a second card, **then** the status line reads "Items 2 / 6". (26)
- [ ] **Given** I place the last pile card, **then** the pile disappears and the status reads "Feeling confident? Hit submit". (8, 27)

### Reordering the list

- [ ] **Given** I drag a list card onto the pile area, **then** it stays in the list. (9)
- [ ] **Given** I drag a list card over itself, **then** no dashed slot shows. (11)
- [ ] **Given** I drop a list card on empty list space, **then** the order does not change. (14)
- [ ] **Given** a card has a tick, **then** I cannot pick it up. (16)
- [ ] **Given** a card has a tick, **when** I drop another card above it, **then** the ticked card keeps its position number. (16)

### Submitting

- [ ] **Given** cards are still in the pile, **then** Submit is disabled. (17)
- [ ] **Given** all six are placed, **when** I submit, **then** Submit shows 1/3 and every colour in its right place gets a tick. (19)
- [ ] **Given** I submit, **when** I submit again without changing anything, **then** nothing happens and the count does not go up. (18)
- [ ] **Given** the order is fully correct, **when** I submit, **then** I see "Quiz completed!" and all six cards turn green with ticks. (20, 28, 30)
- [ ] **Given** I have used 2 submits, **when** my 3rd submit is still wrong, **then** I see "X / 6 correct" and each card turns green or red. (21, 29, 30)
- [ ] **Given** the game is over, **when** I press Submit, **then** nothing happens. (18)

### Hints

- [ ] **Given** cards are still in the pile, **then** Hint is disabled. (22)
- [ ] **Given** I have not submitted yet, **when** I press Hint, **then** nothing changes. (23)
- [ ] **Given** my last submit had wrong colours, **when** I press Hint, **then** either one unticked correct colour gets a tick, or one wrong colour moves to its right place with a tick; Hint shows 1/2. (24, 25)
- [ ] **Given** I have used 2 hints, **then** Hint is disabled. (22)

### Reset

- [ ] **Given** any game state, **when** I press Reset game, **then** the board goes back to the start-of-game checks above with a new shuffle. (31)

## Notes for the reattempt

The current version has a few gaps between what the description promises and what the code does. Decide for each one whether the rebuild should copy it or fix it.

| # | What happens now | Description / intent says | Decide |
| --- | --- | --- | --- |
| 1 | Fixed: ticked cards keep their place and other cards flow around them on drop. | Once correct, it cannot be updated again. | Done |
| 2 | After the game ends, unticked cards can still be dragged, which changes the green/red result. | Game over should freeze the board. | Keep or fix |
| 3 | Hint stays clickable after the game ends and can still move cards. | Not stated. | Keep or fix |
| 4 | Hint is enabled before the first submit but does nothing. | Not stated. | Keep or fix |
| 5 | "Fix a wrong one" swaps the two cards. | The displaced card goes to the bottom, unless the bottom card is already correct. | Keep or fix |
| 6 | Cards are never marked "wrong" during play, so the cross icon mid-game never shows. | Not stated. | Keep or fix |
| 7 | Hint ticks are not saved into the submit history, so the end-of-game count only uses the last submit. | Not stated. | Keep or fix |
| 8 | The shuffle can start already solved. | Shuffle should never start correct (TODO in code). | Keep or fix |
| 9 | Position numbers only update after a drop, not during the drag. | Stretch: renumber while dragging. | Stretch |
| 10 | Hint picks its action at random. | Stretch: "lottery style" hint. | Stretch |

### Suggested component split

Keep all game rules in one place and let the components only draw and report events. A pure function (or `useReducer`) that takes the current state and an action, and returns the next state, can be tested without any dragging.

- `useWordageGame`: holds the pile, the answer list, submits, hints and status. Exposes `place`, `move`, `submit`, `hint`, `reset`. Works out status from the data instead of storing it.
- `StartPile`: shows the top card and the preview; reports "drag started".
- `AnswerList`: shows numbered cards and the dashed slot; reports "dropped at index N".
- `AnswerCard`: one row: number or tick/cross, colour name, locked or not.
- `GameControls`: Submit, Reset, Hint buttons with their counts and enabled rules.
- `StatusLine`: picks the message from the status.

One list of placed colours (instead of a single list with a `zone` field plus a separate submit copy) removes the "two lists drifting apart" risk noted in the code.

```
                    ┌──────────────────────┐
                    │   useWordageGame     │  all rules live here
                    │ place · move · submit│
                    │ hint · reset         │
                    └──────────┬───────────┘
          state ▼ / ▲ events   │
   ┌──────────────┬────────────┼──────────────┬──────────────┐
   ▼              ▼            ▼              ▼              ▼
StartPile     StatusLine   AnswerList    GameControls     (Wordage.tsx
                               │                           wires them up)
                               ▼
                           AnswerCard
```
