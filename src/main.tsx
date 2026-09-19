import { ROUTES } from "@/constants";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  Routes as AllRoutes,
  Route,
  BrowserRouter as Router,
} from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { dogCeoStore } from "./context/breedStore.ts";
import { expensePersistor, expenseStore } from "./context/expenseStore.ts";
import { MultiStepFormProvider } from "./context/MultiStepFormContext.tsx";
import { MusicPlayerProvider } from "./context/MusicPlayerContext.tsx";
import RacesContextProvider from "./context/RacesContext.tsx";
import "./index.css";
import "./styles.scss";

const HomeScreen = lazy(() => import("./Home.tsx"));
const CounterScreen = lazy(() => import("./screens/Counter.tsx"));
const CartScreen = lazy(() => import("./screens/Cart.tsx"));
const BasicFormScreen = lazy(() => import("./screens/BasicForm.tsx"));
const StarReviewScreen = lazy(() => import("./screens/StarReview.tsx"));
const TimerScreen = lazy(() => import("./screens/Timer.tsx"));
const ReduxDogListScreen = lazy(() => import("./screens/ReduxDogList.tsx"));
const CustomTextAreaScreen = lazy(() => import("./screens/CustomTextArea.tsx"));
const MultiSignupFormScreen = lazy(
  () => import("./screens/MultiSignupForm.tsx"),
);
const CarouselScreen = lazy(() => import("./screens/Carousel.tsx"));
const AccordionListScreen = lazy(() => import("./screens/AccordionList.tsx"));
const CopyToClipboardScreen = lazy(
  () => import("./screens/CopyToClipboard.tsx"),
);
const AsyncFieldValidationScreen = lazy(
  () => import("./screens/AsyncFieldValidation.tsx"),
);
const MusicPlayerScreen = lazy(() => import("./screens/MusicPlayer.tsx"));
const DebounceScreen = lazy(() => import("./screens/Debounce.tsx"));
const RerenderListScreen = lazy(() => import("./screens/RerenderList.tsx"));
const RacesScreen = lazy(() => import("./screens/Races.tsx"));
const PaginationScreen = lazy(() => import("./screens/Pagination.tsx"));
const CountrySearchScreen = lazy(() => import("./screens/CountrySearch.tsx"));
const CalculatorScreen = lazy(() => import("./screens/Calculator.tsx"));
const ExpenseTrackerScreen = lazy(() => import("./screens/ExpenseTracker.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AllRoutes>
        <Route path={ROUTES.HOME} element={<HomeScreen />} />
        <Route path={ROUTES.COUNTER} element={<CounterScreen />} />
        <Route path={ROUTES.CART} element={<CartScreen />} />
        <Route path={ROUTES.FORM_VALIDATION} element={<BasicFormScreen />} />
        <Route path={ROUTES.STAR_REVIEW} element={<StarReviewScreen />} />
        <Route path={ROUTES.TIMER} element={<TimerScreen />} />
        <Route
          path={ROUTES.DOG_LIST}
          element={
            <Provider store={dogCeoStore}>
              <ReduxDogListScreen />
            </Provider>
          }
        />
        <Route
          path={ROUTES.CUSTOM_TEXTAREA}
          element={<CustomTextAreaScreen />}
        />
        <Route
          path={ROUTES.MULTI_SIGN_UP}
          element={
            <MultiStepFormProvider>
              <MultiSignupFormScreen />
            </MultiStepFormProvider>
          }
        />
        <Route path={ROUTES.CAROUSEL} element={<CarouselScreen />} />
        <Route path={ROUTES.ACCORDION} element={<AccordionListScreen />} />
        <Route path={ROUTES.COPY} element={<CopyToClipboardScreen />} />
        <Route
          path={ROUTES.ASYNC_VALIDATION}
          element={<AsyncFieldValidationScreen />}
        />
        <Route
          path={ROUTES.MUSIC_PLAYER}
          element={
            <MusicPlayerProvider>
              <MusicPlayerScreen />
            </MusicPlayerProvider>
          }
        />
        <Route path={ROUTES.DEBOUNCE} element={<DebounceScreen />} />
        <Route path={ROUTES.RERENDER_LIST} element={<RerenderListScreen />} />
        <Route
          path={ROUTES.RACES}
          element={
            <RacesContextProvider>
              <RacesScreen />
            </RacesContextProvider>
          }
        />
        <Route path={ROUTES.PAGINATION} element={<PaginationScreen />} />
        <Route path={ROUTES.COUNTRY_SEARCH} element={<CountrySearchScreen />} />
        <Route path={ROUTES.CALCULATOR} element={<CalculatorScreen />} />
        <Route
          path={ROUTES.EXPENSE_TRACKER}
          element={
            <Provider store={expenseStore}>
              <PersistGate loading={null} persistor={expensePersistor}>
                <ExpenseTrackerScreen />
              </PersistGate>
            </Provider>
          }
        />
      </AllRoutes>
    </Router>
  </StrictMode>,
);
