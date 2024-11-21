'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ChevronLeft, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { notifications } from '@/lib/notifications'

interface Message {
  id: string
  content: string
  sender: 'user' | 'support'
  timestamp: Date
  type: 'text' | 'image'
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    setShowWelcomeMessage(false)
    setIsTyping(true)

    const textMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages(prev => [...prev, textMessage])
    await sendMessageToAPI(inputMessage)

    setInputMessage('')
  }

  const sendMessageToAPI = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.hostbrev.online/webhook/chatbot_suporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Falha na requisição')
      }

      const data = await response.json()
      
      const supportMessage: Message = {
        id: Date.now().toString(),
        content: data[0].output || "Desculpe, não foi possível processar sua mensagem.",
        sender: 'support',
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, supportMessage])
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
        notifications.info({
          title: 'Nova mensagem',
          description: 'Você tem uma nova mensagem do suporte',
          icon: MessageCircle,
        })
      }
    } catch (error) {
      notifications.error({
        title: 'Erro no envio',
        description: 'Não foi possível enviar sua mensagem',
        icon: MessageCircle,
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-full max-w-[400px] h-[600px] flex flex-col shadow-xl border-0">
              <div className="bg-blue-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-white text-lg font-medium">Suporte</h2>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {showWelcomeMessage && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="font-medium text-blue-800">Bem-vindo ao nosso suporte!</p>
                      <p className="mt-2 text-gray-600">
                        Estamos aqui para te ajudar com o que precisar.
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Nosso atendimento é de segunda a sexta das 08h30 às 18h e aos sábados das 08h30 às 12h
                        (horário de Brasília).
                      </p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-white border-2 border-blue-600'
                      }`}>
                        {message.sender === 'user' 
                          ? <User className="w-4 h-4 text-white" />
                          : <Bot className="w-4 h-4 text-blue-600" />
                        }
                      </div>
                      <div className={`max-w-[80%] rounded-xl p-4 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-800'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-150" />
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative"
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              onClick={() => {
                setIsOpen(true)
                setUnreadCount(0)
              }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {unreadCount}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}