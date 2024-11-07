import React, { useEffect, useRef } from 'react';
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Play, Square } from "lucide-react";

export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = () => {
    connect()
      .then(() => {
        console.log("Session started successfully");
      })
      .catch((error) => {
        console.error("Failed to start session:", error);
      });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0">
      {/* Gradient fade effect */}
      <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"/>

      {/* Control bar */}
      <div className="relative p-4 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Status Indicator */}
          <div className="font-mono text-xs text-zinc-400 flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full 
              ${readyState === VoiceReadyState.OPEN 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-red-500'
              }
            `}/>
            <span className="uppercase tracking-wider">
              {readyState === VoiceReadyState.OPEN ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Control Button */}
          {readyState === VoiceReadyState.OPEN ? (
            <button
              onClick={disconnect}
              className="
                flex items-center px-4 py-2
                bg-red-500 hover:bg-red-600
                text-zinc-900 font-mono text-sm
                uppercase tracking-wider
                transition-colors duration-200
                border border-red-400
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              "
            >
              <Square size={16} className="mr-2"/>
              End Session
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="
                flex items-center px-4 py-2
                bg-green-500 hover:bg-green-600
                text-zinc-900 font-mono text-sm
                uppercase tracking-wider
                transition-colors duration-200
                border border-green-400
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              "
            >
              <Play size={16} className="mr-2"/>
              Start Session
            </button>
          )}
        </div>
      </div>
      
      {/* Invisible element for scrolling - placed at the bottom */}
      <div ref={messagesEndRef} className="h-0"/>
    </div>
  );
}