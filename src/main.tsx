import { ROUTES } from "@/constants";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Routes as AllRoutes,
  Route,
  BrowserRouter as Router,
} from "react-router";
import App from "./App.tsx";
import BasicForm from "./BasicForm.tsx";
import Cart from "./Cart.tsx";
import Counter from "./Counter.tsx";
import MultiSignupForm from "./MultiSignupForm.tsx";
import "./index.css";
import "./styles.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AllRoutes>
        <Route path={ROUTES.HOME} element={<App />} />
        <Route path={ROUTES.COUNTER} element={<Counter />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.FORM_VALIDATION} element={<BasicForm />} />
        <Route path={ROUTES.MULTI_SIGN_UP} element={<MultiSignupForm />} />
      </AllRoutes>
    </Router>
  </StrictMode>,
);
