import React, { useState } from "react";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";
export default function Exchange() {
  const [newGreeting, setNewGreeting] = useState("");
  const { greeting, updateGreeting } = useExchange();

  return (
    <div className="mt-2">
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
        Greeting from contract:{" "}
      </div>{" "}
      <h3>{greeting}</h3>
      <InputField
        value={newGreeting}
        placeholder="new greeting"
        onChange={(e) => setNewGreeting(e.target.value)}
      />
      <br />
      <Button onClick={() => updateGreeting(newGreeting)}>
        Update Greeting
      </Button>
    </div>
  );
}
