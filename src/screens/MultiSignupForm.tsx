import AccountStep from "@/components/AccountStep";
import Layout from "@/components/Layout";
import ProfileStep from "@/components/ProfileStep";
import ReviewStep from "@/components/ReviewStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMultiStepForm } from "@/context/MultiStepFormContext";
import {
  FORM_STEP_ID,
  MULTI_FORM_STEP_ACTION,
  MULTI_FORM_STEPS,
} from "@/types/MultiStepForm";

const MultiSignupForm = () => {
  const { state, onChangeStep } = useMultiStepForm();
  const formattedCurrentStep = MULTI_FORM_STEPS.indexOf(state.step) + 1;
  const totalSteps = MULTI_FORM_STEPS.length;
  const canProceed = MULTI_FORM_STEPS.indexOf(state.step) + 1 < totalSteps;
  const canGoBack = !!MULTI_FORM_STEPS.indexOf(state.step);

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
          Step {formattedCurrentStep} of {totalSteps}
        </h3>
        {state.step === FORM_STEP_ID.ACCOUNT && <AccountStep />}
        {state.step === FORM_STEP_ID.PROFILE && <ProfileStep />}
        {state.step === FORM_STEP_ID.REVIEW && <ReviewStep />}
        <div className="mt-6 nav flex flex-row justify-between align-center">
          <Button
            size="lg"
            variant="default"
            disabled={!canGoBack}
            onClick={() => onChangeStep(MULTI_FORM_STEP_ACTION.BACK)}
          >
            Back
          </Button>
          <Button
            size="lg"
            variant="default"
            disabled={!canProceed}
            onClick={() => onChangeStep(MULTI_FORM_STEP_ACTION.NEXT)}
          >
            Next
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default MultiSignupForm;
