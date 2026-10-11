import type { Item } from "@/hooks/useTrackHistory";
import { useState } from "react";
import { Input } from "./ui/input";

interface UndoRedoField {
  item: Item;
  onToggleEdit: (id: string) => void;
  onUpdate: (id: string, val: string) => void;
}

const UndoRedoField = ({ item, onToggleEdit, onUpdate }: UndoRedoField) => {
  const [itemValue, setItemValue] = useState<string>(item.value ?? "");

  return (
    <div className="w-full h-full flex-col items-center justify-start">
      {!item.isEdit ? (
        <button className="text-lg" onClick={() => onToggleEdit(item.id)}>
          {item.value}
        </button>
      ) : (
        <Input
          value={itemValue}
          onChange={(e) => {
            setItemValue(e.target.value);
          }}
          onBlur={() => {
            onToggleEdit(item.id);
            onUpdate(item.id, itemValue);
          }}
        />
      )}
    </div>
  );
};

export default UndoRedoField;
