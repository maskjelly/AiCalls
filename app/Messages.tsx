'use client'

import React, { useEffect, useRef } from "react"
import { useVoice } from "@humeai/voice-react"
import { motion, AnimatePresence } from "framer-motion"
import { PersonIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import Navbar from './components/Navbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { styled } from '@stitches/react'
import * as Avatar from '@radix-ui/react-avatar'
import { useTheme } from 'next-themes'
import Controls from './Controls'

interface GroupedMessage {
  type?: "user_message"
  content: string
  timestamp: number
}

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
})

const MessageContainer = styled('div', {
  flex: 1,
  maxWidth: '64rem',
  width: '100%',
  margin: '0 auto',
  padding: '4rem 1rem 7rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  overflowY: 'auto',
})

const MessageBubble = styled(motion.div, {
  padding: '0.75rem',
  borderRadius: '0',
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-start',
  borderLeft: '3px solid var(--primary-main)',
  transition: 'background-color 0.3s ease',

  variants: {
    type: {
      user: {
        backgroundColor: 'var(--background-light)',
        marginLeft: 'auto',
        borderLeft: 'none',
        borderRight: '3px solid var(--primary-main)',
      },
      assistant: {
        backgroundColor: 'var(--background)',
        marginRight: 'auto',
      },
    },
  },
})

const AvatarRoot = styled(Avatar.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: 24,
  height: 24,
  borderRadius: '0',
  backgroundColor: 'var(--primary-main)',
})

const AvatarFallback = styled(Avatar.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--primary-main)',
  color: 'var(--background)',
  fontSize: '0.75rem',
  lineHeight: 1,
  fontWeight: 500,
})

const MessageContent = styled('div', {
  flex: 1,
  '& p': {
    margin: '0.5rem 0',
    lineHeight: 1.6,
  },
  '& code': {
    backgroundColor: 'var(--background-light)',
    padding: '0.2rem 0.4rem',
    borderRadius: '3px',
    fontSize: '0.85em',
  },
  '& pre': {
    backgroundColor: 'var(--background-light)',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
  },
  '& blockquote': {
    borderLeft: '3px solid var(--primary-main)',
    paddingLeft: '1rem',
    color: 'var(--foreground-muted)',
    fontStyle: 'italic',
  },
})

export default function Messages() {
  const { messages } = useVoice()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

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
    <Container>
      <Navbar user={null} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      
      <MessageContainer>
        <AnimatePresence>
          {groupedMessages.map((msg, index) => {
            const isUser = msg.type === "user_message"
            return (
              <MessageBubble
                key={index}
                type={isUser ? 'user' : 'assistant'}
                initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isUser ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                <AvatarRoot>
                  <AvatarFallback>
                    {isUser ? <PersonIcon /> : <ChatBubbleIcon />}
                  </AvatarFallback>
                </AvatarRoot>
                <MessageContent>
                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-main)', textTransform: 'uppercase' }}>AI</span>
                    </div>
                  )}
                  <ReactMarkdown 
                    remarkPlugins={[
                      remarkGfm,      // GitHub Flavored Markdown
                      remarkMath      // Mathematical equations support
                    ]}
                    rehypePlugins={[
                      rehypeKatex    // Rendering mathematical equations
                    ]}
                    components={{
                      // Custom rendering for code blocks
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <pre className={className}>
                            <code {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </MessageContent>
              </MessageBubble>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </MessageContainer>
      <Controls />
    </Container>
  )
}