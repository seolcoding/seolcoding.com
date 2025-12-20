import React, { useState } from "react";
import { Button } from "@mini-apps/ui";
import { Card } from "@mini-apps/ui";
import { Input } from "@mini-apps/ui";
import { Trash2, Edit2, Check, X } from "lucide-react";
import type { WheelItem } from "@/types";

interface ItemListProps {
  items: WheelItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
  disabled?: boolean;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onRemove,
  onUpdate,
  disabled,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (item: WheelItem) => {
    setEditingId(item.id);
    setEditValue(item.label);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdate(id, editValue.trim());
    }
    cancelEdit();
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="p-3">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            {editingId === item.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  maxLength={50}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(item.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => saveEdit(item.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(item)}
                  disabled={disabled}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
