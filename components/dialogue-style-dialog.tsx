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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Palette, Zap, Users, Smile } from "lucide-react"

interface DialogueStyleProps {
  dialogueStyle: {
    style: string
    chaosLevel: string
    characterCount: number
    extraEmojis: boolean
  }
  setDialogueStyle: (style: any) => void
}

const comedyStyles = [
  { id: "funny", name: "Funny", emoji: "😂", description: "Classic humor and jokes" },
  { id: "sarcastic", name: "Sarcastic", emoji: "😏", description: "Witty and sarcastic remarks" },
  { id: "wholesome", name: "Wholesome", emoji: "🥰", description: "Sweet and heartwarming" },
  { id: "dramatic", name: "Dramatic", emoji: "🎭", description: "Over-the-top reactions" },
  { id: "relatable", name: "Relatable", emoji: "😅", description: "Everyday struggles" },
  { id: "chaotic", name: "Chaotic", emoji: "🤪", description: "Pure unhinged energy" },
]

const chaosLevels = [
  { id: "subtle", name: "Subtle", emoji: "✨", description: "Gentle humor" },
  { id: "moderate", name: "Moderate", emoji: "🔥", description: "Balanced chaos" },
  { id: "maximum", name: "Maximum", emoji: "💀", description: "Absolute mayhem" },
]

export function DialogueStyleDialog({ dialogueStyle, setDialogueStyle }: DialogueStyleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStyleChange = (field: string, value: any) => {
    setDialogueStyle({
      ...dialogueStyle,
      [field]: value,
    })
  }

  const currentStyle = comedyStyles.find((s) => s.id === dialogueStyle.style)
  const currentChaos = chaosLevels.find((c) => c.id === dialogueStyle.chaosLevel)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-yellow-200 to-orange-200 hover:from-yellow-300 hover:to-orange-300 border-2 border-yellow-300 text-gray-800 font-bold shadow-lg hover-scale"
        >
          <Settings className="w-4 h-4 mr-2" />
          Customize Vibes 🎨✨
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md backdrop-blur-glass border-2 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Palette className="text-purple-500" />
            Customize Your Comedy Style 🎭✨
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Fine-tune your dialogue generation for maximum chaos! 🌪️💫
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Comedy Style Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Comedy Style 🎪
            </Label>
            <RadioGroup
              value={dialogueStyle.style}
              onValueChange={(value) => handleStyleChange("style", value)}
              className="grid grid-cols-2 gap-2"
            >
              {comedyStyles.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={style.id} id={style.id} />
                  <Label
                    htmlFor={style.id}
                    className="flex items-center gap-1 text-sm cursor-pointer hover:text-purple-600"
                  >
                    <span>{style.emoji}</span>
                    {style.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {currentStyle && (
              <Badge variant="secondary" className="w-full justify-center py-2">
                {currentStyle.emoji} {currentStyle.description}
              </Badge>
            )}
          </div>

          {/* Chaos Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Chaos Level 🌪️
            </Label>
            <RadioGroup
              value={dialogueStyle.chaosLevel}
              onValueChange={(value) => handleStyleChange("chaosLevel", value)}
              className="flex justify-between"
            >
              {chaosLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.id} id={level.id} />
                  <Label
                    htmlFor={level.id}
                    className="flex items-center gap-1 text-sm cursor-pointer hover:text-purple-600"
                  >
                    <span>{level.emoji}</span>
                    {level.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {currentChaos && (
              <Badge variant="secondary" className="w-full justify-center py-2">
                {currentChaos.emoji} {currentChaos.description}
              </Badge>
            )}
          </div>

          {/* Character Count */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Characters: {dialogueStyle.characterCount} 👥
            </Label>
            <Slider
              value={[dialogueStyle.characterCount]}
              onValueChange={(value) => handleStyleChange("characterCount", value[0])}
              max={4}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>2 (Classic)</span>
              <span>3 (Trio)</span>
              <span>4 (Chaos)</span>
            </div>
          </div>

          {/* Extra Emojis Toggle */}
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Extra Emojis 🎉</Label>
              <p className="text-sm text-gray-600">Add more emojis for maximum fun!</p>
            </div>
            <Switch
              checked={dialogueStyle.extraEmojis}
              onCheckedChange={(checked) => handleStyleChange("extraEmojis", checked)}
            />
          </div>

          {/* Current Settings Preview */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border-2 border-purple-200">
            <h4 className="font-semibold text-center mb-2">Current Settings 🎯</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-purple-500 text-white">
                {currentStyle?.emoji} {currentStyle?.name}
              </Badge>
              <Badge className="bg-pink-500 text-white">
                {currentChaos?.emoji} {currentChaos?.name}
              </Badge>
              <Badge className="bg-blue-500 text-white">👥 {dialogueStyle.characterCount} chars</Badge>
              <Badge className="bg-green-500 text-white">
                {dialogueStyle.extraEmojis ? "🎉 Extra Emojis" : "✨ Standard"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
