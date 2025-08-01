"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MemeCanvas } from "@/components/meme-canvas"

const SAMPLE_TEMPLATES = [
  {
    id: "drake",
    name: "Drake Pointing",
    url: "/memes/drake.png",
    topTextArea: { x: 200, y: 50, width: 300, height: 150 },
    bottomTextArea: { x: 200, y: 250, width: 300, height: 150 },
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    url: "/memes/distracted-boyfriend.jpg",
    topTextArea: { x: 50, y: 20, width: 500, height: 60 },
    bottomTextArea: { x: 50, y: 320, width: 500, height: 60 },
  },
]

export default function MemePreview() {
  const [currentTemplate, setCurrentTemplate] = useState(SAMPLE_TEMPLATES[0])
  const [topText, setTopText] = useState("OLD BORING CODE")
  const [bottomText, setBottomText] = useState("SHINY NEW FRAMEWORK")
  const [generatedImage, setGeneratedImage] = useState<string>("")

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Meme Template Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Top Text</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bottom Text</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {SAMPLE_TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  variant={currentTemplate.id === template.id ? "default" : "outline"}
                  onClick={() => setCurrentTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>

            {generatedImage && (
              <div className="flex justify-center">
                <img src={generatedImage || "/placeholder.svg"} alt="Generated meme" className="max-w-full h-auto" />
              </div>
            )}

            <MemeCanvas
              template={currentTemplate}
              topText={topText}
              bottomText={bottomText}
              onImageGenerated={setGeneratedImage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
