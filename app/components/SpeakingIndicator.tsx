"use client";
import { motion } from 'framer-motion';

interface SpeakingIndicatorProps {
  isAISpeaking: boolean;
  isUserSpeaking: boolean;
}

export function SpeakingIndicator({ isAISpeaking, isUserSpeaking }: SpeakingIndicatorProps) {
  const isActive = isAISpeaking || isUserSpeaking;
  const color = isAISpeaking ? 'red' : 'blue';

  return (
    <div className="relative w-32 h-12">
      {isActive && (
        <>
          {/* Central Hexagon */}
          <motion.div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 
              ${isAISpeaking ? 'bg-red-500' : 'bg-blue-500'} rotate-45`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Circular Pulse */}
          <motion.div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full
              ${isAISpeaking ? 'border-red-500' : 'border-blue-500'} border-2`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Scanning Lines */}
          <motion.div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px]
              ${isAISpeaking ? 'bg-red-500' : 'bg-blue-500'}`}
            animate={{
              opacity: [0.2, 1, 0.2],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Vertical Energy Bars */}
          <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-[2px] ${isAISpeaking ? 'bg-red-500' : 'bg-blue-500'}`}
                animate={{
                  height: [
                    '10%',
                    `${Math.random() * 60 + 40}%`,
                    '10%'
                  ],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Corner Accents */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 border-l-2 border-t-2
                ${isAISpeaking ? 'border-red-500' : 'border-blue-500'}`}
              style={{
                top: i < 2 ? '0' : 'auto',
                bottom: i >= 2 ? '0' : 'auto',
                left: i % 2 === 0 ? '0' : 'auto',
                right: i % 2 === 1 ? '0' : 'auto',
                transform: `rotate(${i * 90}deg)`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
} 