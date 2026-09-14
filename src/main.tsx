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
import { MusicPlayerProvider } from "./context/MusicPlayerContext.tsx";
import "./index.css";
import AccordionList from "./screens/AccordionList.tsx";
import AsyncFieldValidation from "./screens/AsyncFieldValidation.tsx";
import BasicForm from "./screens/BasicForm.tsx";
import Carousel from "./screens/Carousel.tsx";
import Cart from "./screens/Cart.tsx";
import CopyToClipboard from "./screens/CopyToClipboard.tsx";
import Counter from "./screens/Counter.tsx";
import CustomTextArea from "./screens/CustomTextArea.tsx";
import Debounce from "./screens/Debounce.tsx";
import DogList from "./screens/DogList.tsx";
import MultiSignupForm from "./screens/MultiSignupForm.tsx";
import MusicPlayer from "./screens/MusicPlayer.tsx";
import RerenderList from "./screens/RerenderList.tsx";
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
        <Route path={ROUTES.COPY} element={<CopyToClipboard />} />
        <Route
          path={ROUTES.ASYNC_VALIDATION}
          element={<AsyncFieldValidation />}
        />
        <Route
          path={ROUTES.MUSIC_PLAYER}
          element={
            <MusicPlayerProvider>
              <MusicPlayer />
            </MusicPlayerProvider>
          }
        />
        <Route path={ROUTES.DEBOUNCE} element={<Debounce />} />
        <Route path={ROUTES.RERENDER_LIST} element={<RerenderList />} />
      </AllRoutes>
    </Router>
  </StrictMode>,
);
