import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useTrackHistory from "@/hooks/useTrackHistory";
import { RotateCcw, RotateCw } from "lucide-react";
import { useState } from "react";

const UndoRedo = () => {
  const {
    state,
    addItem,
    deleteItem,
    toggleStatus,
    undoCount,
    redoCount,
    redo,
    undo,
  } = useTrackHistory();

  const [newItem, setItemValue] = useState<string>("");

  return (
    <Layout
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
              <Card>
                <CardContent className="flex flex-row items-center justify-between">
                  <CardDescription>{item.value}</CardDescription>
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
        </div>
      </div>
    </Layout>
  );
};

export default UndoRedo;
