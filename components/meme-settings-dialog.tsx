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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Settings, Type, Zap } from "lucide-react"

interface MemeSettingsDialogProps {
  settings: {
    fontSize: number
    fontColor: string
    strokeWidth: number
    useAI: boolean
    customPrompt: string
  }
  onSettingsChange: (settings: any) => void
}

export function MemeSettingsDialog({ settings, onSettingsChange }: MemeSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    setOpen(false)
  }

  const handleReset = () => {
    const defaultSettings = {
      fontSize: 36,
      fontColor: "#FFFFFF",
      strokeWidth: 3,
      useAI: true,
      customPrompt: "",
    }
    setLocalSettings(defaultSettings)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Meme Settings
          </DialogTitle>
          <DialogDescription>Customize how your memes are generated and styled.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Text Styling */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label className="text-sm font-medium">Text Styling</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fontSize" className="text-xs">
                  Font Size
                </Label>
                <Input
                  id="fontSize"
                  type="number"
                  min="20"
                  max="60"
                  value={localSettings.fontSize}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      fontSize: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="strokeWidth" className="text-xs">
                  Stroke Width
                </Label>
                <Input
                  id="strokeWidth"
                  type="number"
                  min="1"
                  max="8"
                  value={localSettings.strokeWidth}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      strokeWidth: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fontColor" className="text-xs">
                Text Color
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="fontColor"
                  type="color"
                  value={localSettings.fontColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      fontColor: e.target.value,
                    })
                  }
                  className="w-16 h-8 p-1"
                />
                <Input
                  type="text"
                  value={localSettings.fontColor}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      fontColor: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <Label className="text-sm font-medium">AI Generation</Label>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="useAI" className="text-xs">
                Use AI for captions
              </Label>
              <Switch
                id="useAI"
                checked={localSettings.useAI}
                onCheckedChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    useAI: checked,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="customPrompt" className="text-xs">
                Custom AI Prompt (Optional)
              </Label>
              <Textarea
                id="customPrompt"
                placeholder="Add custom instructions for AI caption generation..."
                value={localSettings.customPrompt}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    customPrompt: e.target.value,
                  })
                }
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
            Reset
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
