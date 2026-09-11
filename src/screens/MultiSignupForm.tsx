import Layout from "@/components/Layout";
import { Outlet } from "react-router";

const MultiSignupForm = () => {
  return (
    <Layout
      heading={
        <>
          <h3>Multi Sign up form</h3>
          <p>
            Brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/wizard-state-machine"
              target="_blank"
            >
              https://www.reactgrind.com/problems/wizard-state-machine
            </a>
          </p>
        </>
      }
    >
      <Outlet />
    </Layout>
  );
};

export default MultiSignupForm;
