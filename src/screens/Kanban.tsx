import ScreenLayout from "@/components/ScreenLayout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type DragEvent, type KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";

const ZONES = {
  TODO: "TODO",
  PROGRESS: "PROGRESS",
  COMPLETED: "COMPLETED",
};

type ZoneKey = keyof typeof ZONES;

const ZONE_CONFIG = {
  [ZONES.TODO]: {
    colour: "bg-neutral-100",
  },
  [ZONES.PROGRESS]: {
    colour: "bg-amber-100",
  },
  [ZONES.COMPLETED]: {
    colour: "bg-green-100",
  },
};

const DELETE_ZONE = "DELETE";

type AllZoneType = (typeof DELETE_ZONE)[keyof typeof DELETE_ZONE] &
  (typeof ZONES)[keyof typeof ZONES];

interface Ticket {
  id: string;
  description: string;
  zone: (typeof ZONES)[keyof typeof ZONES];
}

const initialState = {
  id: "",
  description: "",
  zone: ZONES.TODO,
};

const Kanban = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currTicket, setCurrTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState<Ticket>(initialState);
  const [hoverZone, setHoverZone] = useState<AllZoneType | null>(null);

  const handleAddTicket = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!newTicket.description) {
      return;
    }

    if (e.key === "Enter" && !!newTicket.description) {
      setTickets((prev) => [...prev, { ...newTicket, id: uuidv4() }]);
      setNewTicket(initialState);
    }
  };

  const handleDragStart = (ticket: Ticket) => {
    setCurrTicket(ticket);
  };

  const handleDrop = (zoneId: AllZoneType) => {
    setHoverZone(null);
    if (!currTicket) {
      return;
    }
    if (zoneId === DELETE_ZONE) {
      setTickets((prev) => [...prev.filter((x) => x.id !== currTicket.id)]);
    } else {
      // TODO look at ordering
      setTickets((prev) => {
        return [
          ...prev.filter((x) => x.id !== currTicket.id),
          { ...currTicket, zone: zoneId },
        ];
      });
    }
    setCurrTicket(null);
  };

  const handleDragEnter = (zoneId: AllZoneType) => {
    setHoverZone(zoneId);
  };

  // cancel browser block on dnd
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    setHoverZone(null);
  };

  return (
    <ScreenLayout
      title="Kanban board"
      brief="https://www.reactchallenges.com/challenges/kanban-board"
      description="No drag and drop libraries assist"
    >
      <div className="mx-auto flex h-auto w-full max-w-5xl flex-col items-start justify-start gap-y-6">
        <div className="controls flex w-full flex-row items-stretch justify-between gap-x-10 gap-y-10 border-1 border-neutral-900 p-10">
          <div className="add-ticket item-start flex basis-1/2 flex-col justify-center gap-y-4">
            <Field>
              <FieldLabel>Add ticket</FieldLabel>
              <Input
                placeholder="Press enter to save"
                onChange={(e) =>
                  setNewTicket((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
                value={newTicket.description}
                onKeyDown={(e) => {
                  handleAddTicket(e);
                }}
              />
            </Field>
          </div>
          <div
            className={`trash-zone relative basis-1/2 rounded rounded-3xl border-3 bg-pink-100 p-10 ${hoverZone === DELETE_ZONE ? "border-red-700" : "border-white"}`}
          >
            <div
              className="text-center text-neutral-500"
              onDragEnter={() => {
                handleDragEnter(DELETE_ZONE);
              }}
              onDragOver={(e) => {
                handleDragOver(e);
              }}
              onDragLeave={() => {
                handleDragLeave();
              }}
              onDrop={() => {
                handleDrop(DELETE_ZONE);
              }}
            >
              Drag here to delete ticket
            </div>
          </div>
        </div>
        <div className="board flex w-full flex-row flex-nowrap items-start justify-between gap-x-6">
          {Object.values(ZONES).map((zone) => {
            return (
              <div
                key={zone}
                className={`board-zone flex h-dvh w-full basis-1/3 flex-col items-start justify-start gap-y-6 overflow-y-scroll p-6 ${hoverZone === zone ? "bg-sky-100" : ZONE_CONFIG[zone].colour}`}
                onDragEnter={() => {
                  handleDragEnter(zone);
                }}
                onDragOver={(e) => {
                  handleDragOver(e);
                }}
                onDragLeave={() => {
                  handleDragLeave();
                }}
                onDrop={() => {
                  handleDrop(zone);
                }}
              >
                <div className="board-zone-heading w-full bg-white p-3 text-center">
                  {zone}
                </div>
                {tickets
                  .filter((x) => x.zone === zone)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className="w-full border-1 border-neutral-600 bg-white p-5"
                      draggable
                      onDragStart={() => {
                        handleDragStart(ticket);
                      }}
                    >
                      {ticket.description}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default Kanban;
