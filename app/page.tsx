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
        title: "Hold up bestie! 🛑✋",
        description: "You gotta describe the situation first - give me something to work with! ✨🎭",
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
        "Dialogue generated! This is about to be ICONIC! 🔥👑💀",
        "Your meme dialogue is ready to break the internet! 💀🌍💥",
        "This conversation is giving MAIN CHARACTER energy! ✨🎭🌟",
        "Bestie, this dialogue is about to be everyone's personality! 🎭💅✨",
        "Created pure comedy gold - you're welcome! 👑💎🏆",
        "This is sending me to another dimension! 🚀🌌😂",
        "Absolutely UNHINGED content incoming! 🤪🔥💀",
      ]

      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)]

      toast({
        title: data.aiEnabled ? "AI-powered comedy! 🤖✨🎉" : randomMessage,
        description: data.aiEnabled
          ? "Your dialogue is ready to go viral! 🚀💀🔥"
          : "Generated with pure comedic genius! 🧠💎✨",
      })
    } catch (error) {
      console.error("Error generating dialogue:", error)
      toast({
        title: "Oops! Something went wrong 😅💔🤖",
        description: "The comedy gods are having technical difficulties. Try again bestie! 🔄⚡✨",
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
        "Copied to clipboard! Time to share the chaos! 📋✨🌪️",
        "Ready to paste this comedy gold everywhere! 💎📱🔥",
        "Clipboard blessed with pure entertainment! 🙏✨😇",
        "This dialogue is about to be EVERYWHERE! 🌍📢💀",
        "Spreading the chaos one paste at a time! 🌪️📋😈",
        "Your clipboard just got an upgrade! 📋⬆️✨",
      ]
      const randomMessage = copyMessages[Math.floor(Math.random() * copyMessages.length)]

      toast({
        title: randomMessage,
        description: "Go forth and spread the laughter! 😂🚀🌍",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share && generatedDialogue) {
      try {
        await navigator.share({
          title: "This dialogue is SENDING me! 💀🚀✨",
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
          A: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
          B: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
          C: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
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
          <div key={index} className={`flex ${alignment} mb-4 animate-in slide-in-from-bottom-2 duration-300`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${colorClass} ${
                person === "A" ? "rounded-bl-none" : person === "B" ? "rounded-br-none" : "rounded-b-none"
              } transform hover:scale-105 transition-all duration-200`}
            >
              <div className="text-xs font-bold mb-1 opacity-90">
                {person === "A" ? "Person A 😎🎭" : person === "B" ? "Person B 🤔💭" : "Person C 😏🎪"}
              </div>
              <div className="text-sm font-medium leading-relaxed">{text}</div>
            </div>
          </div>
        )
      }

      return line.trim() ? (
        <div
          key={index}
          className="text-center text-gray-600 text-sm italic mb-3 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto max-w-fit shadow-sm"
        >
          {line} ✨
        </div>
      ) : null
    })
  }

  const loadingMessages = [
    "Cooking up some comedy gold... 👨‍🍳✨🔥",
    "Consulting the meme gods... 🙏💫🎭",
    "Generating peak entertainment... 🎭🔥⚡",
    "Creating viral content... 📱💀🚀",
    "Brewing the perfect chaos... ⚡😈🌪️",
    "Summoning the comedy spirits... 👻😂✨",
    "Mixing humor with pure chaos... 🧪🤪💥",
    "Crafting legendary dialogues... 🏆📜✨",
  ]

  const currentLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-20"></div>

      {/* Simple pattern background without SVG */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse"></div>
      </div>

      {/* Floating animated emojis */}
      <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-20">😂</div>
      <div className="absolute top-20 right-20 text-5xl animate-pulse opacity-20">💀</div>
      <div className="absolute bottom-20 left-20 text-7xl animate-spin opacity-20" style={{ animationDuration: "10s" }}>
        🎭
      </div>
      <div className="absolute bottom-10 right-10 text-6xl animate-bounce opacity-20" style={{ animationDelay: "1s" }}>
        🔥
      </div>
      <div className="absolute top-1/2 left-1/4 text-4xl animate-pulse opacity-10" style={{ animationDelay: "2s" }}>
        ✨
      </div>
      <div className="absolute top-1/3 right-1/3 text-5xl animate-bounce opacity-10" style={{ animationDelay: "3s" }}>
        🚀
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4 animate-in slide-in-from-top duration-1000">
              <MessageCircle className="text-purple-600 animate-pulse" />
              AI Meme Dialogue Generator
              <Zap className="text-yellow-500 animate-bounce" />
            </h1>
            <p className="text-gray-700 text-2xl mb-3 font-semibold">
              Turn ANY situation into VIRAL-worthy conversations! 🔥💀✨
            </p>
            <p className="text-purple-700 font-bold text-lg">🎭 Where chaos meets comedy meets pure GENIUS! 🧠💎</p>
            <p className="text-sm text-gray-600 mt-4 bg-white/80 rounded-full px-4 py-2 inline-block shadow-sm">
              💡 Add your OPENAI_API_KEY for next-level AI comedy generation 🤖⚡
            </p>
          </div>

          {/* Enhanced Input Section */}
          <Card className="mb-8 border-4 border-purple-300 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-2xl font-bold">What's the tea? Spill the situation! ☕🫖✨</CardTitle>
                <div className="flex gap-3">
                  <DialogueStyleDialog settings={settings} onSettingsChange={setSettings} />
                  <DialogueHistoryDialog onRegenerateFromHistory={handleRegenerateFromHistory} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex gap-4 flex-col sm:flex-row">
                <Input
                  placeholder="e.g., 'when your crush likes your Instagram story from 2019 💀', 'explaining TikTok to your parents 👴👵', 'when autocorrect changes your professional email 📧💥'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                  className="flex-1 text-lg p-6 border-3 border-purple-300 focus:border-purple-600 rounded-2xl bg-white shadow-inner"
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !description.trim()}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Creating Magic... ✨🎭
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate Comedy! 🚀😂
                    </>
                  )}
                </Button>
              </div>

              {/* Enhanced example prompts with more emojis */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="text-lg text-gray-700 font-bold bg-gradient-to-r from-yellow-200 to-orange-200 px-3 py-1 rounded-full">
                    🔥 Trending situations:
                  </span>
                  {[
                    "when your crush likes your story from 2019 💀👀",
                    "explaining TikTok to your parents 👴👵📱",
                    "when autocorrect ruins your professional email 📧💥😅",
                    "trying to look busy when the boss walks by 👀💼🏃‍♂️",
                    "when Netflix asks if you're still watching 📺😴🍿",
                    "group project where you do all the work 📚😤👥",
                  ].map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setDescription(example)}
                      disabled={isGenerating}
                      className="text-sm hover:bg-purple-100 hover:border-purple-400 transition-all duration-200 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                    >
                      {example}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="text-lg text-gray-700 font-bold bg-gradient-to-r from-red-200 to-pink-200 px-3 py-1 rounded-full">
                    💀 Classic chaos:
                  </span>
                  {[
                    "when you accidentally unmute during a meeting 🎤😱💼",
                    "trying to adult but failing spectacularly 🤡💸🏠",
                    "when your phone dies at 1% battery 📱⚡💀",
                    "explaining your job to relatives at dinner 🍽️🤔💭",
                    "when you realize it's Monday morning 📅😵‍💫☕",
                    "trying to be healthy but pizza exists 🥗🍕😈",
                  ].map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setDescription(example)}
                      disabled={isGenerating}
                      className="text-sm hover:bg-pink-100 hover:border-pink-400 transition-all duration-200 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Generated Dialogue Display */}
          {(isGenerating || generatedDialogue) && (
            <Card className="border-4 border-blue-300 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-8">
                      <Loader2 className="w-20 h-20 animate-spin text-purple-600" />
                      <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-3 -right-3 animate-pulse" />
                      <div className="absolute -bottom-3 -left-3 text-2xl animate-bounce">🎭</div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mb-3">{currentLoadingMessage}</p>
                    <p className="text-lg text-gray-600">Crafting the perfect comedic timing... ⏰✨🎪</p>
                    <div className="mt-6 flex space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                ) : generatedDialogue ? (
                  <div className="space-y-8">
                    {/* Enhanced chat-style dialogue display */}
                    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl p-8 min-h-[350px] border-3 border-blue-200 shadow-inner">
                      <div className="text-center mb-8 p-4 bg-white rounded-2xl shadow-lg border-2 border-purple-200">
                        <p className="text-lg text-gray-700 font-bold">
                          <span className="text-purple-700 font-black text-xl">🎭 Situation:</span> {description} ✨
                        </p>
                      </div>
                      <div className="space-y-4">{formatDialogue(generatedDialogue)}</div>
                    </div>

                    {dialogueData && (
                      <div className="text-center space-y-3 p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl border-2 border-purple-200 shadow-lg">
                        <p className="text-lg text-gray-800 font-bold">
                          <span className="text-purple-800 font-black">🎨 Style:</span> {dialogueData.style} 🎭 •
                          <span className="text-purple-800 font-black ml-3">👥 Characters:</span>{" "}
                          {dialogueData.characters?.length || 2} 🎪 •
                          <span className="text-purple-800 font-black ml-3">✨ Vibe:</span> Absolutely ICONIC! 👑💎🔥
                        </p>
                      </div>
                    )}

                    <div className="flex justify-center gap-4 flex-wrap">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-3 border-blue-300 text-lg px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Copy className="w-5 h-5 mr-2" />
                        Copy This Gold 💎📋
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="bg-white hover:bg-purple-50 border-3 border-purple-300 text-lg px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share the Chaos 🌪️📢
                      </Button>
                      <Button
                        onClick={handleGenerate}
                        variant="outline"
                        className="bg-white hover:bg-green-50 border-3 border-green-300 text-lg px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        More Comedy! 🎭🔄
                      </Button>
                      <Button
                        onClick={() => {
                          setGeneratedDialogue(null)
                          setDialogueData(null)
                          setDescription("")
                        }}
                        variant="outline"
                        className="bg-white hover:bg-pink-50 border-3 border-pink-300 text-lg px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        New Situation 🆕✨
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Footer */}
          <div className="text-center mt-16 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-purple-200">
              <p className="text-gray-700 font-bold text-xl">✨ Powered by AI & Pure Comedic Genius ✨</p>
              <p className="text-lg text-gray-600 mt-2">Create • Share • Break the Internet! 🌍💥🚀</p>
              <div className="flex justify-center space-x-6 mt-6">
                <span className="text-4xl animate-bounce">😂</span>
                <span className="text-4xl animate-pulse">💀</span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>
                  🔥
                </span>
                <span className="text-4xl animate-pulse" style={{ animationDelay: "1s" }}>
                  ✨
                </span>
                <span className="text-4xl animate-bounce" style={{ animationDelay: "1.5s" }}>
                  🎭
                </span>
                <span className="text-4xl animate-pulse" style={{ animationDelay: "2s" }}>
                  🚀
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
