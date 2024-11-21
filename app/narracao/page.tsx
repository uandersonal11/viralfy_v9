'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Download, Mic, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { notifications } from '@/lib/notifications'
import { toast } from 'sonner'

type Voice = {
  id: string
  name: string
  gender: 'male' | 'female'
  image: string
  sampleUrl: string
}

type Audio = {
  id: string
  url: string
  text: string
  voice: Voice
}

const voices: Voice[] = [
  { id: '1', name: 'Maria', gender: 'female', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/maria.mp3' },
  { id: '2', name: 'João', gender: 'male', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/joao.mp3' },
  { id: '3', name: 'Ana', gender: 'female', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/ana.mp3' },
  { id: '4', name: 'Pedro', gender: 'male', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/pedro.mp3' },
  { id: '5', name: 'Clara', gender: 'female', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/clara.mp3' },
  { id: '6', name: 'Lucas', gender: 'male', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&auto=format&fit=crop&q=80', sampleUrl: 'https://example.com/lucas.mp3' },
]

export default function NarracaoPage() {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
  const [audios, setAudios] = useState<Audio[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const filteredVoices = voices.filter(voice => 
    genderFilter === 'all' || voice.gender === genderFilter
  )

  const togglePlay = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (playingVoice === voiceId) {
      audioRefs.current[voiceId]?.pause()
      setPlayingVoice(null)
    } else {
      if (playingVoice) {
        audioRefs.current[playingVoice]?.pause()
      }
      audioRefs.current[voiceId]?.play()
      setPlayingVoice(voiceId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVoice || text.trim().length === 0) return

    setIsLoading(true)
    const loadingToast = notifications.loading({
      title: 'Gerando narração',
      description: 'Aguarde enquanto criamos seu áudio...',
      icon: Loader2,
    })

    try {
      const response = await fetch('https://api.hostbrev.online/webhook/narração', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice.id }),
      })

      if (!response.ok) throw new Error('Falha na requisição')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      setAudios(prev => [{
        id: Date.now().toString(),
        url: audioUrl,
        text,
        voice: selectedVoice,
      }, ...prev])

      setText('')
      setSelectedVoice(null)
      
      toast.dismiss(loadingToast)
      notifications.success({
        title: 'Narração gerada',
        description: 'Seu áudio foi criado com sucesso!',
        icon: CheckCircle2,
      })
    } catch (error) {
      toast.dismiss(loadingToast)
      notifications.error({
        title: 'Erro na geração',
        description: 'Não foi possível gerar a narração. Tente novamente.',
        icon: XCircle,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-4">
      <div className="bg-gray-50 min-h-[calc(100vh-1rem)] rounded-t-[1.5rem]">
        <div className="max-w-[1800px] mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Narração</h1>
              <p className="text-gray-600 mt-1">
                Transforme seu texto em áudio com vozes naturais
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="all" onValueChange={(value) => setGenderFilter(value as 'all' | 'male' | 'female')}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="all">Todas as Vozes</TabsTrigger>
                      <TabsTrigger value="male">Masculinas</TabsTrigger>
                      <TabsTrigger value="female">Femininas</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredVoices.map((voice) => (
                          <motion.div
                            key={voice.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedVoice(voice)}
                            className={`rounded-xl p-4 flex items-center gap-4 cursor-pointer border-2 transition-all duration-200 ${
                              selectedVoice?.id === voice.id 
                                ? 'bg-blue-50 border-blue-600' 
                                : 'bg-white border-gray-200 hover:border-blue-600'
                            }`}
                          >
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <img src={voice.image} alt={voice.name} className="rounded-full" />
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-lg">{voice.name}</h3>
                              <p className="text-sm text-gray-500">
                                {voice.gender === 'female' ? 'Feminino' : 'Masculino'}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 hover:bg-blue-100 text-blue-600"
                              onClick={(e) => togglePlay(voice.id, e)}
                            >
                              {playingVoice === voice.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <audio
                              ref={(el) => {
                                if (el) audioRefs.current[voice.id] = el
                              }}
                              src={voice.sampleUrl}
                              onEnded={() => setPlayingVoice(null)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </Tabs>

                  <div className="relative">
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value.slice(0, 100))}
                      placeholder="Digite seu texto aqui..."
                      className="min-h-[120px] resize-none rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {text.length}/100
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedVoice || text.trim().length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gerando narração...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-5 w-5" />
                        Gerar Narração
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Áudios Gerados</h2>
                <ScrollArea className="h-[600px] pr-4">
                  <AnimatePresence>
                    {audios.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-[400px] text-center"
                      >
                        <Mic className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Nenhum áudio gerado</h3>
                        <p className="text-gray-500 mt-2">
                          Selecione uma voz e digite um texto para começar
                        </p>
                      </motion.div>
                    ) : (
                      audios.map((audio) => (
                        <motion.div
                          key={audio.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AudioPlayer audio={audio} />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function AudioPlayer({ audio }: { audio: Audio }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const current = audioRef.current
    if (current) {
      current.addEventListener('timeupdate', handleTimeUpdate)
      current.addEventListener('ended', () => setIsPlaying(false))
      return () => {
        current.removeEventListener('timeupdate', handleTimeUpdate)
        current.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleSeek = (newProgress: number[]) => {
    if (audioRef.current) {
      const newTime = (newProgress[0] / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setProgress(newProgress[0])
    }
  }

  const handleDownload = () => {
    notifications.success({
      title: 'Download iniciado',
      description: 'Seu áudio está sendo baixado...',
      icon: Download,
    })
  }

  return (
    <Card className="mb-4 border-2 border-gray-200 hover:border-blue-600 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <img src={audio.voice.image} alt={audio.voice.name} className="rounded-full" />
            </Avatar>
            <div>
              <div className="font-medium">{audio.voice.name}</div>
              <div className="text-sm text-gray-500 truncate max-w-[200px]">{audio.text}</div>
            </div>
          </div>
          <a
            href={audio.url}
            download={`narracao_${audio.id}.mp3`}
            onClick={handleDownload}
          >
            <Button
              size="icon"
              variant="outline"
              className="rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            size="icon"
            variant="outline"
            className="rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            className="flex-1"
            onValueChange={handleSeek}
          />
        </div>
        <audio
          ref={audioRef}
          src={audio.url}
        />
      </div>
    </Card>
  )
}