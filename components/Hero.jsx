"use client";

import { useMessages } from "@/context/MessagesContext";
import { useUser } from "@/context/UserContext";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import { useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { messages, setMessages } = useMessages();
  const { user, setUser } = useUser();
  const createWorkspace = useMutation(api.workspace.CreateWorkspace);
  const navigate = useRouter();

  function closeDialog() {
    setOpenDialog(false);
  }

  async function onGenerate(input) {
    if (!user.name) {
      setOpenDialog(true);
      return;
    }

    const newMessage = {
      role: "user",
      content: input,
    };

    setMessages(newMessage);

    const workspaceId = await createWorkspace({
      user: user._id,
      messages: [newMessage],
    });

    console.log(workspaceId);

    navigate.push(`/workspace/${workspaceId}`);
  }

  return (
    <div className={"flex flex-col items-center mt-36 xl:mt-52 gap-2"}>
      <h2 className={"font-bold text-4xl antialiased"}>
        {Lookup.HERO_HEADING}
      </h2>
      <p className={"text-gray-400 mt-3 font-medium"}>{Lookup.HERO_DESC}</p>

      <div className={"p-5 border rounded-xl max-w-xl w-full mt-10"}>
        <div className={"flex gap-3"}>
          <textarea
            onChange={(e) => setUserInput(e.target.value)}
            className={
              "outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            }
            placeholder={Lookup.INPUT_PLACEHOLDER}
          />
          {userInput.trim() && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className={"bg-blue-500 p-2 size-10 rounded-md cursor-pointer"}
            />
          )}
        </div>

        <div>
          <Link className={"size-5"} />
        </div>
      </div>

      <div
        className={
          "flex flex-wrap mt-8 max-w-2xl items-center justify-center gap-3"
        }
      >
        {Lookup.SUGGESTIONS.map((s, i) => {
          return (
            <h2
              onClick={() => onGenerate(s)}
              key={i}
              className={
                "p-1 px-2 border rounded-full text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              }
            >
              {s}
            </h2>
          );
        })}
      </div>

      <SignInDialog openDialog={openDialog} closeDialog={closeDialog} />
    </div>
  );
}

export default Hero;
