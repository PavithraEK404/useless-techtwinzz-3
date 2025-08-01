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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Palette, Sparkles } from "lucide-react"

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
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    setOpen(false)
  }

  const handleReset = () => {
    const defaultSettings = {
      style: "funny",
      tone: "exaggerated",
      characters: 2,
      useEmojis: true,
    }
    setLocalSettings(defaultSettings)
  }

  const styles = [
    {
      value: "funny",
      label: "Funny 😂",
      description: "Peak comedy with perfect timing",
      emoji: "😂",
    },
    {
      value: "sarcastic",
      label: "Sarcastic 😏",
      description: "Savage wit and cutting humor",
      emoji: "😏",
    },
    {
      value: "wholesome",
      label: "Wholesome 🥰",
      description: "Heartwarming but still hilarious",
      emoji: "🥰",
    },
    {
      value: "dramatic",
      label: "Dramatic 🎭",
      description: "Shakespeare meets reality TV",
      emoji: "🎭",
    },
    {
      value: "relatable",
      label: "Relatable 💯",
      description: "So real it hurts (in a good way)",
      emoji: "💯",
    },
  ]

  const tones = [
    {
      value: "subtle",
      label: "Subtle ✨",
      description: "Clever and understated",
      emoji: "✨",
    },
    {
      value: "moderate",
      label: "Moderate 🎯",
      description: "Perfect balance of chaos",
      emoji: "🎯",
    },
    {
      value: "exaggerated",
      label: "MAXIMUM CHAOS 🔥",
      description: "Absolutely unhinged energy",
      emoji: "🔥",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white hover:bg-purple-50 border-purple-200">
          <Palette className="w-4 h-4 mr-2" />
          Customize Vibes ✨
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Dialogue Style Settings
          </DialogTitle>
          <DialogDescription className="text-purple-700">
            Customize your comedy experience! Make it YOUR vibe ✨
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Enhanced Style Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-purple-800">Comedy Style 🎭</Label>
            <Select
              value={localSettings.style}
              onValueChange={(value) => setLocalSettings({ ...localSettings, style: value })}
            >
              <SelectTrigger className="border-2 border-purple-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{style.emoji}</span>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-gray-600">{style.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Tone Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-purple-800">Chaos Level 🌪️</Label>
            <Select
              value={localSettings.tone}
              onValueChange={(value) => setLocalSettings({ ...localSettings, tone: value })}
            >
              <SelectTrigger className="border-2 border-purple-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tone.emoji}</span>
                      <div>
                        <div className="font-medium">{tone.label}</div>
                        <div className="text-xs text-gray-600">{tone.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Character Count */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-purple-800">
              Cast Size: {localSettings.characters}{" "}
              {localSettings.characters === 2 ? "👥" : localSettings.characters === 3 ? "👥👤" : "👥👥"}
            </Label>
            <Slider
              value={[localSettings.characters]}
              onValueChange={(value) => setLocalSettings({ ...localSettings, characters: value[0] })}
              min={2}
              max={4}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-700 font-medium">
              <span>2 (Classic Duo)</span>
              <span>3 (Chaos Trio)</span>
              <span>4 (Full Squad)</span>
            </div>
          </div>

          {/* Enhanced Emoji Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-purple-200">
            <div>
              <Label htmlFor="useEmojis" className="text-sm font-bold text-purple-800">
                Emoji Power 🚀
              </Label>
              <p className="text-xs text-purple-600">Add emojis for maximum impact and expressiveness</p>
            </div>
            <Switch
              id="useEmojis"
              checked={localSettings.useEmojis}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, useEmojis: checked })}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200"
          >
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
          >
            Save My Vibe! ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
