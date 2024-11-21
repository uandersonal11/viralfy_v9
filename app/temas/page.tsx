'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Sparkles, Copy, Check, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { notifications } from '@/lib/notifications'
import { toast } from 'sonner'

export default function ThemesGenerator() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [themes, setThemes] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setThemes([])

    const loadingToast = notifications.loading({
      title: 'Gerando temas',
      description: 'Aguarde enquanto criamos sugestões virais...',
      icon: Loader2,
    });

    try {
      const response = await fetch('https://api.hostbrev.online/webhook/temas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('Falha na requisição')
      }

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        setThemes([data[0].output])
        toast.dismiss(loadingToast)
        notifications.success({
          title: 'Temas gerados',
          description: 'Suas sugestões foram criadas com sucesso!',
          icon: CheckCircle2,
        })
      } else {
        throw new Error('Formato de resposta inválido')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      notifications.error({
        title: 'Erro na geração',
        description: 'Não foi possível gerar os temas. Tente novamente.',
        icon: AlertCircle,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      notifications.success({
        title: 'Copiado!',
        description: 'Texto copiado para a área de transferência',
        icon: Check,
      })
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Temas Virais</h1>
              <p className="text-gray-600 mt-1">
                Transforme suas ideias em conteúdo viral com sugestões personalizadas
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Descreva seu tema ou cole um link
                    </label>
                    <Textarea
                      placeholder="Digite assuntos, subtemas ou cole um link de vídeo aqui..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[200px] resize-none rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando sugestões...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Gerar Temas Virais
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>

            <AnimatePresence>
              {themes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Sugestões de Temas</h3>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(themes.join('\n\n'), 0)}
                          className="h-10 w-10 rounded-lg"
                        >
                          {copiedIndex === 0 ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {themes.map((theme, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white rounded-xl border-2 border-gray-200 p-6"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-gray-800 text-lg leading-relaxed">
                                  {theme}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="mt-4 flex items-center gap-2 text-green-600">
                        <Sparkles className="h-5 w-5" />
                        <p className="font-medium">Temas gerados com sucesso!</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}