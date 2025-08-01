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
import { History, Download, Share2, Trash2, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MemeHistoryItem {
  id: string
  description: string
  topText: string
  bottomText: string
  template: string
  timestamp: Date
  imageUrl: string
}

interface MemeHistoryDialogProps {
  onRegenerateFromHistory?: (item: MemeHistoryItem) => void
}

export function MemeHistoryDialog({ onRegenerateFromHistory }: MemeHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<MemeHistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("meme-history")
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
        console.error("Error loading meme history:", error)
      }
    }
  }, [open])

  const clearHistory = () => {
    localStorage.removeItem("meme-history")
    setHistory([])
    toast({
      title: "History cleared",
      description: "All meme history has been deleted.",
    })
  }

  const deleteItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem("meme-history", JSON.stringify(newHistory))
    toast({
      title: "Meme deleted",
      description: "Meme removed from history.",
    })
  }

  const downloadMeme = (item: MemeHistoryItem) => {
    const link = document.createElement("a")
    link.href = item.imageUrl
    link.download = `meme-${item.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareMeme = async (item: MemeHistoryItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this meme!",
          text: `Generated meme: "${item.description}"`,
          url: item.imageUrl,
        })
      } catch (error) {
        navigator.clipboard.writeText(item.imageUrl)
        toast({
          title: "Link copied!",
          description: "Meme link copied to clipboard",
        })
      }
    }
  }

  const regenerateFromHistory = (item: MemeHistoryItem) => {
    onRegenerateFromHistory?.(item)
    setOpen(false)
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
            Meme History
          </DialogTitle>
          <DialogDescription>View and manage your previously generated memes.</DialogDescription>
        </DialogHeader>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No memes generated yet.</p>
            <p className="text-sm">Start creating memes to see them here!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {history.length} meme{history.length !== 1 ? "s" : ""} in history
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
                            {item.template}
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

                    <div className="bg-gray-50 p-2 rounded text-xs mb-3">
                      <div>
                        <strong>Top:</strong> {item.topText}
                      </div>
                      <div>
                        <strong>Bottom:</strong> {item.bottomText}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => regenerateFromHistory(item)}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadMeme(item)}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => shareMeme(item)}>
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
