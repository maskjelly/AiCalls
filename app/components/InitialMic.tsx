"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface InitialMicProps {
  isFirstTime: boolean;
  onStart: () => void;
}

/*
Initial microphone interface that appears on first load:
- Features a pulsing mic button with ripple effects
- Animates out when user starts the session
- Provides clear visual feedback for interaction
*/
export function InitialMic({ isFirstTime, onStart }: InitialMicProps) {
  if (!isFirstTime) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-800 to-black"
      >
        <motion.button
          onClick={onStart}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            className="relative z-10 w-24 h-24 rounded-full bg-zinc-800 border-2 border-blue-500/50 flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.2)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Mic className="w-10 h-10 text-blue-500" />
          </motion.div>

          <motion.p
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-400 text-sm whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Click to start talking
          </motion.p>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
} 