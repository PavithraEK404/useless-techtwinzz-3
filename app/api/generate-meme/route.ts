import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { selectMemeTemplate } from "./selectMemeTemplate" // Import the selectMemeTemplate function

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const AI_ENABLED = !!OPENAI_API_KEY

// Meme templates with their characteristics
const MEME_TEMPLATES = [
  {
    id: "drake",
    name: "Drake Pointing",
    url: "/memes/drake.png",
    type: "choice", // for rejecting vs approving
    topTextArea: { x: 200, y: 50, width: 300, height: 150 },
    bottomTextArea: { x: 200, y: 250, width: 300, height: 150 },
  },
  {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend",
    url: "/memes/distracted-boyfriend.jpg",
    type: "temptation", // for being distracted by something new
    topTextArea: { x: 50, y: 20, width: 500, height: 60 },
    bottomTextArea: { x: 50, y: 320, width: 500, height: 60 },
  },
  {
    id: "woman-yelling-cat",
    name: "Woman Yelling at Cat",
    url: "/memes/woman-yelling-cat.jpg",
    type: "argument", // for disagreements or confusion
    topTextArea: { x: 50, y: 20, width: 500, height: 60 },
    bottomTextArea: { x: 50, y: 320, width: 500, height: 60 },
  },
  {
    id: "this-is-fine",
    name: "This is Fine",
    url: "/memes/this-is-fine.jpg",
    type: "disaster", // for everything falling apart but staying calm
    topTextArea: { x: 50, y: 20, width: 400, height: 60 },
    bottomTextArea: { x: 50, y: 280, width: 400, height: 60 },
  },
  {
    id: "expanding-brain",
    name: "Expanding Brain",
    url: "/memes/expanding-brain.jpg",
    type: "evolution", // for showing progression of ideas
    topTextArea: { x: 200, y: 50, width: 300, height: 80 },
    bottomTextArea: { x: 200, y: 450, width: 300, height: 80 },
  },
  {
    id: "two-buttons",
    name: "Two Buttons",
    url: "/memes/two-buttons.jpg",
    type: "difficult-choice", // for hard decisions
    topTextArea: { x: 50, y: 20, width: 400, height: 60 },
    bottomTextArea: { x: 50, y: 320, width: 400, height: 60 },
  },
  {
    id: "change-my-mind",
    name: "Change My Mind",
    url: "/memes/change-my-mind.jpg",
    type: "opinion", // for controversial statements
    topTextArea: { x: 50, y: 20, width: 500, height: 60 },
    bottomTextArea: { x: 50, y: 320, width: 500, height: 60 },
  },
  {
    id: "surprised-pikachu",
    name: "Surprised Pikachu",
    url: "/memes/surprised-pikachu.png",
    type: "surprise", // for unexpected consequences
    topTextArea: { x: 50, y: 20, width: 400, height: 60 },
    bottomTextArea: { x: 50, y: 280, width: 400, height: 60 },
  },
]

async function generateMemeCaption(description: string) {
  // If no OpenAI API key, use rule-based caption generation
  if (!AI_ENABLED) {
    return generateFallbackCaption(description)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a meme caption generator. Given a description, create funny and relatable meme text.
      
      Rules:
      1. Generate exactly two lines: TOP TEXT and BOTTOM TEXT
      2. Keep each line under 50 characters
      3. Use ALL CAPS for traditional meme style
      4. Make it funny, relatable, and internet-culture appropriate
      5. Format your response as: "TOP: [text]|BOTTOM: [text]"
      
      Examples:
      - "TOP: WHEN YOU FIX A BUG|BOTTOM: BUT CREATE THREE MORE"
      - "TOP: ME: I'LL JUST CHECK ONE THING|BOTTOM: 3 HOURS LATER..."
      - "TOP: DOCUMENTATION|BOTTOM: WE DON'T DO THAT HERE"`,
      prompt: `Create a meme caption for: "${description}"`,
    })

    const parts = text.split("|")
    if (parts.length !== 2) {
      throw new Error("Invalid caption format")
    }

    const topText = parts[0].replace("TOP:", "").trim()
    const bottomText = parts[1].replace("BOTTOM:", "").trim()

    return { topText, bottomText }
  } catch (error) {
    console.error("Error generating caption with AI:", error)
    // Fallback to rule-based generation
    return generateFallbackCaption(description)
  }
}

function generateFallbackCaption(description: string) {
  const lowerDesc = description.toLowerCase()

  // Rule-based caption generation based on common patterns
  const patterns = [
    {
      keywords: ["when", "fix", "bug", "code"],
      top: "WHEN YOU FIX A BUG",
      bottom: "BUT CREATE THREE MORE",
    },
    {
      keywords: ["monday", "morning", "work"],
      top: "MONDAY MORNING",
      bottom: "HERE WE GO AGAIN",
    },
    {
      keywords: ["test", "pass", "work"],
      top: "WHEN ALL TESTS PASS",
      bottom: "ON THE FIRST TRY",
    },
    {
      keywords: ["documentation", "doc", "readme"],
      top: "DOCUMENTATION",
      bottom: "WE DON'T DO THAT HERE",
    },
    {
      keywords: ["deploy", "production", "friday"],
      top: "DEPLOYING ON FRIDAY",
      bottom: "WHAT COULD GO WRONG?",
    },
    {
      keywords: ["coffee", "morning", "wake"],
      top: "ME BEFORE COFFEE",
      bottom: "ME AFTER COFFEE",
    },
    {
      keywords: ["meeting", "could", "email"],
      top: "THIS MEETING",
      bottom: "COULD HAVE BEEN AN EMAIL",
    },
    {
      keywords: ["internet", "down", "wifi"],
      top: "WHEN THE INTERNET IS DOWN",
      bottom: "GUESS I'LL BE PRODUCTIVE",
    },
  ]

  // Find matching pattern
  for (const pattern of patterns) {
    if (pattern.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return {
        topText: pattern.top,
        bottomText: pattern.bottom,
      }
    }
  }

  // Generic fallback based on description
  const words = description.split(" ")
  const firstPart = words.slice(0, Math.ceil(words.length / 2)).join(" ")
  const secondPart = words.slice(Math.ceil(words.length / 2)).join(" ")

  return {
    topText: firstPart.toUpperCase().substring(0, 50),
    bottomText: secondPart.toUpperCase().substring(0, 50) || "THAT'S HOW IT IS",
  }
}

async function createMemeImage(template: any, topText: string, bottomText: string) {
  // In a real implementation, you would use Canvas API or image processing library
  // For this demo, we'll return a placeholder with the template and text info
  const encodedTop = encodeURIComponent(topText)
  const encodedBottom = encodeURIComponent(bottomText)
  const encodedTemplate = encodeURIComponent(template.name)

  return `/placeholder.svg?height=400&width=600&query=Meme: ${encodedTemplate} with top text "${encodedTop}" and bottom text "${encodedBottom}"`
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    // Generate meme caption (with AI or fallback)
    const { topText, bottomText } = await generateMemeCaption(description)

    // Select appropriate meme template
    const template = selectMemeTemplate(description)

    // Create the meme image (placeholder implementation)
    const imageUrl = await createMemeImage(template, topText, bottomText)

    return NextResponse.json({
      imageUrl,
      memeData: {
        topText,
        bottomText,
        template: template.name,
      },
      aiEnabled: AI_ENABLED, // Let frontend know if AI was used
    })
  } catch (error) {
    console.error("Error in meme generation:", error)
    return NextResponse.json({ error: "Failed to generate meme" }, { status: 500 })
  }
}
