"use client";
import React, { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";

export default function Messages() {
  const { messages } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-black/95 font-mono">
      {/* Terminal Header */}
      <div className="sticky top-0 bg-black backdrop-blur-sm border-b border-zinc-800 p-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="text-xs text-zinc-500 flex-1 text-center">
          VOICE TERMINAL v1.0
        </div>
      </div>
      <div className="h-min-full p-4 space-y-2">
        {messages.map((msg, index) => {
          if (msg.type === "user_message" || msg.type === "assistant_message") {
            const isUser = msg.type === "user_message";
            return (
              <div
                key={msg.type + index}
                className={`
                  group relative
                  rounded border-l-2 px-4 py-3
                  ${
                    isUser
                      ? "bg-green-900 border-green-500 hover:bg-zinc-900"
                      : "bg-red border-red-500 hover:bg-zinc-900"
                  }
                  transition-all duration-200 ease-out
                `}
              >
                {/* Prefix */}
                <div
                  className={`
                  font-mono text-xs mb-2 flex items-center gap-2
                  ${isUser ? "text-green-500" : "text-red-500"}
                `}
                >
                  <span className="opacity-50">{isUser ? ">" : "$"}</span>
                  {isUser ? "USER" : "SYSTEM"}
                  <span className="text-zinc-600 text-[10px]">
                    {formatTimestamp()}
                  </span>
                </div>
                {/* Message content */}
                <div
                  className={`
                  font-mono text-sm leading-relaxed
                  ${isUser ? "text-green-100" : "text-red-100"}
                  pl-4 border-l border-l-zinc-800
                `}
                >
                  {msg.message.content}
                </div>
                {/* Hover indicator */}
                <div
                  className={`
                  absolute right-2 top-3 opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  text-[10px] uppercase tracking-wider
                  ${isUser ? "text-green-500/50" : "text-red-500/50"}
                `}
                >
                  {isUser ? "input" : "output"}
                </div>
              </div>
            );
          }
          return null;
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
