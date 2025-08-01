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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Copy, Share2, Trash2, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DialogueHistoryItem {
  id: string
  description: string
  dialogue: string
  style: string
  timestamp: Date
}

interface DialogueHistoryDialogProps {
  onRegenerateFromHistory?: (item: DialogueHistoryItem) => void
}

export function DialogueHistoryDialog({ onRegenerateFromHistory }: DialogueHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<DialogueHistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("dialogue-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (error) {
        console.error("Error loading dialogue history:", error)
      }
    }
  }, [open])

  const clearHistory = () => {
    localStorage.removeItem("dialogue-history")
    setHistory([])
    toast({
      title: "History cleared",
      description: "All dialogue history has been deleted.",
    })
  }

  const deleteItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("dialogue-history", JSON.stringify(newHistory))
    toast({
      title: "Dialogue deleted",
      description: "Dialogue removed from history.",
    })
  }

  const copyDialogue = (item: DialogueHistoryItem) => {
    navigator.clipboard.writeText(`${item.description}\n\n${item.dialogue}`)
    toast({
      title: "Copied to clipboard! 📋",
      description: "Dialogue copied successfully",
    })
  }

  const shareDialogue = async (item: DialogueHistoryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this meme dialogue!",
          text: `${item.description}\n\n${item.dialogue}`,
        })
      } catch (error) {
        copyDialogue(item)
      }
    } else {
      copyDialogue(item)
    }
  }

  const regenerateFromHistory = (item: DialogueHistoryItem) => {
    onRegenerateFromHistory?.(item)
    setOpen(false)
  }

  const formatDialoguePreview = (dialogue: string) => {
    const lines = dialogue.split("\n").slice(0, 2) // Show first 2 lines
    return lines.join("\n") + (dialogue.split("\n").length > 2 ? "..." : "")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          History ({history.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Dialogue History
          </DialogTitle>
          <DialogDescription>View and manage your previously generated meme dialogues.</DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No dialogues generated yet.</p>
            <p className="text-sm">Start creating meme dialogues to see them here!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {history.length} dialogue{history.length !== 1 ? "s" : ""} in history
              </p>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.style}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded text-sm mb-3 font-mono whitespace-pre-line">
                      {formatDialoguePreview(item.dialogue)}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => regenerateFromHistory(item)}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Use Again
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyDialogue(item)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => shareDialogue(item)}>
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
