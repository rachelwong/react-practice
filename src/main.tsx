import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Routes as AllRoutes,
  Route,
  BrowserRouter as Router,
} from "react-router";
import App from "./App.tsx";
import Cart from "./Cart.tsx";
import { ROUTES } from "@/constants";
import Counter from "./Counter.tsx";
import "./index.css";
import "./styles.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AllRoutes>
        <Route path={ROUTES.HOME} element={<App />} />
        <Route path={ROUTES.COUNTER} element={<Counter />} />
        <Route path={ROUTES.CART} element={<Cart />} />
      </AllRoutes>
    </Router>
  </StrictMode>,
);
