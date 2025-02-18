"use client";

import { useMessages } from "@/context/MessagesContext";
import { useUser } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { workspaceId } = useParams();
  const { messages, setMessages } = useMessages();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const convex = useConvex();
  const updateMessages = useMutation(api.workspace.UpdateMessages);

  async function getWorkspaceData() {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId,
    });

    setMessages(result?.messages);
  }

  async function getAiResponse() {
    setIsLoading(true);

    const prompt = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt,
    });

    const aiResponse = { role: "ai", content: result.data.result };

    setMessages((prev) => [...prev, aiResponse]);

    await updateMessages({ workspaceId, messages: [...messages, aiResponse] });

    setIsLoading(false);
  }

  function onGenerate(input) {
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    setUserInput("");
  }

  useEffect(() => {
    if (!workspaceId) return;

    getWorkspaceData();
  }, [workspaceId]);

  useEffect(() => {
    if (!messages.length) return;

    const role = messages.at(-1).role;

    if (role === "user" && !isLoading) getAiResponse();
  }, [messages]);

  return (
    <div className={"relative h-[85vh] flex flex-col"}>
      <div className={"flex-1 overflow-y-scroll scrollbar-hide"}>
        {messages?.map((message, idx) => {
          return (
            <div
              key={idx}
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
              className={
                "p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
              }
            >
              {message?.role === "user" && user.picture && (
                <Image
                  src={user?.picture ?? null}
                  alt="user image"
                  width={35}
                  height={35}
                  className={"rounded-full"}
                />
              )}
              <ReactMarkdown className={"text-white"}>
                {message.content}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div
          style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          className={
            "p-3 rounded-lg mb-2 flex gap-2 items-center justify-center"
          }
        >
          <h2 className={"text-zinc-500 text-sm"}>Generating response</h2>
          <Loader className="animate-spin text-zinc-300" />
        </div>
      )}

      <div className={"p-5 border rounded-xl max-w-xl w-full mt-10"}>
        <div className={"flex gap-3"}>
          <textarea
            value={userInput}
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
    </div>
  );
}

export default ChatView;
