import { Button } from "@/components/ui/button";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router";

const Layout = ({ children }: PropsWithChildren) => {
  let navigate = useNavigate();

  return (
    <div className="layout">
      <div className="navigation bg-sky-50 p-10 mb-8">
        <div className="mx-auto flex justify-between items-center my-0 max-w-7xl">
          <h3 className="text-lg">React Practice</h3>
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
