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
      "Display listing and persisting data across browser sessions. In progress to centralise state management.",
    inProgress: true,
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
];
