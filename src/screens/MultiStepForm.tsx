import Layout from "@/components/Layout";
import ReducerMultiStepForm from "../components/ReducerMultiStepForm";

const MultiStepForm = () => {
  return (
    <Layout
      title="Multi Sign up form"
      brief="https://www.reactgrind.com/problems/wizard-state-machine"
    >
      <div className="max-w-4xl w-full h-auto flex flex-col mx-auto justify-start items-start gap-y-10">
        {/* useReducer approach */}
        <div className="flex flex-col items-center justify-start gap-y-3 w-full ">
          <h3 className="text-3xl text-neutral-600 font-extrabold text-center">
            UseReducer approach
          </h3>
          <ReducerMultiStepForm />
        </div>
      </div>
    </Layout>
  );
};

export default MultiStepForm;
