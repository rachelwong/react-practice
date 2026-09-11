import type { ROUTES } from "@/constants";

export type RouteConfig = {
  route: (typeof ROUTES)[keyof typeof ROUTES];
  title: string;
  description?: string;
  inProgress?: boolean;
};
