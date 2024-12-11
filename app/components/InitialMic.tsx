import React from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { Mic } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface InitialMicProps {
  isFirstTime: boolean
  onStart: () => void
}

export function InitialMic({ isFirstTime, onStart }: InitialMicProps) {
  const theme = useTheme()

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Mic />}
          onClick={onStart}
          sx={{ 
            borderRadius: '50%', 
            width: 80, 
            height: 80,
            mb: 2,
          }}
        >
          Start
        </Button>
      </motion.div>
      <Typography variant="body2" color="text.secondary" align="center">
        Click to start your voice session
      </Typography>
    </Box>
  )
}

