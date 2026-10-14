import multiStepFormMachine from "@/context/MultiStepFormMachine";
import { useActor } from "@xstate/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewStep from "./ReviewStep";
import { Button } from "./ui/button";
import { Progress, ProgressLabel } from "./ui/progress";
import XstateAccountStep from "./XstateAccountStep";
import XstateProfileStep from "./XstateProfileStep";

const SCREEN_NAME = {
  PROFILE: "PROFILE",
  ACCOUNT: "ACCOUNT",
  REVIEW: "REVIEW",
};

const SCREENS = [SCREEN_NAME.PROFILE, SCREEN_NAME.ACCOUNT, SCREEN_NAME.REVIEW];

const XstateMultiStepForm = () => {
  const [snapshot, send] = useActor(multiStepFormMachine, {
    input: { totalNumberOfSteps: SCREENS.length },
  });
  const profileStepMachineRef = snapshot.children.profileForm;
  const accountStepMachineRef = snapshot.children.accountForm;
  const progress =
    ((snapshot.context.currIndex + 1) / snapshot.context.totalNumberOfSteps) *
    100;

  const isProfileStep =
    SCREENS[snapshot.context.currIndex] === SCREEN_NAME.PROFILE;
  const isAccountStep =
    SCREENS[snapshot.context.currIndex] === SCREEN_NAME.ACCOUNT;
  const isReviewStep =
    SCREENS[snapshot.context.currIndex] === SCREEN_NAME.REVIEW;

  // parent machine tells child machine to send up the values
  const handleNext = () => {
    if (isProfileStep) profileStepMachineRef?.send({ type: "SUBMIT" });
    if (isAccountStep) accountStepMachineRef?.send({ type: "SUBMIT" });
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start rounded border-1 border-neutral-800 p-7 gap-y-3">
      <div className="w-full flex flex-row items-center justify-between gap-x-6">
        <Button
          size="lg"
          disabled={snapshot.context.currIndex === 0}
          onClick={() => {
            send({ type: "DECREMENT_STEP" });
          }}
        >
          <ChevronLeft />
          Prev
        </Button>
        <Progress value={progress} className="w-full">
          <ProgressLabel>Form progress</ProgressLabel>
        </Progress>
        {snapshot.context.currIndex + 1 !==
          snapshot.context.totalNumberOfSteps && (
          <Button
            size="lg"
            onClick={() => {
              handleNext();
            }}
          >
            <ChevronRight />
            Next
          </Button>
        )}
      </div>
      {isProfileStep && profileStepMachineRef && (
        <XstateProfileStep actorRef={profileStepMachineRef} />
      )}
      {isAccountStep && accountStepMachineRef && (
        <XstateAccountStep actorRef={accountStepMachineRef} />
      )}
      {isReviewStep && (
        <ReviewStep
          email={snapshot.context.account.email}
          password={snapshot.context.account.password}
          name={snapshot.context.profile.name}
          dateOfBirth={snapshot.context.profile.dateOfBirth}
          reset={() => send({ type: "RESTART" })}
        />
      )}
    </div>
  );
};

export default XstateMultiStepForm;
