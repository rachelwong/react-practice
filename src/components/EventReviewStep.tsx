import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import type {
  OnlineEventDataType,
  PhysicalEventDataType,
} from "@/schema/eventSchema";

interface EventReviewStepProps {
  onReset: () => void;
  state: OnlineEventDataType | PhysicalEventDataType;
}

const EventReviewStep = ({ onReset, state }: EventReviewStepProps) => {
  return (
    <Card className="p-6">
      <CardTitle>Event created successfully!</CardTitle>
      <CardContent>
        <p>Your event has been created. Below are its details:</p>
        {Object.entries(state).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-row justify-between items-center w-full py-2 px-3"
          >
            <span className="basis-1/3">{key}</span>
            <span className="basis-2/3">
              {value instanceof Date
                ? value.toLocaleDateString("en-AU")
                : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </CardContent>
      <CardAction className="flex flex-row justify-center items-center w-full">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            onReset();
          }}
        >
          Start again
        </Button>
      </CardAction>
    </Card>
  );
};

export default EventReviewStep;
