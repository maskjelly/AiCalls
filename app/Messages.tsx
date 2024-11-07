import React from 'react';
import { useVoice } from "@humeai/voice-react";

const Messages = () => {
  const { messages } = useVoice();
  
  return (
    <div className="flex flex-col space-y-2 p-4 bg-zinc-900">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          const isUser = msg.type === "user_message";
          return (
            <div 
              key={msg.type + index}
              className={`
                relative 
                border-l-4 
                p-4 
                ${isUser 
                  ? 'bg-zinc-800 border-l-green-500' 
                  : 'bg-zinc-800 border-l-red-500'
                }
              `}
            >
              {/* Industrial accent line */}
              <div className={`
                absolute top-0 right-0 h-1 w-16
                ${isUser ? 'bg-green-500' : 'bg-red-500'}
              `}/>
              
              {/* Role indicator */}
              <div className="font-mono text-xs tracking-wider uppercase mb-2 text-zinc-400">
                {msg.message.role === 'user' ? 'User' : 'Assistant'}
              </div>
              
              {/* Message content */}
              <div className={`
                font-mono 
                ${isUser ? 'text-green-200' : 'text-red-200'}
              `}>
                {msg.message.content}
              </div>
              
              {/* Industrial corner accent */}
              <div className={`
                absolute bottom-0 right-0 
                w-4 h-4 
                border-r-2 border-b-2
                ${isUser 
                  ? 'border-green-500/30' 
                  : 'border-red-500/30'
                }
              `}/>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Messages;