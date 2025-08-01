"use client"

import { useEffect, useRef } from "react"

interface MemeCanvasProps {
  template: {
    url: string
    topTextArea: { x: number; y: number; width: number; height: number }
    bottomTextArea: { x: number; y: number; width: number; height: number }
  }
  topText: string
  bottomText: string
  onImageGenerated: (dataUrl: string) => void
}

export function MemeCanvas({ template, topText, bottomText, onImageGenerated }: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the template image
      ctx.drawImage(img, 0, 0)

      // Set text style for meme text
      ctx.fillStyle = "white"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 3
      ctx.font = "bold 36px Impact, Arial Black, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Function to wrap text if it's too long
      const wrapText = (text: string, x: number, y: number, maxWidth: number) => {
        const words = text.split(" ")
        let line = ""
        const lines = []

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " "
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width

          if (testWidth > maxWidth && n > 0) {
            lines.push(line)
            line = words[n] + " "
          } else {
            line = testLine
          }
        }
        lines.push(line)

        // Draw each line
        const lineHeight = 40
        const startY = y - ((lines.length - 1) * lineHeight) / 2

        lines.forEach((line, index) => {
          const lineY = startY + index * lineHeight
          // Draw stroke (outline)
          ctx.strokeText(line.trim(), x, lineY)
          // Draw fill (main text)
          ctx.fillText(line.trim(), x, lineY)
        })
      }

      // Draw top text
      if (topText) {
        const topX = template.topTextArea.x + template.topTextArea.width / 2
        const topY = template.topTextArea.y + template.topTextArea.height / 2
        wrapText(topText.toUpperCase(), topX, topY, template.topTextArea.width - 20)
      }

      // Draw bottom text
      if (bottomText) {
        const bottomX = template.bottomTextArea.x + template.bottomTextArea.width / 2
        const bottomY = template.bottomTextArea.y + template.bottomTextArea.height / 2
        wrapText(bottomText.toUpperCase(), bottomX, bottomY, template.bottomTextArea.width - 20)
      }

      // Convert to data URL and call callback
      const dataUrl = canvas.toDataURL("image/png", 0.9)
      onImageGenerated(dataUrl)
    }

    img.onerror = () => {
      console.error("Failed to load meme template:", template.url)
      // Create a fallback colored rectangle
      canvas.width = 600
      canvas.height = 400
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(0, 0, 600, 400)

      // Add fallback text
      ctx.fillStyle = "#6b7280"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Meme Template", 300, 200)

      const dataUrl = canvas.toDataURL("image/png")
      onImageGenerated(dataUrl)
    }

    img.src = template.url
  }, [template, topText, bottomText, onImageGenerated])

  return <canvas ref={canvasRef} style={{ display: "none" }} />
}
