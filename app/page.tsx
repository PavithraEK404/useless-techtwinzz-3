"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Share2, Sparkles, MessageCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DialogueStyleDialog } from "@/components/dialogue-style-dialog"
import { DialogueHistoryDialog } from "@/components/dialogue-history-dialog"

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

const loadingMessages = [
  "Cooking up some comedy gold... 👨‍🍳✨",
  "Summoning the meme spirits... 👻💫",
  "Teaching AI to be funny... 🤖😂",
  "Brewing the perfect roast... ☕🔥",
  "Channeling chaotic energy... ⚡💀",
  "Consulting the comedy council... 🎭👑",
  "Mixing humor with chaos... 🌪️😈",
  "Loading maximum vibes... 🚀💎",
]

const successMessages = [
  "Pure comedy gold delivered! 🏆✨",
  "This one's going viral! 📱🔥",
  "Chef's kiss perfection! 👨‍🍳💋",
  "Absolute banger created! 💥🎯",
  "Comedy genius activated! 🧠⚡",
  "Meme magic unleashed! 🪄💫",
  "Chaos level: Maximum! 🌪️💀",
  "Viral content incoming! 🚀📈",
]

const examplePrompts = [
  "when your crush likes your story from 2019 💀",
  "submitting assignment at 11:59 PM ⏰",
  "when exam gets postponed after studying all night 📚",
  "accidentally opening front camera 📸",
  "when WiFi disconnects during important meeting 📶",
  "finding money in old jeans 💰",
  "when your code works on first try 💻",
  "ordering food vs when it arrives 🍕",
]

