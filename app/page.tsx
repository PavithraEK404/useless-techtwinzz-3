"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Copy, Share2, Sparkles, MessageCircle, RefreshCw, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DialogueStyleDialog } from "@/components/dialogue-style-dialog"
import { DialogueHistoryDialog } from "@/components/dialogue-history-dialog"

export default function MemeDialogueGenerator() {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDialogue, setGeneratedDialogue] = useState<string | null>(null)
  const [dialogueData, setDialogueData] = useState<{
    dialogue: string
    style: string
    characters: string[]
  } | null>(null)

  const [settings, setSettings] = useState({
    style: "funny",
    tone: "exaggerated",
    characters: 2,
    useEmojis: true,
  })

  // Save to history
  const saveToHistory = (description: string, dialogueData: any) => {
    const historyItem = {
      id: Date.now().toString(),
      description,
      dialogue: dialogueData.dialogue,
      style: dialogueData.style,
      timestamp: new Date(),
    }

    const existingHistory = JSON.parse(localStorage.getItem("dialogue-history") || "[]")
    const newHistory = [historyItem, ...existingHistory].slice(0, 50) // Keep last 50
    localStorage.setItem("dialogue-history", JSON.stringify(newHistory))
  }

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Hold up bestie! 🛑",
        description: "You gotta describe the situation first - give me something to work with! ✨",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-dialogue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate dialogue")
      }

      const data = await response.json()
      setGeneratedDialogue(data.dialogue)
      setDialogueData(data)

      // Save to history
      saveToHistory(description, data)

      const successMessages = [
        "Dialogue generated! This is about to be ICONIC! 🔥",
        "Your meme dialogue is ready to break the internet! 💀",
        "This conversation is giving MAIN CHARACTER energy! ✨",
        "Bestie, this dialogue is about to be everyone's personality! 🎭",
        "Created pure comedy gold - you're welcome! 👑",
      ]

      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)]

      toast({
        title: data.aiEnabled ? "AI-powered comedy! 🤖✨" : randomMessage,
        description: data.aiEnabled ? "Your dialogue is ready to go viral!" : "Generated with pure comedic genius!",
      })
    } catch (error) {
      console.error("Error generating dialogue:", error)
      toast({
        title: "Oops! Something went wrong 😅",
        description: "The comedy gods are having technical difficulties. Try again bestie! 🔄",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (generatedDialogue) {
      navigator.clipboard.writeText(`${description}\n\n${generatedDialogue}`)
      const copyMessages = [
        "Copied to clipboard! Time to share the chaos! 📋✨",
        "Ready to paste this comedy gold everywhere! 💎",
        "Clipboard blessed with pure entertainment! 🙏",
        "This dialogue is about to be EVERYWHERE! 🌍",
      ]
      const randomMessage = copyMessages[Math.floor(Math.random() * copyMessages.length)]

      toast({
        title: randomMessage,
        description: "Go forth and spread the laughter! 😂",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share && generatedDialogue) {
      try {
        await navigator.share({
          title: "This dialogue is SENDING me! 💀",
          text: `${description}\n\n${generatedDialogue}`,
        })
      } catch (error) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const handleRegenerateFromHistory = (historyItem: any) => {
    setDescription(historyItem.description)
  }

  const formatDialogue = (dialogue: string) => {
    return dialogue.split("\n").map((line, index) => {
      const isPersonA = line.startsWith("Person A:") || line.startsWith("A:")
      const isPersonB = line.startsWith("Person B:") || line.startsWith("B:")
      const isPersonC = line.startsWith("Person C:") || line.startsWith("C:")

      if (isPersonA || isPersonB || isPersonC) {
        const [speaker, ...rest] = line.split(":")
        const text = rest.join(":").trim()

        const colors = {
          A: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          B: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
          C: "bg-gradient-to-r from-green-500 to-green-600 text-white",
        }

        const positions = {
          A: "justify-start",
          B: "justify-end",
          C: "justify-center",
        }

        const person = isPersonA ? "A" : isPersonB ? "B" : "C"
        const alignment = positions[person as keyof typeof positions]
        const colorClass = colors[person as keyof typeof colors]

        return (
          <div key={index} className={`flex ${alignment} mb-4`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${colorClass} ${
                person === "A" ? "rounded-bl-none" : person === "B" ? "rounded-br-none" : "rounded-b-none"
              }`}
            >
              <div className="text-xs font-bold mb-1 opacity-90">
                {person === "A" ? "Person A 😎" : person === "B" ? "Person B 🤔" : "Person C 😏"}
              </div>
              <div className="text-sm font-medium leading-relaxed">{text}</div>
            </div>
          </div>
        )
      }

      return line.trim() ? (
        <div
          key={index}
          className="text-center text-gray-500 text-sm italic mb-3 px-4 py-2 bg-gray-100 rounded-full mx-auto max-w-fit"
        >
          {line}
        </div>
      ) : null
    })
  }

  const loadingMessages = [
    "Cooking up some comedy gold... 👨‍🍳✨",
    "Consulting the meme gods... 🙏💫",
    "Generating peak entertainment... 🎭🔥",
    "Creating viral content... 📱💀",
    "Brewing the perfect chaos... ⚡😈",
  ]

  const currentLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <MessageCircle className="text-purple-600" />
            AI Meme Dialogue Generator
            <Zap className="text-yellow-500" />
          </h1>
          <p className="text-gray-600 text-xl mb-2">Turn ANY situation into VIRAL-worthy conversations! 🔥</p>
          <p className="text-purple-600 font-semibold">✨ Where chaos meets comedy ✨</p>
          <p className="text-sm text-gray-500 mt-3">💡 Add your OPENAI_API_KEY for next-level AI comedy generation</p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">What's the tea? Spill the situation! ☕</CardTitle>
              <div className="flex gap-2">
                <DialogueStyleDialog settings={settings} onSettingsChange={setSettings} />
                <DialogueHistoryDialog onRegenerateFromHistory={handleRegenerateFromHistory} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex gap-3">
              <Input
                placeholder="e.g., 'when your crush likes your Instagram story from 2019', 'explaining TikTok to your parents', 'when autocorrect changes your professional email'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                className="flex-1 text-lg p-4 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                disabled={isGenerating}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Comedy!
                  </>
                )}
              </Button>
            </div>

            {/* Enhanced example prompts */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-semibold">🔥 Trending situations:</span>
                {[
                  "when your crush likes your story from 2019",
                  "explaining TikTok to your parents",
                  "when autocorrect ruins your professional email",
                  "trying to look busy when the boss walks by",
                  "when Netflix asks if you're still watching",
                  "group project where you do all the work",
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setDescription(example)}
                    disabled={isGenerating}
                    className="text-xs hover:bg-purple-100 hover:border-purple-300 transition-colors"
                  >
                    {example}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-semibold">💀 Classic chaos:</span>
                {[
                  "when you accidentally unmute during a meeting",
                  "trying to adult but failing spectacularly",
                  "when your phone dies at 1% battery",
                  "explaining your job to relatives at dinner",
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setDescription(example)}
                    disabled={isGenerating}
                    className="text-xs hover:bg-pink-100 hover:border-pink-300 transition-colors"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Dialogue Display */}
        {(isGenerating || generatedDialogue) && (
          <Card className="border-2 border-blue-200 shadow-2xl">
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-6" />
                    <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <p className="text-2xl font-bold text-gray-700 mb-2">{currentLoadingMessage}</p>
                  <p className="text-sm text-gray-500">Crafting the perfect comedic timing... ⏰</p>
                  <div className="mt-4 flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              ) : generatedDialogue ? (
                <div className="space-y-6">
                  {/* Enhanced chat-style dialogue display */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 min-h-[300px] border-2 border-blue-100">
                    <div className="text-center mb-6 p-3 bg-white rounded-xl shadow-sm border">
                      <p className="text-sm text-gray-600 font-medium">
                        <span className="text-purple-600 font-bold">Situation:</span> {description}
                      </p>
                    </div>
                    <div className="space-y-3">{formatDialogue(generatedDialogue)}</div>
                  </div>

                  {dialogueData && (
                    <div className="text-center space-y-2 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-purple-700">Style:</span> {dialogueData.style} •
                        <span className="font-bold text-purple-700 ml-2">Characters:</span>{" "}
                        {dialogueData.characters?.length || 2} •
                        <span className="font-bold text-purple-700 ml-2">Vibe:</span> Absolutely ICONIC ✨
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 flex-wrap">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="bg-white hover:bg-blue-50 border-2 border-blue-200"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy This Gold
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="bg-white hover:bg-purple-50 border-2 border-purple-200"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share the Chaos
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      variant="outline"
                      className="bg-white hover:bg-green-50 border-2 border-green-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      More Comedy!
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedDialogue(null)
                        setDialogueData(null)
                        setDescription("")
                      }}
                      variant="outline"
                      className="bg-white hover:bg-pink-50 border-2 border-pink-200"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      New Situation
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-gray-600 font-medium">✨ Powered by AI & Pure Comedic Genius ✨</p>
          <p className="text-sm text-gray-500">Create • Share • Break the Internet! 🌍💥</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-2xl">😂</span>
            <span className="text-2xl">💀</span>
            <span className="text-2xl">🔥</span>
            <span className="text-2xl">✨</span>
            <span className="text-2xl">🎭</span>
          </div>
        </div>
      </div>
    </div>
  )
}
