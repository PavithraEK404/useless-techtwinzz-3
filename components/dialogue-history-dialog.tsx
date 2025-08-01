"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Copy, RefreshCw, Trash2, Clock, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface HistoryItem {
  id: string
  description: string
  dialogue: string
  style: string
  timestamp: Date
}

interface DialogueHistoryDialogProps {
  onRegenerateFromHistory: (item: HistoryItem) => void
}

export function DialogueHistoryDialog({ onRegenerateFromHistory }: DialogueHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (open) {
      loadHistory()
    }
  }, [open])

  const loadHistory = () => {
    const savedHistory = localStorage.getItem("dialogue-history")
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
      setHistory(parsedHistory)
    }
  }

  const copyDialogue = (item: HistoryItem) => {
    navigator.clipboard.writeText(`${item.description}\n\n${item.dialogue}`)
    toast({
      title: "Copied to clipboard! 📋✨",
      description: "This legendary dialogue is ready to share! 🚀",
    })
  }

  const regenerateFromHistory = (item: HistoryItem) => {
    onRegenerateFromHistory(item)
    setOpen(false)
    toast({
      title: "Regenerating from history! 🔄✨",
      description: "Using your previous situation for new comedy gold! 💎",
    })
  }

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem("dialogue-history", JSON.stringify(updatedHistory))
    toast({
      title: "Dialogue deleted! 🗑️",
      description: "Removed from your comedy archive! ✨",
    })
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem("dialogue-history")
    toast({
      title: "History cleared! 🧹✨",
      description: "Fresh start for your comedy journey! 🚀",
    })
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now ⚡"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago 🕐`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago 🕒`
    return `${Math.floor(diffInMinutes / 1440)}d ago 📅`
  }

  const getStyleEmoji = (style: string) => {
    const styleEmojis: { [key: string]: string } = {
      funny: "😂",
      sarcastic: "😏",
      wholesome: "🥰",
      dramatic: "🎭",
      relatable: "😅",
      chaotic: "🤪",
    }
    return styleEmojis[style] || "🎭"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0 font-bold px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <History className="w-5 h-5 mr-2" />
          History 📚✨
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-gradient-to-br from-blue-50 to-green-50 border-4 border-blue-300 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-3">
            <History className="text-blue-600" />
            Your Comedy Archive! 📚✨
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-700 font-medium">
            Revisit your legendary dialogues and create new masterpieces! 🎭💎
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Header Stats */}
          <div className="flex justify-between items-center p-4 bg-white rounded-2xl border-2 border-blue-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{history.length}</div>
              <div className="text-sm text-gray-600">Total Dialogues 💬</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {history.filter((item) => new Date().getTime() - item.timestamp.getTime() < 24 * 60 * 60 * 1000).length}
              </div>
              <div className="text-sm text-gray-600">Today 🔥</div>
            </div>
            <Button
              onClick={clearAllHistory}
              variant="outline"
              size="sm"
              className="hover:bg-red-50 hover:border-red-300 transition-all duration-200 bg-transparent"
              disabled={history.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All 🧹
            </Button>
          </div>

          {/* History List */}
          <ScrollArea className="h-[400px] w-full">
            {history.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-xl font-bold text-gray-700">No dialogues yet! 🎭</h3>
                <p className="text-gray-600">Generate some comedy gold to see it here! ✨</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white px-2 py-1">
                          {getStyleEmoji(item.style)} {item.style}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyDialogue(item)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => regenerateFromHistory(item)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => deleteHistoryItem(item.id)}
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium text-gray-800">
                        <span className="text-purple-600 font-bold">🎭 Situation:</span> {item.description}
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border">
                        <div className="font-medium mb-1">Generated Dialogue: 💬</div>
                        <div className="whitespace-pre-wrap">{item.dialogue.substring(0, 150)}...</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Close Archive ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
