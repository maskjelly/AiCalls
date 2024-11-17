"use client";
import React, { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";
import { motion } from "framer-motion";
import { Bot, User, Sparkles, Wrench } from 'lucide-react';
import { Navbar } from './components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GroupedMessage {
  type?: "user_message";
  content: string;
  timestamp: number;
}

export default function Messages() {
  const { messages } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages = messages.reduce<GroupedMessage[]>((acc, message) => {
    if (message.type === "user_message" && 'message' in message && message.message?.content) {
      acc.push({
        type: "user_message",
        content: message.message.content,
        timestamp: Date.now()
      });
    } else if (message.type === "assistant_message" && 'message' in message && message.message?.content) {
      const lastMessage = acc[acc.length - 1];
      if (lastMessage && !lastMessage.type) {
        lastMessage.content += "\n\n" + message.message.content;
      } else {
        acc.push({
          content: message.message.content,
          timestamp: Date.now()
        });
      }
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white">
      <Navbar user={null} />
      
      <div className="pt-20 sm:pt-24 pb-32 px-2 sm:px-4">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {groupedMessages.map((msg, index) => {
            const isUser = msg.type === "user_message";
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={index}
                className={`flex items-start gap-2 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-800 flex items-center justify-center border-2 border-yellow-500/20">
                    <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500/70" />
                  </div>
                )}
                
                <div className={`
                  max-w-[75%] sm:max-w-[85%] rounded-xl sm:rounded-2xl p-3 sm:p-6
                  ${isUser 
                    ? 'bg-zinc-800 border-2 border-blue-500/20' 
                    : 'bg-zinc-800/95 border-2 border-yellow-500/20'
                  }
                `}>
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-2 pb-2 sm:mb-3 sm:pb-3 border-b border-zinc-700">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span className="text-xs sm:text-sm font-medium text-yellow-500">Misti&apos;s Response</span>
                    </div>
                  )}
                  
                  <div className={`prose prose-sm sm:prose ${isUser ? 'prose-blue' : 'prose-yellow'} max-w-none prose-invert`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-800 flex items-center justify-center border-2 border-blue-500/20">
                    <User className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500/70" />
                  </div>
                )}
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
