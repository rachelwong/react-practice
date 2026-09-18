import type { RouteConfig } from "@/types/Routes";

export const ROUTES = {
  HOME: "/",
  COUNTER: "/counter",
  CART: "/cart",
  FORM_VALIDATION: "/form-validation",
  STAR_REVIEW: "/stars-review",
  TIMER: "/timer",
  DOG_LIST: "/dog-ceos",
  CUSTOM_TEXTAREA: "/custom-textarea",
  MULTI_SIGN_UP: "/multi-sign-up",
  CAROUSEL: "/carousel",
  ACCORDION: "/accordion",
  COPY: "/copy",
  ASYNC_VALIDATION: "/async-validation",
  MUSIC_PLAYER: "/music",
  DEBOUNCE: "/debounce",
  RERENDER_LIST: "/rerender-list",
  RACES: "/races",
  PAGINATION: "/pagination",
  COUNTRY_SEARCH: "/country-search",
  CALCULATOR: "/calculator",
  EXPENSE_TRACKER: "/expense-tracker",
} as const;

export const ROUTE_CONFIG: RouteConfig[] = [
  {
    route: ROUTES.COUNTER,
    title: "Counter Exercise",
  },
  {
    route: ROUTES.CART,
    title: "Shopping Cart",
    description: "useReducer pattern",
  },
  {
    route: ROUTES.FORM_VALIDATION,
    title: "Basic form",
    description: "Single page form with validation using useReducer pattern",
  },
  {
    route: ROUTES.STAR_REVIEW,
    title: "Dynamic Star Review",
    description:
      "useMemo & useCallback to handle onMouseEnter & onMouseOut events",
  },
  {
    route: ROUTES.TIMER,
    title: "Timer",
    description: "useEffect & cleanup setInterval",
  },
  {
    route: ROUTES.DOG_LIST,
    title: "Dog Ceo list",
    description:
      "Display listing and persisting data across browser sessions with redux.",
  },
  {
    route: ROUTES.CUSTOM_TEXTAREA,
    title: "Custom Textarea",
    description: "Controlled custom text area component",
  },
  {
    route: ROUTES.MULTI_SIGN_UP,
    title: "Multi-step Form",
    description: "useReducer to handle multi-step form validation",
    inProgress: true,
  },
  {
    route: ROUTES.CAROUSEL,
    title: "Roll your own carousel",
    description: "In component state management",
  },
  {
    route: ROUTES.ACCORDION,
    title: "Roll your own accordion",
    description: "In component state management",
  },
  {
    route: ROUTES.COPY,
    title: "Copy to Clipboard",
    description: "With custom hook",
  },
  {
    route: ROUTES.ASYNC_VALIDATION,
    title: "Async Field Validation",
    description: "Mock email validation",
  },
  {
    route: ROUTES.MUSIC_PLAYER,
    title: "iTunes Music Player",
    description: "Global Context & iTunes Search API",
  },
  { route: ROUTES.DEBOUNCE, title: "useDebounce", description: "Custom hook" },
  {
    route: ROUTES.RERENDER_LIST,
    title: "Prevent re-rendering list",
    description:
      "useCallback x useMemo to prevent the whole list from re-rendering",
  },
  {
    route: ROUTES.RACES,
    title: "Race timetable",
    description: "Display rolling race timetable",
  },
  {
    route: ROUTES.PAGINATION,
    title: "Pagination",
    description: "Pagination without load more",
  },
  {
    route: ROUTES.COUNTRY_SEARCH,
    title: "Country Search",
    description: "Autocomplete with country suggestions",
  },
  {
    route: ROUTES.CALCULATOR,
    title: "Calculator",
    description: "Roll your own calculator with in-component state",
  },
  {
    route: ROUTES.EXPENSE_TRACKER,
    title: "Expense tracker x Coffee Break-even Calculator",
    description: "Dynamic table with redux & useReducer",
    inProgress: true,
  },
];
