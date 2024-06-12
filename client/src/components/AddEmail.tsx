import { useUserEvents } from "@/hooks/useUserEvents";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getUserInfoFromLS, setUserInfoInLS } from "@/lib/localstorage";
import { FormEventHandler, useState } from "react";
import { toast } from "./ui/use-toast";

const AddEmail = ({ refetchEvents }: { refetchEvents: () => void }) => {
  const [lsUserEmail, setLsUserEmail] = useState<string>(
    getUserInfoFromLS().email
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const email = (e.target as HTMLFormElement).userEmail.value as string;
    setUserInfoInLS((prev) => ({
      email,
      name: "",
      timezone: prev.timezone,
      country: prev.country,
    }));
    setLsUserEmail(email);

    (e.target as HTMLFormElement).reset();
    refetchEvents();

    toast({
      title: "Success",
      description: "Email added successfully.",
      variant: "default",
    });
  };

  const handleEmailDelete = () => {
    setUserInfoInLS((prev) => ({
      email: "",
      name: "",
      timezone: prev.timezone,
      country: prev.country,
    }));
    setLsUserEmail("");
    toast({
      title: "Success",
      description: "Email deleted successfully. You can add a new email now.",
      variant: "default",
    });
  };

  return (
    <div className="mt-10 p-2 py-4 bg-gray-100 rounded-md">
      {lsUserEmail ? (
        <>
          <h3 className="text-lg">
            You can see all your events and add new events in the calendar by
            clicking on a day.
          </h3>
          <p className="italic text-gray-700 mt-2">Your email: {lsUserEmail}</p>

          <Button className="mt-4" onClick={() => handleEmailDelete()}>
            Delete your email
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-lg">Firstly, let&apos;s add your email.</h2>
          <p className="mt-4">
            Enter your email to start adding events and see all your events in
            the calendar.
          </p>
          <form onSubmit={handleSubmit} className="mt-3">
            <Input
              type="email"
              placeholder="joe@example.com"
              required
              parentClassName="w-96"
              name="userEmail"
            />
            <Button className="mt-2">Add your email</Button>
          </form>
        </>
      )}
    </div>
  );
};

export { AddEmail };
