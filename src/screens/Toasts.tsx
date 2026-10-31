import ScreenLayout from "@/components/ScreenLayout";
import ToastItem from "@/components/ToastItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOAST_TYPE, useToasts } from "@/context/ToastsContext";
import { useState } from "react";

const Toasts = () => {
  const { toasts, addToast, deleteToast, clearAll, createCustomToast } =
    useToasts();
  const [customToast, setCustomToast] = useState<string>("");

  const handleCustomToast = () => {
    createCustomToast(customToast);
    setCustomToast("");
  };

  return (
    <ScreenLayout
      title="Toasts"
      brief="https://www.reactchallenges.com/challenges/toast-notifications"
      className="relative"
    >
      <div className="toasts-viewport relative border-1 w-full h-full border-red-800 flex flex-col items-stretch justify-start gap-y-6">
        {!!toasts && !!toasts.length && (
          <div className="absolute toasts-list w-full right-0 top-0 gap-y-3 max-w-md z-10">
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toastItem={toast}
                // not () => {} as that would be a new function on every render
                onDelete={deleteToast}
              />
            ))}
          </div>
        )}
        <h3 className="font-extrabold text-4xl">Quick toasts</h3>
        <div className="flex flex-row items-center justify-start w-full h-auto gap-x-6">
          <Button
            className="bg-green-700 text-white"
            onClick={() => {
              addToast({
                type: TOAST_TYPE.SUCCESS,
                message: "Settings saved successfully",
              });
            }}
            size="lg"
          >
            Success
          </Button>
          <Button
            className="bg-red-700 text-white"
            onClick={() => {
              addToast({
                type: TOAST_TYPE.ERROR,
                message: "Something went wrong, try again",
              });
            }}
            size="lg"
          >
            Error
          </Button>
          <Button
            className="bg-sky-700 text-white"
            onClick={() => {
              addToast({
                type: TOAST_TYPE.INFO,
                message: "You have 3 new notifications.",
              });
            }}
            size="lg"
          >
            Info
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-6">
          <Input
            placeholder="custom toast message"
            value={customToast}
            onChange={(e) => {
              setCustomToast(e.target.value);
            }}
          />
          <Button
            size="lg"
            onClick={() => {
              handleCustomToast();
            }}
          >
            Notify
          </Button>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-4">
          <h3>Manage</h3>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              clearAll();
            }}
          >
            Clear all toasts
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default Toasts;
