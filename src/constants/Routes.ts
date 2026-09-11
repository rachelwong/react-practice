import type { RouteConfig } from "@/types/Routes";

export const ROUTES = {
  HOME: "/",
  COUNTER: "/counter",
  CART: "/cart",
  FORM_VALIDATION: "/form-validation",
  STAR_REVIEW: "/stars-review",
  TIMER: "/timer",
  MULTI_SIGN_UP: "/multi-sign-up",
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
    route: ROUTES.STAR_REVIEW,
    title: "Timer",
    description: "useEffect & cleanup setInterval",
  },
  {
    route: ROUTES.MULTI_SIGN_UP,
    title: "Multi-step Form",
    description: "useReducer to handle multi-step form validation",
    inProgress: true,
  },
];
