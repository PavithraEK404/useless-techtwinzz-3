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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Palette, Zap, Users, Smile } from "lucide-react"

interface DialogueStyleDialogProps {
  settings: {
    style: string
    tone: string
    characters: number
    useEmojis: boolean
  }
  onSettingsChange: (settings: any) => void
}

export function DialogueStyleDialog({ settings, onSettingsChange }: DialogueStyleDialogProps) {
  const [open, setOpen] = useState(false)

  const styles = [
    { id: "funny", name: "Funny", emoji: "😂", description: "Classic humor and jokes" },
    { id: "sarcastic", name: "Sarcastic", emoji: "😏", description: "Witty and sassy responses" },
    { id: "wholesome", name: "Wholesome", emoji: "🥰", description: "Sweet and heartwarming" },
    { id: "dramatic", name: "Dramatic", emoji: "🎭", description: "Over-the-top reactions" },
    { id: "relatable", name: "Relatable", emoji: "😅", description: "Everyday struggles" },
    { id: "chaotic", name: "Chaotic", emoji: "🤪", description: "Pure unhinged energy" },
  ]

  const tones = [
    { id: "subtle", name: "Subtle", emoji: "✨", description: "Light and gentle humor" },
    { id: "moderate", name: "Moderate", emoji: "🔥", description: "Balanced comedy level" },
    { id: "exaggerated", name: "Exaggerated", emoji: "💀", description: "Maximum chaos mode" },
  ]

  const handleStyleChange = (styleId: string) => {
    onSettingsChange({ ...settings, style: styleId })
  }

  const handleToneChange = (toneId: string) => {
    onSettingsChange({ ...settings, tone: toneId })
  }

  const handleCharacterChange = (value: number[]) => {
    onSettingsChange({ ...settings, characters: value[0] })
  }

  const handleEmojiToggle = (checked: boolean) => {
    onSettingsChange({ ...settings, useEmojis: checked })
  }

  const resetSettings = () => {
    onSettingsChange({
      style: "funny",
      tone: "exaggerated",
      characters: 2,
      useEmojis: true,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 font-bold px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Palette className="w-5 h-5 mr-2" />
          Customize Vibes 🎨✨
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-purple-800 flex items-center justify-center gap-3">
            <Settings className="text-purple-600" />
            Customize Your Comedy Vibes! 🎭✨
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-700 font-medium">
            Fine-tune your dialogue generation for maximum chaos and comedy! 🚀💀
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 p-6">
          {/* Comedy Style Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smile className="text-purple-600" />
              <Label className="text-xl font-bold text-purple-800">Comedy Style 🎨</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <Button
                  key={style.id}
                  variant={settings.style === style.id ? "default" : "outline"}
                  onClick={() => handleStyleChange(style.id)}
                  className={`p-4 h-auto flex flex-col items-center gap-2 rounded-2xl transition-all duration-200 ${
                    settings.style === style.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                      : "hover:bg-purple-100 hover:border-purple-400 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="font-bold">{style.name}</span>
                  <span className="text-xs text-center opacity-80">{style.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chaos Level */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-600" />
              <Label className="text-xl font-bold text-purple-800">Chaos Level ⚡</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {tones.map((tone) => (
                <Button
                  key={tone.id}
                  variant={settings.tone === tone.id ? "default" : "outline"}
                  onClick={() => handleToneChange(tone.id)}
                  className={`p-4 h-auto flex flex-col items-center gap-2 rounded-2xl transition-all duration-200 ${
                    settings.tone === tone.id
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                      : "hover:bg-yellow-100 hover:border-yellow-400 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl">{tone.emoji}</span>
                  <span className="font-bold">{tone.name}</span>
                  <span className="text-xs text-center opacity-80">{tone.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Character Count */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" />
              <Label className="text-xl font-bold text-purple-800">Characters in Dialogue 👥</Label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Number of Characters:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-blue-100 text-blue-800">
                  {settings.characters} {settings.characters === 1 ? "person" : "people"} 🎪
                </Badge>
              </div>
              <Slider
                value={[settings.characters]}
                onValueChange={handleCharacterChange}
                max={4}
                min={2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>2 (Classic) 💬</span>
                <span>3 (Trio) 🎭</span>
                <span>4 (Chaos) 🎪</span>
              </div>
            </div>
          </div>

          {/* Emoji Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-purple-200 shadow-sm">
              <div className="space-y-1">
                <Label className="text-lg font-bold text-purple-800">Extra Emojis 🎉</Label>
                <p className="text-sm text-gray-600">Add more emojis for maximum chaos and fun!</p>
              </div>
              <Switch checked={settings.useEmojis} onCheckedChange={handleEmojiToggle} className="scale-125" />
            </div>
          </div>

          {/* Current Settings Preview */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
            <h4 className="font-bold text-purple-800 mb-2 text-center">Current Vibe Check ✨</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-purple-600 text-white px-3 py-1">
                {styles.find((s) => s.id === settings.style)?.emoji} {styles.find((s) => s.id === settings.style)?.name}
              </Badge>
              <Badge className="bg-yellow-600 text-white px-3 py-1">
                {tones.find((t) => t.id === settings.tone)?.emoji} {tones.find((t) => t.id === settings.tone)?.name}
              </Badge>
              <Badge className="bg-blue-600 text-white px-3 py-1">👥 {settings.characters} Characters</Badge>
              <Badge className="bg-green-600 text-white px-3 py-1">
                {settings.useEmojis ? "🎉 Extra Emojis" : "📝 Text Only"}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={resetSettings}
              variant="outline"
              className="px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-200 bg-transparent"
            >
              Reset to Default 🔄
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Apply Settings ✨🚀
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
