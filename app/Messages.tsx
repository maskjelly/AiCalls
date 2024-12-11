'use client'

import React, { useEffect, useRef } from "react"
import { useVoice } from "@humeai/voice-react"
import { motion } from "framer-motion"
import { Person, AutoAwesome, Build } from '@mui/icons-material'
import Navbar from './components/Navbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Paper, Avatar, Typography, Container, Box } from '@mui/material'

interface GroupedMessage {
  type?: "user_message"
  content: string
  timestamp: number
}

export default function Messages() {
  const { messages } = useVoice()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1a73e8',
          },
          secondary: {
            main: '#fbbc04',
          },
        },
      }),
    [prefersDarkMode],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const groupedMessages = messages.reduce<GroupedMessage[]>((acc, message) => {
    if (message.type === "user_message" && 'message' in message && message.message?.content) {
      acc.push({
        type: "user_message",
        content: message.message.content,
        timestamp: Date.now()
      })
    } else if (message.type === "assistant_message" && 'message' in message && message.message?.content) {
      const lastMessage = acc[acc.length - 1]
      if (lastMessage && !lastMessage.type) {
        lastMessage.content += "\n\n" + message.message.content
      } else {
        acc.push({
          content: message.message.content,
          timestamp: Date.now()
        })
      }
    }
    return acc
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar user={null} />
        
        <Container maxWidth="md" sx={{ pt: 10, pb: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {groupedMessages.map((msg, index) => {
              const isUser = msg.type === "user_message"
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={index}
                >
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: isUser ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: 2,
                      bgcolor: isUser ? 'primary.light' : 'secondary.light',
                    }}
                  >
                    <Avatar sx={{ bgcolor: isUser ? 'primary.main' : 'secondary.main' }}>
                      {isUser ? <Person /> : <Build />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      {!isUser && (
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AutoAwesome fontSize="small" />
                          Misti&#39;s Response
                        </Typography>
                      )}
                      <Typography component="div" variant="body2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              )
            })}
            <div ref={messagesEndRef} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

