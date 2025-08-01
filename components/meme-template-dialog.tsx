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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Sparkles } from "lucide-react"

const MEME_TEMPLATES = [
  {
    id: "drake",
    name: "Drake Pointing",
    description: "Perfect for showing preferences - rejecting one thing and approving another",
    type: "Choice/Preference",
    example: "Old code vs New framework",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    description: "Great for temptation scenarios - being distracted by something new",
    type: "Temptation/Distraction",
    example: "Me looking at new tech while current project waits",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "woman-yelling-cat",
    name: "Woman Yelling at Cat",
    description: "Ideal for arguments, disagreements, or confusion",
    type: "Argument/Confusion",
    example: "Designer vs Developer expectations",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "this-is-fine",
    name: "This is Fine",
    description: "When everything is falling apart but you stay calm",
    type: "Disaster/Calm",
    example: "Production is down but I'm drinking coffee",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    description: "Shows evolution of ideas from simple to complex",
    type: "Evolution/Progress",
    example: "Basic HTML → React → Next.js → Full Stack",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    description: "Perfect for difficult choices or dilemmas",
    type: "Difficult Choice",
    example: "Sleep vs Code more",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    description: "For controversial statements or strong opinions",
    type: "Opinion/Statement",
    example: "Tabs are better than spaces",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: "surprised-pikachu",
    name: "Surprised Pikachu",
    description: "For unexpected consequences or obvious outcomes",
    type: "Surprise/Consequence",
    example: "When you skip tests and production breaks",
    color: "bg-pink-100 text-pink-800",
  },
]

interface MemeTemplateDialogProps {
  onTemplateSelect?: (template: any) => void
}

export function MemeTemplateDialog({ onTemplateSelect }: MemeTemplateDialogProps) {
  const [open, setOpen] = useState(false)

  const handleTemplateSelect = (template: any) => {
    onTemplateSelect?.(template)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Browse Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Meme Templates
          </DialogTitle>
          <DialogDescription>
            Choose from popular meme formats. Each template is automatically selected based on your description, but you
            can browse them here.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {MEME_TEMPLATES.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <Badge className={template.color}>{template.type}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 mb-3">
                  <strong>Example:</strong> {template.example}
                </div>
                <Button size="sm" className="w-full" onClick={() => handleTemplateSelect(template)}>
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
