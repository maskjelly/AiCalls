import React, { useEffect, useRef, useState } from "react";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Mic, MicOff, Loader2, WifiOff, Volume2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(75);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute bottom-full left-0 right-0 h-24 p-20" />

        <div className="relative p-4 bg-black shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-full px-3 py-1.5 transition-colors hover:bg-secondary/70 cursor-help">
                  <div
                    className={`
                    w-2 h-2 rounded-full ${getStatusColor()}
                    ${readyState === VoiceReadyState.OPEN && "animate-pulse"}
                  `}
                  />
                  <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                    {readyState === VoiceReadyState.OPEN && "Connected"}
                    {readyState === VoiceReadyState.CONNECTING && "Connecting"}
                    {readyState === VoiceReadyState.CLOSED && "Disconnected"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Current connection status</p>
              </TooltipContent>
            </Tooltip>

            {/* Control Button */}
            {readyState === VoiceReadyState.OPEN ? (
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                size="default"
                className="font-medium min-w-[140px] group"
              >
                <MicOff className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                End Session
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                variant="default"
                size="default"
                disabled={isConnecting}
                className="font-medium min-w-[140px] group"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Start Session
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div ref={messagesEndRef} className="h-0" />
      </div>
    </TooltipProvider>
  );
}
