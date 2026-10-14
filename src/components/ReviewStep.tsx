import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";

interface ReviewStepProps {
  email: string;
  name: string;
  gender?: string;
  dateOfBirth: string;
  password: string;
  reset: () => void;
}

const ReviewStep = ({
  email,
  name,
  gender,
  dateOfBirth,
  password,
  reset,
}: ReviewStepProps) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const formattedPassword = useMemo(() => {
    return !toggle
      ? password
          .split("")
          .map((_) => "*")
          .join("")
      : password;
  }, [password, toggle]);
  return (
    <div className="flex flex-col gap-y-4 w-full h-auto ">
      <h2 className="font-extrabold text-slate-900 text-lg">
        Review your details
      </h2>
      <ul className="flex flex-col gap-y-3 text-left justify-start items-start">
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>Gender: {gender || "Not provided"}</li>
        <li>
          <span>Password: {formattedPassword}</span>
          <Button
            className="ml-4"
            variant="outline"
            size="icon"
            onClick={() => setToggle((prev) => !prev)}
          >
            {toggle ? <Eye /> : <EyeOff />}
          </Button>
        </li>
        <li>Date of Birth: {dateOfBirth}</li>
      </ul>
      <Button onClick={() => reset()}>
        <RotateCcw />
        Reset form
      </Button>
    </div>
  );
};

export default ReviewStep;
