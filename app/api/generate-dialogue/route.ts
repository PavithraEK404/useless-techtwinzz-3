import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const AI_ENABLED = !!OPENAI_API_KEY

async function generateMemeDialogue(description: string, settings: any) {
  // If no OpenAI API key, use rule-based dialogue generation
  if (!AI_ENABLED) {
    return generateFallbackDialogue(description, settings)
  }

  try {
    const stylePrompts = {
      funny:
        "Create a HILARIOUS dialogue with perfect comedic timing, unexpected punchlines, and absurd reactions. Use internet slang, memes, and modern references.",
      sarcastic:
        "Make it devastatingly sarcastic with cutting wit, eye-rolling moments, and savage comebacks that would make Gordon Ramsay proud.",
      wholesome:
        "Create heartwarming dialogue that's still funny but makes you go 'aww' - like a golden retriever telling jokes.",
      dramatic:
        "Go FULL Shakespeare meets reality TV drama - over-the-top reactions, dramatic declarations, and theatrical breakdowns.",
      relatable:
        "Make it so relatable it hurts - the kind of dialogue that makes people go 'I FELT THAT' and screenshot it immediately.",
    }

    const toneAdjustments = {
      subtle: "Keep the humor clever and understated - like a British comedy",
      moderate: "Balance the humor - funny but not completely unhinged",
      exaggerated:
        "GO ABSOLUTELY WILD - maximum chaos, dramatic reactions, and complete over-the-top responses that break reality",
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are the ULTIMATE meme dialogue generator - a comedy genius who creates viral-worthy conversations that people screenshot and share immediately.

      COMEDY RULES:
      1. Use PERFECT comedic timing with setup → punchline structure
      2. Include internet culture, Gen Z/Millennial references, and current memes
      3. Add unexpected plot twists and absurd escalations
      4. Use modern slang: "no cap", "fr fr", "bestie", "periodt", "slay", "it's giving...", "main character energy"
      5. Include relatable struggles: adulting, social media, technology fails, existential dread
      6. Add dramatic pauses with "..." for comedic effect
      7. Use ALL CAPS for emphasis and dramatic reactions
      8. Include self-aware humor and meta-commentary
      9. Reference popular culture: Netflix shows, TikTok trends, Twitter drama
      10. End with unexpected wisdom or complete chaos

      FORMAT: Create ${settings.characters || 2}-${settings.characters + 1} characters having a conversation
      - Person A, Person B, (Person C if needed)
      - Each line should be quotable and shareable
      - Build up to a hilarious climax
      - ${settings.useEmojis ? "Use emojis strategically for maximum impact 🔥💀😭" : "No emojis but make it extra funny with words"}
      
      Style: ${stylePrompts[settings.style] || stylePrompts.funny}
      Tone: ${toneAdjustments[settings.tone] || toneAdjustments.exaggerated}
      
      VIRAL EXAMPLES:
      Person A: Bro I studied for 8 hours straight for this exam 📚
      Person B: That's some main character energy right there
      Person A: *checks email* ...It got postponed
      Person B: Your character development just got CANCELLED 💀
      Person A: I'm filing a complaint with the universe's customer service`,
      prompt: `Create the most HILARIOUS and ENGAGING meme dialogue for: "${description}". Make it so funny people will want to share it immediately!`,
    })

    return {
      dialogue: text.trim(),
      style: settings.style,
      characters: extractCharacters(text),
      aiGenerated: true,
    }
  } catch (error) {
    console.error("Error generating dialogue with AI:", error)
    // Fallback to rule-based generation
    return generateFallbackDialogue(description, settings)
  }
}

function extractCharacters(dialogue: string): string[] {
  const characters = new Set<string>()
  const lines = dialogue.split("\n")

  lines.forEach((line) => {
    const match = line.match(/^(Person [A-C]|[A-C]):/)
    if (match) {
      characters.add(match[1])
    }
  })

  return Array.from(characters)
}

function generateFallbackDialogue(description: string, settings: any) {
  const lowerDesc = description.toLowerCase()

  // Enhanced rule-based dialogue patterns with more humor
  const patterns = [
    {
      keywords: ["exam", "test", "postpone", "delay"],
      dialogue: `Person A: I pulled an all-nighter studying for this exam! My brain is FRIED 🧠
Person B: Bestie... check your email
Person A: *opens email* IT GOT POSTPONED?!
Person B: Your sacrifice has been rejected by the academic gods 💀
Person A: I'm about to have my villain origin story`,
    },
    {
      keywords: ["assignment", "deadline", "submit", "11:59"],
      dialogue: `Person A: SUBMITTED AT 11:59:59 PM! 🏃‍♂️💨
Person B: You really said "I choose violence" with that timing
Person A: I live for the ADRENALINE, the CHAOS, the—
Person B: The heart attack your professor just had? 💀
Person A: ...Worth it. Main character energy only 💅`,
    },
    {
      keywords: ["wifi", "internet", "down", "connection"],
      dialogue: `Person A: WiFi died during my MOST IMPORTANT video call 📡
Person B: Time to switch to mobile data!
Person A: *checks data usage* I've used 47GB this month...
Person B: RIP to your bank account 💸
Person A: Guess I'll just ✨disappear✨ from society now`,
    },
    {
      keywords: ["bug", "fix", "code", "programming"],
      dialogue: `Person A: I FIXED THE BUG! I'm basically a coding god now 🐛⚡
Person B: Slay bestie! How many new bugs did you accidentally create?
Person A: ...Let's not talk about that 👀
Person B: It's giving "one step forward, three steps back" energy
Person A: I'm in my debugging era and it's NOT cute 😭`,
    },
    {
      keywords: ["coffee", "morning", "wake"],
      dialogue: `Person A: I literally cannot function without coffee ☕
Person B: Bestie... it's 4 PM
Person A: Your point being? Coffee is a lifestyle, not a time
Person B: You're basically 80% caffeine at this point 💀
Person A: And I'm THRIVING. Don't fix what ain't broken ✨`,
    },
    {
      keywords: ["meeting", "email", "could"],
      dialogue: `Person A: This meeting could have been an email. PERIODT. 📧
Person B: But then how would we waste 2 hours of our lives?
Person A: You're right, where else would I practice my "interested face"? 😐
Person B: It's giving corporate theater vibes
Person A: I deserve an Oscar for my performance today 🏆`,
    },
    {
      keywords: ["friday", "deploy", "production"],
      dialogue: `Person A: Let's deploy to production on Friday! YOLO! 🚀
Person B: Are you trying to speedrun ruining our weekend?
Person A: I live for the CHAOS, the DRAMA, the—
Person B: The 3 AM emergency calls? 📞💀
Person A: ...Maybe Monday deployment hits different 👀`,
    },
    {
      keywords: ["monday", "morning", "work"],
      dialogue: `Person A: Monday morning again... why does time work like this? 😵‍💫
Person B: It's giving "Groundhog Day" but make it WORSE
Person A: I need a vacation from my vacation planning
Person B: That's some next-level procrastination energy 💀
Person A: I'm not procrastinating, I'm ✨strategically delaying✨`,
    },
    {
      keywords: ["social", "media", "post", "instagram"],
      dialogue: `Person A: I spent 2 hours editing this Instagram post 📸
Person B: For a picture of your LUNCH?
Person A: It's called ✨aesthetic✨ bestie, look it up
Person B: The sandwich doesn't need a whole photoshoot 💀
Person A: Every meal is a main character moment when you're ME`,
    },
    {
      keywords: ["netflix", "watch", "series", "binge"],
      dialogue: `Person A: I finished the entire series in one sitting 📺
Person B: That's like... 12 hours straight
Person A: I regret NOTHING. My couch and I are soulmates now
Person B: It's giving "no life" energy but make it cozy 💀
Person A: Don't judge my lifestyle choices, I'm THRIVING ✨`,
    },
  ]

  // Find matching pattern
  for (const pattern of patterns) {
    if (pattern.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return {
        dialogue: pattern.dialogue,
        style: settings.style,
        characters: extractCharacters(pattern.dialogue),
        aiGenerated: false,
      }
    }
  }

  // Enhanced generic fallback with more personality
  const situations = [
    `Person A: ${description}? That's some main character energy right there ✨
Person B: Bestie, that's not the flex you think it is 💀
Person A: I'm living my truth and it's CHAOTIC
Person B: Your truth needs better life choices 😭`,

    `Person A: So... ${description} happened to me today 🤡
Person B: It's giving "why does this always happen to ME" vibes
Person A: I'm the main character in a comedy show apparently
Person B: More like a reality TV disaster 💀
Person A: At least I'm entertaining! ✨`,

    `Person A: ${description} and I don't know how to feel about it 😵‍💫
Person B: That's some serious plot twist energy
Person A: My life is basically a Netflix series at this point
Person B: Yeah but it's the kind that gets cancelled after one season 💀
Person A: RUDE but... accurate 😭`,
  ]

  const randomSituation = situations[Math.floor(Math.random() * situations.length)]

  return {
    dialogue: randomSituation,
    style: settings.style,
    characters: ["Person A", "Person B"],
    aiGenerated: false,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { description, settings } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    // Generate meme dialogue (with AI or fallback)
    const result = await generateMemeDialogue(description, settings || {})

    return NextResponse.json({
      dialogue: result.dialogue,
      style: result.style,
      characters: result.characters,
      aiEnabled: AI_ENABLED,
      aiGenerated: result.aiGenerated,
    })
  } catch (error) {
    console.error("Error in dialogue generation:", error)
    return NextResponse.json({ error: "Failed to generate dialogue" }, { status: 500 })
  }
}
