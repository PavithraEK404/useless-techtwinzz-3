"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { History, Copy, RotateCcw, Trash2, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DialogueMessage {
  speaker: string
  text: string
}

interface GeneratedDialogue {
  id: string
  messages: DialogueMessage[]
  timestamp: Date
  style: string
  description: string
}

interface DialogueHistoryProps {
  dialogueHistory: GeneratedDialogue[]
  setDialogueHistory: (history: GeneratedDialogue[]) => void
  onRegenerateDialogue: (description: string) => void
}

export function DialogueHistoryDialog({
  dialogueHistory,
  setDialogueHistory,
  onRegenerateDialogue,
}: DialogueHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyDialogue = (dialogue: GeneratedDialogue) => {
    const dialogueText = dialogue.messages.map((msg) => `${msg.speaker}: ${msg.text}`).join("\n")
    navigator.clipboard.writeText(dialogueText)
    toast({
      title: "Copied to clipboard! 📋✨",
      description: "Dialogue ready to share! 🚀",
    })
  }

  const handleRegenerateDialogue = (dialogue: GeneratedDialogue) => {
    onRegenerateDialogue(dialogue.description)
    setIsOpen(false)
    toast({
      title: "Regenerating dialogue! 🔄✨",
      description: "Creating a new version of this situation! 🎭",
    })
  }

  const handleDeleteDialogue = (id: string) => {
    setDialogueHistory(dialogueHistory.filter((d) => d.id !== id))
    toast({
      title: "Dialogue deleted! 🗑️",
      description: "Removed from your history! ✨",
    })
  }

  const handleClearHistory = () => {
    setDialogueHistory([])
    toast({
      title: "History cleared! 🧹✨",
      description: "Fresh start for new comedy gold! 🎭",
    })
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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

  const todayCount = dialogueHistory.filter((d) => {
    const today = new Date()
    const dialogueDate = new Date(d.timestamp)
    return dialogueDate.toDateString() === today.toDateString()
  }).length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-green-200 to-blue-200 hover:from-green-300 hover:to-blue-300 border-2 border-green-300 text-gray-800 font-bold shadow-lg hover-scale"
        >
          <History className="w-4 h-4 mr-2" />
          History 📚✨
          {dialogueHistory.length > 0 && (
            <Badge className="ml-2 bg-purple-500 text-white">{dialogueHistory.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] backdrop-blur-glass border-2 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <History className="text-purple-500" />
            Your Comedy Archive 📚✨
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            All your hilarious dialogues in one place! 🎭💫
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="flex justify-center gap-4">
            <Badge className="bg-purple-500 text-white px-3 py-1">📊 Total: {dialogueHistory.length}</Badge>
            <Badge className="bg-green-500 text-white px-3 py-1">📅 Today: {todayCount}</Badge>
          </div>

          {dialogueHistory.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🎭</div>
              <h3 className="text-xl font-semibold text-gray-600">No dialogues yet!</h3>
              <p className="text-gray-500">Generate your first hilarious dialogue to get started! ✨</p>
            </div>
          ) : (
            <>
              {/* Clear History Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleClearHistory}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 border-red-200 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All History 🧹
                </Button>
              </div>

              {/* History List */}
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4 pr-4">
                  {dialogueHistory.map((dialogue, index) => (
                    <div
                      key={dialogue.id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 hover:shadow-lg transition-all duration-200"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500 text-white">
                            {getStyleEmoji(dialogue.style)} {dialogue.style}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatTimestamp(new Date(dialogue.timestamp))}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleCopyDialogue(dialogue)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleRegenerateDialogue(dialogue)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-green-100"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteDialogue(dialogue.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 bg-white dark:bg-gray-800 p-2 rounded border">
                        🎯 {dialogue.description}
                      </p>

                      {/* Messages Preview */}
                      <div className="space-y-2">
                        {dialogue.messages.slice(0, 2).map((message, msgIndex) => (
                          <div
                            key={msgIndex}
                            className={`text-xs p-2 rounded ${
                              message.speaker === "Person A"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            <span className="font-medium">{message.speaker}:</span> {message.text}
                          </div>
                        ))}
                        {dialogue.messages.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            ... and {dialogue.messages.length - 2} more messages
                          </div>
                        )}
                      </div>

                      {index < dialogueHistory.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
