import { Link } from "react-router";
import Layout from "./components/Layout";
import ROUTES from "./constants/Routes";

function App() {
  return (
    <Layout>
      <ul>
        <li>
          <Link to={ROUTES.COUNTER}>Counter exercise</Link>
        </li>
      </ul>
    </Layout>
  );
}

export default App;
