import React from 'react'
import { styled } from '@stitches/react'
import { SpeakerLoudIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

const InitialMicContainer = styled(motion.div, {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  backgroundColor: 'var(--background)',
  borderTop: '1px solid var(--border)',
})

const StartButton = styled(motion.button, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4rem',
  height: '4rem',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'var(--background-light)',
    borderColor: 'var(--primary-main)',
  },
})

interface InitialMicProps {
  isFirstTime: boolean
  onStart: () => void
}

export function InitialMic({ isFirstTime, onStart }: InitialMicProps) {
  return (
    <InitialMicContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}


      
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <StartButton
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SpeakerLoudIcon width={24} height={24} />
      </StartButton>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        Start Voice Session
      </motion.p>
    </InitialMicContainer>
  )
}