export default function MemeDialogueGenerator() {
  const [description, setDescription] = useState("")
  const [dialogue, setDialogue] = useState<DialogueMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [dialogueHistory, setDialogueHistory] = useState<GeneratedDialogue[]>([])
  const [dialogueStyle, setDialogueStyle] = useState({
    style: "funny",
    chaosLevel: "moderate",
    characterCount: 2,
    extraEmojis: true,
  })

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Hold up! 🛑",
        description: "Please enter a description first! 📝✨",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])

    try {
      const response = await fetch("/api/generate-dialogue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          style: dialogueStyle.style,
          chaosLevel: dialogueStyle.chaosLevel,
          characterCount: dialogueStyle.characterCount,
          extraEmojis: dialogueStyle.extraEmojis,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate dialogue")
      }

      const data = await response.json()
      const messages = data.dialogue
        .split("\n")
        .filter((line: string) => line.trim())
        .map((line: string) => {
          const [speaker, ...textParts] = line.split(": ")
          return {
            speaker: speaker.trim(),
            text: textParts.join(": ").trim(),
          }
        })

      setDialogue(messages)

      // Add to history
      const newDialogue: GeneratedDialogue = {
        id: Date.now().toString(),
        messages,
        timestamp: new Date(),
        style: dialogueStyle.style,
        description,
      }
      setDialogueHistory((prev) => [newDialogue, ...prev])

      toast({
        title: successMessages[Math.floor(Math.random() * successMessages.length)],
        description: "Your viral dialogue is ready! 🚀💫",
      })
    } catch (error) {
      console.error("Error generating dialogue:", error)
      toast({
        title: "Oops! Something went wrong 😅",
        description: "The comedy machine broke 🔧💀",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    const dialogueText = dialogue.map((msg) => `${msg.speaker}: ${msg.text}`).join("\n")
    navigator.clipboard.writeText(dialogueText)
    toast({
      title: "Copied to clipboard! 📋✨",
      description: "Ready to share the laughs everywhere! 🌍💫",
    })
  }

  const handleShare = async () => {
    const dialogueText = dialogue.map((msg) => `${msg.speaker}: ${msg.text}`).join("\n")

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hilarious Meme Dialogue 😂",
          text: dialogueText,
        })
        toast({
          title: "Shared successfully! 🚀",
          description: "Spread the chaos everywhere! 🌪️💫",
        })
      } catch (error) {
        console.error("Error sharing:", error)
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const handleExampleClick = (example: string) => {
    setDescription(example)
    toast({
      title: "Example loaded! 🎯",
      description: "Hit generate for instant comedy ✨",
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-400 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>

      {/* Floating Emojis */}
      <div className="fixed top-10 left-10 text-6xl animate-bounce-slow opacity-30">😂</div>
      <div className="fixed top-20 right-20 text-5xl animate-float opacity-25" style={{ animationDelay: "1s" }}>
        💀
      </div>
      <div className="fixed bottom-20 left-20 text-7xl animate-pulse opacity-20" style={{ animationDelay: "2s" }}>
        🎭
      </div>
      <div
        className="fixed bottom-10 right-10 text-6xl animate-bounce-slow opacity-30"
        style={{ animationDelay: "0.5s" }}
      >
        🔥
      </div>
      <div className="fixed top-1/2 left-5 text-5xl animate-float opacity-25" style={{ animationDelay: "1.5s" }}>
        ✨
      </div>
      <div className="fixed top-1/3 right-5 text-6xl animate-pulse opacity-20" style={{ animationDelay: "2.5s" }}>
        🚀
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 gradient-text-rainbow">AI Meme Dialogue Generator 🎭✨</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Turn any situation into viral-worthy conversations! 💬🔥
            </p>
          </div>

          {/* Main Card */}
          <Card className="backdrop-blur-glass shadow-2xl border-2 border-purple-200 dark:border-purple-800 hover-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <MessageCircle className="text-purple-500" />
                Create Epic Dialogues 💫
              </CardTitle>
              <div className="flex justify-center gap-4 mt-4">
                <DialogueStyleDialog dialogueStyle={dialogueStyle} setDialogueStyle={setDialogueStyle} />
                <DialogueHistoryDialog
                  dialogueHistory={dialogueHistory}
                  setDialogueHistory={setDialogueHistory}
                  onRegenerateDialogue={(desc) => {
                    setDescription(desc)
                    handleGenerate()
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Describe your situation 📝✨
                  </label>
                  <Textarea
                    placeholder="e.g., when your crush likes your story from 2019 💀"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] text-lg border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !description.trim()}
                  className="w-full text-lg py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover-scale"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      {loadingMessage}
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2" />
                      Generate Dialogue 🚀💫
                    </>
                  )}
                </Button>
              </div>

              {/* Example Prompts */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>💡</span> Try these viral situations:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-left justify-start h-auto py-2 px-3 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover-scale"
                      disabled={isLoading}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generated Dialogue */}
              {dialogue.length > 0 && (
                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span>🎭</span> Your Viral Dialogue:
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopy}
                        size="sm"
                        variant="outline"
                        className="hover-scale border-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 bg-transparent"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy 📋
                      </Button>
                      <Button
                        onClick={handleShare}
                        size="sm"
                        variant="outline"
                        className="hover-scale border-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share 🚀
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dialogue.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.speaker === "Person A" ? "justify-start" : "justify-end"
                        } chat-bubble-enter`}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                            message.speaker === "Person A"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-bl-sm"
                              : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-br-sm"
                          }`}
                        >
                          <div className="text-xs opacity-75 mb-1 font-medium">{message.speaker} 👤</div>
                          <div className="text-base font-medium">{message.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2 text-lg">
              Made with
              <span className="animate-pulse">💜</span>
              <span className="animate-bounce-slow" style={{ animationDelay: "0.2s" }}>
                🔥
              </span>
              <span className="animate-float" style={{ animationDelay: "0.4s" }}>
                ✨
              </span>
              <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>
                💀
              </span>
              <span className="animate-bounce-slow" style={{ animationDelay: "0.8s" }}>
                🚀
              </span>
              <span className="animate-float" style={{ animationDelay: "1s" }}>
                💫
              </span>
              for maximum chaos!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
