import { useMultiStepForm } from "@/context/MultiStepFormContext";

const ReviewStep = () => {
  const {
    state: { formData },
  } = useMultiStepForm();
  const { name, email, gender, dateOfBirth } = formData;
  return (
    <div className="flex flex-col gap-y-4 bg-green-100">
      <h2 className="font-extrabold text-slate-900 text-lg">
        Review your details
      </h2>
      <ul className="flex flex-col gap-y-3 text-left">
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>Gender: {gender || "--"}</li>
        <li>
          Date of Birth:{" "}
          {`${dateOfBirth.day}/${dateOfBirth.month}/${dateOfBirth.year}`}
        </li>
      </ul>
    </div>
  );
};

export default ReviewStep;
