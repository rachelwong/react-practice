import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";

interface EventReviewStepProps {
  onReset: () => void;
}

const EventReviewStep = ({ onReset }: EventReviewStepProps) => {
  return (
    <Card className="p-6">
      <CardTitle>Event created successfully!</CardTitle>
      <CardContent>
        <p>Your event has been created. Below are its details:</p>
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
