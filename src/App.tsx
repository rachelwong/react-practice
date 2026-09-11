import { ROUTES } from "@/constants";
import { Link } from "react-router";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Exercises</h1>
      <ol className="list-decimal ml-4">
        <li className="hover:text-sky-600">
          <Link to={ROUTES.COUNTER}>Counter exercise</Link>
        </li>
        <li className="hover:text-sky-600">
          <Link to={ROUTES.CART}>Shopping Cart</Link>
        </li>
        <li className="hover:text-sky-600">
          <Link to={ROUTES.FORM_VALIDATION}>Basic form</Link>
        </li>
        <li className="hover:text-sky-600">
          <Link to={ROUTES.MULTI_SIGN_UP}>Multi step sign up</Link>
        </li>
      </ol>
    </Layout>
  );
}

export default App;
