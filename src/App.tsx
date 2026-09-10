import { Link } from "react-router";
import Layout from "./components/Layout";
import ROUTES from "./constants/Routes";

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold mb-2">Exercises</h1>
      <ol className="list-decimal ml-4">
        <li className="hover:text-sky-600">
          <Link to={ROUTES.COUNTER}>Counter exercise</Link>
        </li>
      </ol>
    </Layout>
  );
}

export default App;
