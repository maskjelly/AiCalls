import React, { useEffect, useRef, useState } from "react";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { InitialMic } from "./components/InitialMic";

function SimpleWaveAnimation({ isActive, color }: { isActive: boolean; color: string }) {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-12">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${color}`}
          animate={{
            height: ['12px', '24px', '12px'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const { toast } = useToast();
  const prevMessageLength = useRef(0);
  const [isFirstTime, setIsFirstTime] = useState(true);

  /*
  Message detection logic:
  - Tracks new messages and updates speaking states
  - AI speaking: Shows when AI is generating response
  - User speaking: Shows when user is providing input
  - Handles end states to properly stop animations
  */
  useEffect(() => {
    if (messages.length > prevMessageLength.current) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === 'assistant_message') {
        setIsAISpeaking(true);
        setIsUserSpeaking(false);
      } else if (lastMessage.type === 'user_message') {
        setIsUserSpeaking(true);
        setIsAISpeaking(false);
      } else if (lastMessage.type === 'assistant_end') {
        setIsAISpeaking(false);
      }
    }
    prevMessageLength.current = messages.length;
  }, [messages]);

  // Auto-disable speaking states when disconnected
  useEffect(() => {
    if (readyState !== VoiceReadyState.OPEN) {
      setIsAISpeaking(false);
      setIsUserSpeaking(false);
    }
  }, [readyState]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: "Connected successfully",
        description: "Voice session has started",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start voice session",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsAISpeaking(false);
    setIsUserSpeaking(false);
    toast({
      title: "Session ended",
      description: "Voice session has been terminated",
      duration: 3000,
    });
  };

  const getStatusColor = () => {
    switch (readyState) {
      case VoiceReadyState.OPEN:
        return "bg-emerald-500";
      case VoiceReadyState.CONNECTING:
        return "bg-amber-500";
      default:
        return "bg-red-500";
    }
  };

  const handleInitialStart = async () => {
    setIsFirstTime(false);
    await handleConnect();
  };

  if (isFirstTime) {
    return <InitialMic isFirstTime={isFirstTime} onStart={handleInitialStart} />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-t from-black to-transparent h-24 sm:h-32 pointer-events-none" />
      
      <div className="relative bg-black/90 backdrop-blur-lg border-t border-white/10">
        {/* Center Animation Container */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm p-4 rounded-full border border-white/10">
          <SimpleWaveAnimation 
            isActive={readyState === VoiceReadyState.OPEN && (isAISpeaking || isUserSpeaking)} 
            color={isAISpeaking ? 'bg-red-500' : 'bg-blue-500'} 
          />
        </div>

        {/* Bottom Controls Container */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-2 p-3 sm:p-4">
          {/* Status Indicator - Left Half */}
          <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-white/5 border border-white/10">
            <div className={`
              w-2 h-2 rounded-full ${getStatusColor()}
              ${readyState === VoiceReadyState.OPEN && 'animate-pulse'}
            `} />
            <span className="text-xs sm:text-sm text-white/70">
              {readyState === VoiceReadyState.OPEN && (
                isAISpeaking ? "AI Speaking" : isUserSpeaking ? "Listening..." : "Connected"
              )}
              {readyState === VoiceReadyState.CONNECTING && "Connecting"}
              {readyState === VoiceReadyState.CLOSED && "Disconnected"}
            </span>
          </div>

          {/* Control Button - Right Half */}
          <button
            onClick={readyState === VoiceReadyState.OPEN ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            className={`
              px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-light tracking-wide
              backdrop-blur-sm transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base
              ${readyState === VoiceReadyState.OPEN 
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
              }
            `}
          >
            {readyState === VoiceReadyState.OPEN ? (
              <span>End Session</span>
            ) : (
              <span>{isConnecting ? 'Connecting...' : 'Start Session'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
