// toasts: Ref[]
// addToast({id: DateTime string, type: string, message; string}) // message cannot be empty. no uppper limit to message length
// clearAllToasts();
// deleteToast({id: DateTime string})
// toastLifetime 4seconds
// newest toast adds to bottom of list

import { v4 as uuidv4 } from "uuid";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export const TOAST_TYPE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
} as const;

export const TOAST_LIFE = 4000;

export type ToastType = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (newToast: Omit<Toast, "id">) => void;
  deleteToast: (id: string) => void;
  clearAll: () => void;
  createCustomToast: (message: string) => void;
}

const initialValue = {} as ToastContextType;

const ToastContext = createContext<ToastContextType>(initialValue);

const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (newToast: Omit<Toast, "id">): void => {
    const newId = uuidv4();
    setToasts((prev) => [...prev, { ...newToast, id: newId }]);
  };

  const deleteToast = useCallback((id: string): void => {
    // const selectedToast = toasts.find((x) => x.id === id);
    // if (!selectedToast) {
    //   return;
    // }
    console.log("DELETE TOAST");
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clearAll = (): void => {
    setToasts([]);
  };

  const createCustomToast = (message: string) => {
    if (!message.trim().length) {
      return;
    }

    addToast({ type: TOAST_TYPE.INFO, message });
  };

  const state = {
    toasts,
    addToast,
    deleteToast,
    clearAll,
    createCustomToast,
  };

  return (
    <ToastContext.Provider value={state}>{children}</ToastContext.Provider>
  );
};

export default ToastProvider;

export function useToasts() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error(`useToasts must be used within a ToastProvider`);
  }
  return context;
}
