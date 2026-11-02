import EventBaseStep from "@/components/EventBaseStep";
import EventReviewStep from "@/components/EventReviewStep";
import OnlineEventStep from "@/components/OnlineEventStep";
import PhysicalEventStep from "@/components/PhysicalEventStep";
import ScreenLayout from "@/components/ScreenLayout";
import useEventWizard from "@/hooks/useEventWizard";
import {
  fullOnlineEventDataSchema,
  fullPhysicalEventDataSchema,
} from "@/schema/eventSchema";
import { EVENT_STEP } from "@/types/Events";

// make country a typeable select list with fuzzy search
const EventsWizard = () => {
  const {
    state,
    baseStepActionReducer,
    onlineStepActionReducer,
    physicalStepActionReducer,
    goBack,
    resetWizard,
  } = useEventWizard();
  const { base, online, physical, step } = state;

  const finalEventData = base.onlineEvent
    ? fullOnlineEventDataSchema.safeParse({ ...base, ...online })
    : fullPhysicalEventDataSchema.safeParse({ ...base, ...physical });

  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/event-creation-wizard"
      title="Events Creation Wizard"
    >
      {step === EVENT_STEP.BASE && (
        <EventBaseStep formData={base} reducerAction={baseStepActionReducer} />
      )}
      {step === EVENT_STEP.ONLINE && (
        <OnlineEventStep
          formData={online}
          reducerAction={onlineStepActionReducer}
          onBack={goBack}
        />
      )}
      {step === EVENT_STEP.PHYSICAL && (
        <PhysicalEventStep
          reducerAction={physicalStepActionReducer}
          formData={physical}
          onBack={goBack}
        />
      )}
      {step === EVENT_STEP.REVIEW && finalEventData.success && (
        <EventReviewStep onReset={resetWizard} state={finalEventData?.data} />
      )}
    </ScreenLayout>
  );
};

export default EventsWizard;
