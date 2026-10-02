# Unit Cost Break-Even Logic

## What this answers

"I spent money upfront on something (e.g. a coffee machine). If I'd instead kept
buying the same thing externally (e.g. shop-bought coffee), when would that
ongoing spending have caught up to and overtaken what I already spent?"

## The two numbers being compared

- **Investment** — the total you already spent (`filteredTotal`), a one-off amount.
- **External-equivalent cost** — what buying the same units externally would
  cost, accumulating over time at a fixed weekly rate:
  `numPerWeek × unitPrice` per week.

## The formula

Break-even happens once the external-equivalent cost, accumulated week by
week from the start date, equals the investment:

```
weeksToBreakEven = investment ÷ (numPerWeek × unitPrice)
breakEvenDate    = startDate + weeksToBreakEven
```

Because the weekly external cost is constant, this date can land in the
past, today, or the future — it depends purely on the investment size and
weekly rate, not on today's date.

_(All examples below assume today = 18/09/2026.)_

## Example 1 — breaks even today

- Investment: **$100**, Units/week: **5**, Price/unit: **$10** → weekly cost = $50
- Start date: **04/09/2026** (2 weeks ago)

```
weeksToBreakEven = 100 ÷ 50 = 2 weeks
breakEvenDate    = 04/09/2026 + 2 weeks = 18/09/2026 (today)
```

## Example 2 — broke even in the past

- Investment: **$100**, Units/week: **10**, Price/unit: **$10** → weekly cost = $100
- Start date: **04/09/2026** (2 weeks ago)

```
weeksToBreakEven = 100 ÷ 100 = 1 week
breakEvenDate    = 04/09/2026 + 1 week = 11/09/2026 (1 week in the past)
```

## Example 3 — breaks even in the future

- Investment: **$500**, Units/week: **5**, Price/unit: **$10** → weekly cost = $50
- Start date: **11/09/2026** (1 week ago)

```
weeksToBreakEven = 500 ÷ 50 = 10 weeks
breakEvenDate    = 11/09/2026 + 10 weeks = 20/11/2026 (about 2 months from today)
```

## Example 4 — decimal weeks and how rounding works

- Investment: **$100**, Units/week: **3**, Price/unit: **$10** → weekly cost = $30
- Start date: **01/09/2026**

```
weeksToBreakEven (exact) = 100 ÷ 30 = 3.3333... weeks
```

The exact answer rarely lands on a clean week boundary. The rule is
**round up (ceiling) to 2 decimal places**, so partial weeks never get
rounded away in the investment's favour:

```
weeksToBreakEven (rounded) = ceil(3.3333... × 100) / 100 = 3.34 weeks
```

Note this rounds _up_ even though standard "nearest" rounding would have
given 3.33 — the extra 0.01 week (~1 hour) is added deliberately so the
break-even date is never reported earlier than it actually is:

```
breakEvenDate = 01/09/2026 + 3.34 weeks ≈ 24/09/2026, 01:07
```

versus the (very slightly earlier) exact-math date of ≈ 24/09/2026, 00:00
if no rounding were applied.
