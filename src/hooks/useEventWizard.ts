import type { EventBaseFormState } from "@/components/EventBaseStep";
import type { OnlineEventFormState } from "@/components/OnlineEventStep";
import type { PhysicalEventFormState } from "@/components/PhysicalEventStep";
import {
  baseEventStep1Schema,
  makePhysicalEventStep2Schema,
  onlineEventStep2Schema,
  physicalEventStep2Schema,
  type CreateEventStepType,
  type OnlineEventStepType,
  type PhysicalEventStepType,
} from "@/schema/eventSchema";
import { EVENT_STEP, type EventStepType } from "@/types/Events";
import { useEffect, useState } from "react";
import z from "zod";

const initialBase: CreateEventStepType = {
  name: "",
  description: "",
  eventType: null,
  onlineEvent: false,
};

const initialOnline: OnlineEventStepType = {
  startDate: null,
  endDate: null,
  requireRegistration: false,
  email: "",
};

const initialPhysical: PhysicalEventStepType = {
  startDate: null,
  endDate: null,
  country: "",
  city: "",
  postCode: "",
  address: "",
};

const useEventWizard = () => {
  const [base, setBase] = useState<CreateEventStepType>(initialBase);
  const [online, setOnline] = useState<OnlineEventStepType>(initialOnline);
  const [physical, setPhysical] =
    useState<PhysicalEventStepType>(initialPhysical);
  const [step, setStep] = useState<EventStepType>(EVENT_STEP.BASE);
  const [countries, setCountries] = useState<string[]>([]);

  const state = {
    base,
    online,
    physical,
    step,
  };

  const goBack = () => {
    switch (step) {
      case EVENT_STEP.REVIEW:
        if (base.onlineEvent) {
          setStep(EVENT_STEP.ONLINE);
        } else {
          setStep(EVENT_STEP.PHYSICAL);
        }
        break;
      case EVENT_STEP.ONLINE:
      case EVENT_STEP.PHYSICAL:
      case EVENT_STEP.BASE:
      default: {
        setStep(EVENT_STEP.BASE);
        break;
      }
    }
  };

  // onNext
  const submitBaseFormData = (formData: CreateEventStepType): void => {
    setBase({ ...formData });
    if (formData.onlineEvent) {
      setStep(EVENT_STEP.ONLINE);
    } else {
      setStep(EVENT_STEP.PHYSICAL);
    }
  };

  const submitOnlineFormData = (formData: OnlineEventStepType): void => {
    setOnline({ ...formData });
    setStep(EVENT_STEP.REVIEW);
  };

  const submitPhysicalFormData = (formData: PhysicalEventStepType) => {
    setPhysical({ ...formData });
    setStep(EVENT_STEP.REVIEW);
  };

  const resetWizard = () => {
    setStep(EVENT_STEP.BASE);
    setBase(initialBase);
    setPhysical(initialPhysical);
    setOnline(initialOnline);
  };

  const physicalStepActionReducer = async (
    prevState: PhysicalEventFormState,
    formData: FormData,
  ): Promise<PhysicalEventFormState> => {
    // pick up data from formData
    // convert to onlinestepdata type
    const rawStartDate = formData.get("startDate")?.toString() ?? "";
    const rawEndDate = formData.get("endDate")?.toString() ?? "";
    const country = formData.get("country")?.toString() ?? "";
    const city = formData.get("city")?.toString() ?? "";
    const postCode = formData.get("postCode")?.toString() ?? "";
    const address = formData.get("address")?.toString() ?? "";

    const startDate = rawStartDate === "" ? null : new Date(rawStartDate);
    const endDate = rawEndDate === "" ? null : new Date(rawEndDate);

    const physicalFormData: PhysicalEventStepType = {
      startDate,
      endDate,
      country,
      city,
      postCode,
      address,
    };
    // artificial sleep to mock api response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const physicalEventValidSchema = makePhysicalEventStep2Schema(countries);

    let result;

    if (countries && !!countries.length) {
      result = physicalEventValidSchema.safeParse(physicalFormData);
    } else {
      // safeParse it
      result = physicalEventStep2Schema.safeParse(physicalFormData);
    }

    if (!result.success) {
      // transform errors
      const { fieldErrors } = z.flattenError(result.error);

      return {
        physicalFormData: result.data!,
        errors: {
          startDate: fieldErrors.startDate?.toString() ?? "",
          endDate: fieldErrors.endDate?.toString() ?? "",
          city: fieldErrors.city?.toString() ?? "",
          postCode: fieldErrors.postCode?.toString() ?? "",
          country: fieldErrors.country?.toString() ?? "",
          address: fieldErrors.address?.toString() ?? "",
        },
      };
    }

    if (!result.data) {
      return prevState;
    }

    submitPhysicalFormData(result.data!);
    // submit form
    return {
      physicalFormData: result.data!,
      errors: {},
    };
  };

  const onlineStepActionReducer = async (
    prevState: OnlineEventFormState,
    formData: FormData,
  ): Promise<OnlineEventFormState> => {
    // pick up data from formData
    // convert to onlinestepdata type
    const rawStartDate = formData.get("startDate")?.toString() ?? "";
    const rawEndDate = formData.get("endDate")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const requireRegistration = formData.has("requireRegistration");

    const startDate = rawStartDate === "" ? null : new Date(rawStartDate);
    const endDate = rawEndDate === "" ? null : new Date(rawEndDate);

    const onlineFormData: OnlineEventStepType = {
      startDate,
      endDate,
      email,
      requireRegistration,
    };
    // artificial sleep to mock api response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // safeParse it
    const result = onlineEventStep2Schema.safeParse(onlineFormData);

    if (!result.success) {
      // transform errors
      const { fieldErrors } = z.flattenError(result.error);

      return {
        onlineFormData: result.data!,
        errors: {
          startDate: fieldErrors.startDate?.toString() ?? "",
          endDate: fieldErrors.endDate?.toString() ?? "",
          email: fieldErrors.email?.toString() ?? "",
        },
      };
    }

    if (!result.data) {
      return prevState;
    }

    submitOnlineFormData(result.data!);
    // submit form
    return {
      onlineFormData: result.data!,
      errors: {},
    };
  };

  const baseStepActionReducer = async (
    prevState: EventBaseFormState,
    formData: FormData,
  ): Promise<EventBaseFormState> => {
    // manually set formData into the EventBaseStepDataType
    // and pass it back down

    const name = formData.get("name")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const eventType = formData.get("eventType")?.toString() ?? "";
    const onlineEvent = formData.has("onlineEvent");

    const baseFormData = {
      name,
      description,
      eventType,
      onlineEvent,
    };

    // Simulate a network delay (e.g., API call or Server Action)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = baseEventStep1Schema.safeParse(baseFormData);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      return {
        baseFormData: result.data!,
        errors: {
          // TODO Check how validation errors come through
          name: fieldErrors["name"]?.toString(),
          description: fieldErrors["description"]?.toString(),
          eventType: fieldErrors["eventType"]?.toString(),
        },
      };
    }

    // unlikely catch
    if (result.data === undefined) {
      return prevState;
    }

    submitBaseFormData(result.data!);
    return { baseFormData: result.data!, errors: {} };
  };

  const getCountryData = async () => {
    // TODO can be replaced with 3x rest countries api calls
    const response = await fetch(`/AllCountries.json`)
      .then((res) => res.json())
      .then((res) => res.data);
    setCountries(response);
  };

  useEffect(() => {
    getCountryData();
  }, []);

  return {
    state,
    countries,
    goBack,
    baseStepActionReducer,
    onlineStepActionReducer,
    physicalStepActionReducer,
    resetWizard,
  };
};

export default useEventWizard;
