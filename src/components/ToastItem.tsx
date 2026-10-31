import { TOAST_LIFE, TOAST_TYPE, type Toast } from "@/context/ToastsContext";
import classNames from "classnames";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ToastItemProps {
  toastItem: Toast;
  onDelete: (id: string) => void;
}

const ToastItem = ({ toastItem, onDelete }: ToastItemProps) => {
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    if (pause) {
      return;
    }

    const timerId = setTimeout(() => {
      onDelete(toastItem.id);
    }, TOAST_LIFE);

    return () => clearTimeout(timerId);
  }, [toastItem.id, pause, onDelete]);

  return (
    <Card
      className={classNames(
        "border-3 flex flex-row justify-between items-stretch px-4",
        {
          "border-red-500": toastItem.type === TOAST_TYPE.ERROR,
          "border-sky-500": toastItem.type === TOAST_TYPE.INFO,
          "border-green-500": toastItem.type === TOAST_TYPE.SUCCESS,
        },
      )}
      onMouseEnter={() => {
        setPause(true);
      }}
      onMouseLeave={() => {
        setPause(false);
      }}
    >
      <div className="toast-content text-wrap text-left">
        {toastItem.message}
      </div>
      <Button
        size="icon-lg"
        variant="secondary"
        aria-label="Dismiss"
        onClick={() => {
          onDelete(toastItem.id);
        }}
      >
        <X />
      </Button>
    </Card>
  );
};

export default ToastItem;
