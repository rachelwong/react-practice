import ReducerAccountStep from "@/components/ReducerAccountStep";
import useMultiStepForm from "@/hooks/useMultiStepForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReducerProfileStep from "./ReducerProfileStep";
import ReviewStep from "./ReviewStep";
import { Button } from "./ui/button";
import { Progress, ProgressLabel } from "./ui/progress";

const SCREEN_NAME = {
  PROFILE: "PROFILE",
  ACCOUNT: "ACCOUNT",
  REVIEW: "REVIEW",
};

const SCREENS = [SCREEN_NAME.PROFILE, SCREEN_NAME.ACCOUNT, SCREEN_NAME.REVIEW];

const ReducerMultiStepForm = () => {
  const {
    state,
    validateName,
    validateDOB,
    validatePassword,
    validateEmail,
    onChangeName,
    onChangeDOB,
    onChangePassword,
    onChangeEmail,
    onChangeGender,
    incrementStep,
    decrementStep,
    reset,
    isProfileStepValid,
    isAccountStepValid,
  } = useMultiStepForm(SCREENS.length);

  const { currIndex, profile, account } = state;
  const progress = ((state.currIndex + 1) / state.totalNumberOfSteps) * 100;

  const isProfileStep = SCREENS[currIndex] === SCREEN_NAME.PROFILE;
  const isAccountStep = SCREENS[currIndex] === SCREEN_NAME.ACCOUNT;
  const isReviewStep = SCREENS[currIndex] === SCREEN_NAME.REVIEW;

  const canProgress =
    (isProfileStep && isProfileStepValid) ||
    (isAccountStep && isAccountStepValid);

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start rounded border-1 border-neutral-800 p-7 gap-y-3">
      <div className="w-full flex flex-row items-center justify-between gap-x-6">
        <Button
          size="lg"
          disabled={currIndex === 0}
          onClick={() => decrementStep()}
        >
          <ChevronLeft />
          Prev
        </Button>
        <Progress value={progress} className="w-full">
          <ProgressLabel>Form progress</ProgressLabel>
        </Progress>
        {state.currIndex + 1 !== state.totalNumberOfSteps && (
          <Button
            size="lg"
            disabled={!canProgress}
            onClick={() => incrementStep()}
          >
            <ChevronRight />
            Next
          </Button>
        )}
      </div>
      {isProfileStep && (
        <ReducerProfileStep
          onChangeName={onChangeName}
          onChangeGender={onChangeGender}
          validateName={validateName}
          onChangeDob={onChangeDOB}
          validateDob={validateDOB}
          dateOfBirth={profile.dateOfBirth}
          name={profile.name}
          gender={profile.gender}
        />
      )}
      {isAccountStep && (
        <ReducerAccountStep
          onChangeEmail={onChangeEmail}
          onChangePassword={onChangePassword}
          validateEmail={validateEmail}
          validatePassword={validatePassword}
          email={account.email}
          password={account.password}
        />
      )}
      {isReviewStep && (
        <ReviewStep
          email={account.email.value}
          name={profile.name.value}
          dateOfBirth={profile.dateOfBirth.value}
          password={account.password.value}
          reset={reset}
        />
      )}
    </div>
  );
};

export default ReducerMultiStepForm;
