import type accountStepMachine from "@/context/AccountStepMachine";
import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface XstateAccountStepProps {
  actorRef: ActorRefFrom<typeof accountStepMachine>;
}

const XstateAccountStep = ({ actorRef }: XstateAccountStepProps) => {
  const { context } = useSelector(actorRef, (snapshot) => snapshot);

  return (
    <div className="flex flex-col gap-y-4 w-full h-auto">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          value={context.email}
          onChange={(e) =>
            actorRef.send({ type: "ON_CHANGE_EMAIL", value: e.target.value })
          }
          onBlur={() => actorRef.send({ type: "ON_BLUR_EMAIL" })}
          placeholder="email"
        />
      </Field>
      {!!context.emailError && (
        <p className="text-bold text-xs text-red-900">{context.emailError}</p>
      )}
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          placeholder="password"
          type="text"
          value={context.password}
          onBlur={() => actorRef.send({ type: "ON_BLUR_PASSWORD" })}
          onChange={(e) => {
            actorRef.send({
              type: "ON_CHANGE_PASSWORD",
              value: e.target.value,
            });
          }}
        />

        {!!context.passwordError && (
          <FieldDescription className="text-bold text-xs text-red-900">
            {context.passwordError}
          </FieldDescription>
        )}
      </Field>
    </div>
  );
};

export default XstateAccountStep;
