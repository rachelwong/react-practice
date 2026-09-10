import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes as AllRoutes, Route, BrowserRouter as Router } from "react-router";
import App from './App.tsx';
import ROUTES from './constants/Routes.ts';
import Counter from './Counter.tsx';
import './index.css';
import './styles.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AllRoutes>
        <Route path={ROUTES.HOME} element={<App />}/>
        <Route path={ROUTES.COUNTER} element={<Counter />} />
      </AllRoutes>
    </Router>
  </StrictMode>,
)
