import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useEffect, type PropsWithChildren } from "react";
import { Link, useLocation, useNavigate } from "react-router";

const Layout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="layout">
      <div className="navigation bg-sky-50 p-10 mb-8">
        <div className="mx-auto flex justify-between items-center my-0 max-w-7xl">
          <Link to={ROUTES.HOME}>
            <h3 className="text-3xl font-extrabold mb-1 text-slate-900">
              React Practice
            </h3>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
          >
            Go back
          </Button>
        </div>
      </div>
      <div className="mx-auto my-0 max-w-7xl">{children}</div>
    </div>
  );
};

export default Layout;
