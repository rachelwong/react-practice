import AccountStep from "@/components/AccountStep";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { useMultiStepForm } from "@/context/MultiStepFormContext";
import { MULTI_FORM_STEPS } from "@/types/MultiStepForm";

const MultiSignupForm = () => {
  const { state } = useMultiStepForm();
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
      <Card className="w-full p-6">
        <h3 className="text-lg font-extrabold text-slate-900">
          Step {JSON.stringify(state.step)} of {MULTI_FORM_STEPS.length}{" "}
          {JSON.stringify(MULTI_FORM_STEPS.indexOf(state.step))}
        </h3>

        <p>on parent email {JSON.stringify(state.formData.email)}</p>
        <p>on parent password {JSON.stringify(state.formData.password)}</p>
        <AccountStep />
        {/* <div className="mt-6 nav flex flex-row justify-between align-center">
          <Button
            variant="outline"
            disabled={!onSubmit}
            onClick={() => {
              if (onSubmit) {
                onSubmit();
              }
            }}
          >
            Back
          </Button>
          <Button
            disabled={!onSubmit}
            onClick={() => {
              if (onSubmit) {
                onSubmit();
              }
            }}
          >
            Next
          </Button>
        </div> */}
      </Card>
    </Layout>
  );
};

export default MultiSignupForm;
