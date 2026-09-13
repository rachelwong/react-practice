import { ROUTES } from "@/constants";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Routes as AllRoutes,
  Route,
  BrowserRouter as Router,
} from "react-router";
import App from "./App.tsx";
import { MultiStepFormProvider } from "./context/MultiStepFormContext.tsx";
import "./index.css";
import AccordionList from "./screens/AccordionList.tsx";
import BasicForm from "./screens/BasicForm.tsx";
import Carousel from "./screens/Carousel.tsx";
import Cart from "./screens/Cart.tsx";
import Counter from "./screens/Counter.tsx";
import CustomTextArea from "./screens/CustomTextArea.tsx";
import DogList from "./screens/DogList.tsx";
import MultiSignupForm from "./screens/MultiSignupForm.tsx";
import StarReview from "./screens/StarReview.tsx";
import Timer from "./screens/Timer.tsx";
import "./styles.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AllRoutes>
        <Route path={ROUTES.HOME} element={<App />} />
        <Route path={ROUTES.COUNTER} element={<Counter />} />
        <Route path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.FORM_VALIDATION} element={<BasicForm />} />
        <Route path={ROUTES.STAR_REVIEW} element={<StarReview />} />
        <Route path={ROUTES.TIMER} element={<Timer />} />
        <Route path={ROUTES.DOG_LIST} element={<DogList />} />
        <Route path={ROUTES.CUSTOM_TEXTAREA} element={<CustomTextArea />} />

        <Route
          path={ROUTES.MULTI_SIGN_UP}
          element={
            <MultiStepFormProvider>
              <MultiSignupForm />
            </MultiStepFormProvider>
          }
        />
        <Route path={ROUTES.CAROUSEL} element={<Carousel />} />
        <Route path={ROUTES.ACCORDION} element={<AccordionList />} />
      </AllRoutes>
    </Router>
  </StrictMode>,
);
