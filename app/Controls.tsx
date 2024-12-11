import React, { useEffect, useRef, useState } from "react"
import { useVoice, VoiceReadyState } from "@humeai/voice-react"
import { Mic, MicOff, AutorenewRounded } from '@mui/icons-material'
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { InitialMic } from "./components/InitialMic"
import { 
  Box, 
  Button, 
  Typography, 
  useTheme, 
  Fade,
  Paper,
  Grid
} from '@mui/material'

function SimpleWaveAnimation({ isActive, color }: { isActive: boolean; color: string }) {
  const theme = useTheme()

  if (!isActive) return null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, height: 48 }}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 6,
            backgroundColor: color,
            borderRadius: theme.shape.borderRadius,
          }}
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
    </Box>
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
  const theme = useTheme()

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
        title: "Connected successfully",
        description: "Voice session has started",
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
      title: "Session ended",
      description: "Voice session has been terminated",
      duration: 3000,
    })
  }

  const getStatusColor = () => {
    switch (readyState) {
      case VoiceReadyState.OPEN:
        return theme.palette.success.main
      case VoiceReadyState.CONNECTING:
        return theme.palette.warning.main
      default:
        return theme.palette.error.main
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
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Fade in={true}>
        <Paper 
          elevation={3}
          sx={{
            position: 'absolute',
            top: -32,
            left: '50%',
            transform: 'translateX(-50%)',
            p: 2,
            borderRadius: '50%',
          }}
        >
          <SimpleWaveAnimation 
            isActive={readyState === VoiceReadyState.OPEN && (isAISpeaking || isUserSpeaking)} 
            color={isAISpeaking ? theme.palette.error.main : theme.palette.primary.main} 
          />
        </Paper>
      </Fade>

      <Grid container spacing={2} sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
        <Grid item xs={6}>
          <Paper 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1, 
              p: 1,
              bgcolor: 'background.default',
            }}
          >
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: getStatusColor(),
                animation: readyState === VoiceReadyState.OPEN ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0.5,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              {readyState === VoiceReadyState.OPEN && (
                isAISpeaking ? "AI Speaking" : isUserSpeaking ? "Listening..." : "Connected"
              )}
              {readyState === VoiceReadyState.CONNECTING && "Connecting"}
              {readyState === VoiceReadyState.CLOSED && "Disconnected"}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={readyState === VoiceReadyState.OPEN ? "outlined" : "contained"}
            color={readyState === VoiceReadyState.OPEN ? "error" : "primary"}
            onClick={readyState === VoiceReadyState.OPEN ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            startIcon={readyState === VoiceReadyState.OPEN ? <MicOff /> : <Mic />}
          >
            {readyState === VoiceReadyState.OPEN ? 'End Session' : (isConnecting ? 'Connecting...' : 'Start Session')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

