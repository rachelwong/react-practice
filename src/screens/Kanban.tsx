import ScreenLayout from "@/components/ScreenLayout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type DragEvent, type KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";

const ZONES = {
  TODO: "TODO",
  PROGRESS: "PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

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
} as const;

const DELETE_ZONE = "DELETE" as const;

type AllZoneType = typeof DELETE_ZONE | (typeof ZONES)[keyof typeof ZONES];

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
  const [columnHoverZone, setColumnHoverZone] = useState<AllZoneType | null>(
    null,
  );
  const [ticketHoverZone, setTicketHoverZone] = useState<string | null>(null);

  const resetDragState = () => {
    setCurrTicket(null);
    setColumnHoverZone(null);
    setTicketHoverZone(null);
  };

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
    if (!currTicket) {
      return;
    }
    if (zoneId === DELETE_ZONE) {
      setTickets((prev) => [...prev.filter((x) => x.id !== currTicket.id)]);
    } else {
      setTickets((prev) => {
        return [
          ...prev.filter((x) => x.id !== currTicket.id),
          { ...currTicket, zone: zoneId },
        ];
      });
    }
    resetDragState();
  };

  const handleDragEnter = (zoneId: AllZoneType) => {
    setColumnHoverZone(zoneId);
  };

  // cancel browser block on dnd
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // fires every time the cursor moves from the column onto a ticket inside it
  const handleDragLeave = (
    e: DragEvent<HTMLDivElement>,
    zoneId: AllZoneType,
  ) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    // Only clear the highlight if it still belongs to the zone being left:
    setColumnHoverZone((prev) => (prev === zoneId ? null : prev));
  };

  // fires when dragging completes -> reset
  // need this even if you don't drag a ticket into a drop zone
  const handleDragEnd = () => {
    resetDragState();
  };

  const handleTicketDragEnter = (targetTicketId: string) => {
    if (currTicket?.id === targetTicketId) {
      return; // hovering over the ticket we're holding
    }

    setTicketHoverZone(targetTicketId);
  };

  const handleTicketDragOver = (e: DragEvent<HTMLDivElement>) => {
    // detect cursor position over targetTicketId
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTicketDragLeave = (
    e: DragEvent<HTMLDivElement>,
    targetTicketId: string,
  ) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    // Only clear the highlight on target ticket if still dragging over it:
    setTicketHoverZone((prev) =>
      !!prev && prev === targetTicketId ? null : prev,
    );
  };

  const handleTicketDrop = (
    e: DragEvent<HTMLDivElement>,
    targetTicketId: string,
  ) => {
    // stop the drag event being detected at the column level
    e.stopPropagation();

    const targetTicket = tickets.find((x) => x.id === targetTicketId);

    // no dragging occuring, dropped on itself
    if (!currTicket || !targetTicket || currTicket.id === targetTicketId) {
      resetDragState();
      return;
    }

    // detect cursor position over target ticket
    // upper half of ticket then order before it
    // lower half of ticket then order after it
    const currentRect = e.currentTarget.getBoundingClientRect();
    const cursorYPos = e.clientY - currentRect.top;
    const totalHeight = currentRect.height;

    // needs to find the index of the target
    // without considering the currently dragged ticket
    // in order to calculate a new order for tickets
    const targetTicketIndex = tickets
      .filter((x) => x.id !== currTicket.id)
      .findIndex((x) => x.id === targetTicketId);

    if (targetTicketIndex === -1) {
      resetDragState();
      return;
    }

    let updatedTickets: Ticket[] = [];

    if (cursorYPos < totalHeight / 2) {
      // upper half -> order above it
      // immutable copy
      updatedTickets = [
        ...tickets
          .filter((x) => x.id !== currTicket.id)
          .slice(0, targetTicketIndex), // Elements before the index
        { ...currTicket, zone: targetTicket.zone }, // dragged ticket takes same column as the target ticket being dragged over
        ...tickets
          .filter((x) => x.id !== currTicket.id)
          .slice(targetTicketIndex), // Elements from the index to the end
      ];
    } else {
      // lower half -> order below it
      updatedTickets = [
        ...tickets
          .filter((x) => x.id !== currTicket.id)
          .slice(0, targetTicketIndex + 1), // Elements after the index
        { ...currTicket, zone: targetTicket.zone }, // dragged ticket takes same column as the target ticket being dragged over
        ...tickets
          .filter((x) => x.id !== currTicket.id)
          .slice(targetTicketIndex + 1), // Elements from the index to the end
      ];
    }

    setTickets(updatedTickets);
    resetDragState();
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
            className={`trash-zone relative basis-1/2 rounded rounded-3xl border-3 bg-pink-100 p-10 ${columnHoverZone === DELETE_ZONE ? "border-red-700" : "border-white"}`}
          >
            <div
              className="text-center text-neutral-500"
              onDragEnter={() => {
                handleDragEnter(DELETE_ZONE);
              }}
              onDragOver={(e) => {
                handleDragOver(e);
              }}
              onDragLeave={(e) => {
                handleDragLeave(e, DELETE_ZONE);
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
                className={`board-zone flex h-dvh w-full basis-1/3 flex-col items-start justify-start gap-y-6 overflow-y-scroll p-6 ${columnHoverZone === zone ? "bg-sky-100" : ZONE_CONFIG[zone].colour}`}
                onDragEnter={() => {
                  handleDragEnter(zone);
                }}
                onDragOver={(e) => {
                  handleDragOver(e);
                }}
                onDragLeave={(e) => {
                  handleDragLeave(e, zone);
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
                      className={`w-full border-1 p-5 ${!!ticketHoverZone && ticketHoverZone === ticket.id ? "bg-purple-200 border-purple-600" : "bg-white border-neutral-600"}`}
                      draggable
                      onDragEnd={() => handleDragEnd()}
                      onDragStart={() => {
                        handleDragStart(ticket);
                      }}
                      // make ticket a drop zone as well
                      onDragEnter={() => {
                        handleTicketDragEnter(ticket.id);
                      }}
                      onDragOver={(e) => {
                        handleTicketDragOver(e);
                      }}
                      onDragLeave={(e) => {
                        handleTicketDragLeave(e, ticket.id);
                      }}
                      onDrop={(e) => {
                        handleTicketDrop(e, ticket.id);
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
