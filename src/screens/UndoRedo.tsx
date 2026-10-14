import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import UndoRedoField from "@/components/UndoRedoField";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import useTrackHistory from "@/hooks/useTrackHistory";
import { ArrowBigUp, Command, RotateCcw, RotateCw } from "lucide-react";
import { useState } from "react";

const UndoRedo = () => {
  const {
    state,
    addItem,
    deleteItem,
    toggleStatus,
    toggleEditStatus,
    updateItemValue,
    undoCount,
    redoCount,
    redo,
    undo,
  } = useTrackHistory();

  const [newItem, setItemValue] = useState<string>("");

  useKeyboardShortcuts("Z", () => {
    undo();
  });

  useKeyboardShortcuts(["Shift", "Z"], () => {
    redo(); // this could be wrapped in useCallback but will require rewriting useKeyboardShortcuts
  });

  return (
    <ScreenLayout
      title="Undo/Redo"
      brief="https://www.reactchallenges.com/challenges/undo-redo"
      description="To-do list whose add, edit, toggle, and delete actions are tracked in a useReducer past/present/future history. This version does not prioritise performance. "
    >
      <div className="mx-auto max-w-4xl h-auto">
        <div className="flex flex-col w-full h-auto gap-y-3">
          <div className="w-full h-auto flex flex-row gap-x-6 items-center justify-start">
            <Button
              disabled={!undoCount}
              onClick={() => {
                undo();
              }}
            >
              <RotateCcw />
              Undo ({JSON.stringify(undoCount)})
            </Button>
            <Button
              disabled={!redoCount}
              onClick={() => {
                redo();
              }}
            >
              <RotateCw />
              Redo ({JSON.stringify(redoCount)})
            </Button>
          </div>
          <div className="w-full flex flex-row gap-x-6 items-center justify-between">
            <Input
              placeholder="Add text"
              value={newItem}
              onChange={(e) => {
                setItemValue(e.target.value);
              }}
            />
            <Button
              size="lg"
              onClick={() => {
                addItem(newItem);
                setItemValue(""); //reset
              }}
            >
              Add
            </Button>
          </div>
          {state.present.map((item) => {
            return (
              <Card key={item.id}>
                <CardContent className="flex flex-row items-center justify-between">
                  <CardDescription
                    className={item.status ? "line-through" : ""}
                  >
                    <UndoRedoField
                      item={item}
                      onToggleEdit={toggleEditStatus}
                      onUpdate={updateItemValue}
                    />
                  </CardDescription>
                  <CardAction className="flex flex-row items-center justify-end gap-x-6">
                    <Checkbox
                      className="h-6 w-6"
                      checked={item.status}
                      onCheckedChange={() => {
                        toggleStatus(item.id);
                      }}
                    />
                    <Button
                      onClick={() => {
                        deleteItem(item.id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardAction>
                </CardContent>
              </Card>
            );
          })}
          <div className="">
            <p className="text-lg text-slate-700 font-extrabold mb-4">
              Keyboard shortcuts:{" "}
            </p>
            <ul className="flex flex-col gap-y-4">
              <li className="flex flex-row items-center justify-start w-full gap-x-6">
                <p>Undo: </p>{" "}
                <div className="flex flex-row items-center justify-start gap-x-4">
                  <Command /> <p>+</p> <Card className="py-2 px-3 m-0">Z</Card>
                </div>
              </li>
              <li className="flex flex-row items-center justify-start w-full gap-x-6">
                <p>Redo: </p>
                <div className="flex flex-row items-center justify-start gap-x-4">
                  <ArrowBigUp /> <p>+</p> <Command /> <p>+</p>
                  <Card className="py-2 px-3 m-0">Z</Card>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default UndoRedo;
