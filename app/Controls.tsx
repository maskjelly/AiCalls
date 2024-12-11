import React, { useEffect, useRef, useState } from "react"
import { useVoice, VoiceReadyState } from "@humeai/voice-react"
import { SpeakerLoudIcon, StopIcon } from '@radix-ui/react-icons'
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { InitialMic } from "./components/InitialMic"
import { styled } from '@stitches/react'

const ControlsContainer = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  backgroundColor: 'var(--background)',
  borderTop: '1px solid var(--border)',
})

const ControlsContent = styled('div', {
  maxWidth: '64rem',
  margin: '0 auto',
  padding: '0.75rem',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
})

const StatusIndicator = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  backgroundColor: 'var(--background-light)',
  border: '1px solid var(--border)',
})

const StatusDot = styled('div', {
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '0',
  variants: {
    status: {
      connected: { backgroundColor: 'var(--success)' },
      connecting: { backgroundColor: 'var(--warning)' },
      disconnected: { backgroundColor: 'var(--error)' },
    },
  },
})

const ControlButton = styled('button', {
  padding: '0.5rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontSize: '0.75rem',

  '&:hover': {
    backgroundColor: 'var(--background-light)',
  },

  variants: {
    variant: {
      start: {
        '&:hover': { borderColor: 'var(--success)' },
      },
      stop: {
        '&:hover': { borderColor: 'var(--error)' },
      },
    },
  },
})

const WaveContainer = styled(motion.div, {
  position: 'absolute',
  top: '-1.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'var(--background-light)',
  padding: '0.25rem',
  border: '1px solid var(--border)',
})

function SimpleWaveAnimation({ isActive, color }: { isActive: boolean; color: string }) {
  if (!isActive) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', height: '1.5rem' }}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 4,
            backgroundColor: color,
          }}
          animate={{
            height: ['0.5rem', '1rem', '0.5rem'],
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
  )
}

export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const { toast } = useToast()
  const prevMessageLength = useRef(0)
  const [isFirstTime, setIsFirstTime] = useState(true)

  useEffect(() => {
    if (messages.length > prevMessageLength.current) {
      const lastMessage = messages[messages.length - 1]
      
      if (lastMessage.type === 'assistant_message') {
        setIsAISpeaking(true)
        setIsUserSpeaking(false)
      } else if (lastMessage.type === 'user_message') {
        setIsUserSpeaking(true)
        setIsAISpeaking(false)
      } else if (lastMessage.type === 'assistant_end') {
        setIsAISpeaking(false)
      }
    }
    prevMessageLength.current = messages.length
  }, [messages])

  useEffect(() => {
    if (readyState !== VoiceReadyState.OPEN) {
      setIsAISpeaking(false)
      setIsUserSpeaking(false)
    }
  }, [readyState])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
      toast({
        title: "Connected",
        description: "Voice session started",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start voice session",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsAISpeaking(false)
    setIsUserSpeaking(false)
    toast({
      title: "Disconnected",
      description: "Voice session ended",
      duration: 3000,
    })
  }

  const getStatusColor = () => {
    switch (readyState) {
      case VoiceReadyState.OPEN:
        return 'connected'
      case VoiceReadyState.CONNECTING:
        return 'connecting'
      default:
        return 'disconnected'
    }
  }

  const handleInitialStart = async () => {
    setIsFirstTime(false)
    await handleConnect()
  }

  if (isFirstTime) {
    return <InitialMic isFirstTime={isFirstTime} onStart={handleInitialStart} />
  }

  return (
    <ControlsContainer>
      <WaveContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <SimpleWaveAnimation 
          isActive={readyState === VoiceReadyState.OPEN && (isAISpeaking || isUserSpeaking)} 
          color={isAISpeaking ? 'var(--error)' : 'var(--success)'} 
        />
      </WaveContainer>

      <ControlsContent>
        <StatusIndicator>
          <StatusDot status={getStatusColor()} />
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--foreground-muted)', textTransform: 'uppercase' }}>
            {readyState === VoiceReadyState.OPEN && (
              isAISpeaking ? "AI Speaking" : isUserSpeaking ? "Listening" : "Connected"
            )}
            {readyState === VoiceReadyState.CONNECTING && "Connecting"}
            {readyState === VoiceReadyState.CLOSED && "Disconnected"}
          </span>
        </StatusIndicator>

        <ControlButton
          variant={readyState === VoiceReadyState.OPEN ? 'stop' : 'start'}
          onClick={readyState === VoiceReadyState.OPEN ? handleDisconnect : handleConnect}
          disabled={isConnecting}
        >
          {readyState === VoiceReadyState.OPEN ? (
            <>
              <StopIcon />
              End Session
            </>
          ) : (
            <>
              <SpeakerLoudIcon />
              {isConnecting ? 'Connecting' : 'Start Session'}
            </>
          )}
        </ControlButton>
      </ControlsContent>
    </ControlsContainer>
  )
}
