import { ROUTE_CONFIG } from "@/constants";
import { Link } from "react-router";
import Layout from "./components/Layout";
import { Button } from "./components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  return (
    <Layout>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 grid-flow-row">
        {ROUTE_CONFIG.map((config) => {
          return (
            <Link key={`${config.title}${config.route}`} to={config.route}>
              <Card
                className="flex-auto h-full p-4 w-full flex-col justify-between hover:bg-slate-50"
                size="sm"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-extrabold text-center">
                    <h3>{config.title}</h3>
                  </CardTitle>
                </CardHeader>
                {config.description && (
                  <CardContent className="text-xs text-slate-900 w-full text-center">
                    <span className="text-center">{config.description}</span>
                  </CardContent>
                )}
                <CardAction className="flex align-center justify-center w-full p-0">
                  <Button
                    disabled={!!config?.inProgress}
                    variant="default"
                    size="lg"
                    className="mx-auto"
                  >
                    See exercise
                  </Button>
                </CardAction>
              </Card>
            </Link>
          );
        })}
      </ul>
    </Layout>
  );
}

export default App;
