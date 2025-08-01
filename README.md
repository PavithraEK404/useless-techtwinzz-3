# AI Meme Dialogue Generator 💬

Transform any situation into hilarious meme-style conversations! This AI-powered tool generates funny dialogues between characters based on your descriptions, perfect for social media, messaging, or just having a laugh.

## Features ✨

- **AI-Powered Dialogues**: Uses OpenAI GPT-4 to create contextually funny conversations
- **Multiple Styles**: Choose from funny, sarcastic, wholesome, dramatic, or relatable styles
- **Customizable Tone**: Adjust humor from subtle to exaggerated
- **Character Control**: Generate dialogues with 2-4 characters
- **Chat-Style Display**: Beautiful message bubble interface
- **History Management**: Save and revisit your favorite dialogues
- **Easy Sharing**: Copy or share dialogues instantly
- **Fallback Generation**: Works without API keys using smart templates

## Quick Start 🚀

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd ai-dialogue-generator
   npm install
   \`\`\`

2. **Environment Setup** (Optional but recommended)
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your OpenAI API key to \`.env.local\`:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

3. **Run the Application**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in Browser**
   Navigate to \`http://localhost:3000\`

## How It Works 🧠

1. **Describe**: Enter any situation (e.g., "when exam gets postponed")
2. **Customize**: Choose your preferred style and tone
3. **Generate**: AI creates a funny dialogue between characters
4. **Enjoy**: Copy, share, or save your meme dialogue

## Example Outputs 💡

**Input**: "when exam gets postponed"
**Output**:
\`\`\`
Person A: I studied all night for this exam! 📚
Person B: Check your email...
Person A: It got postponed. My sacrifice was meaningless.
\`\`\`

**Input**: "submitting assignment at 11:59 PM"
**Output**:
\`\`\`
Person A: Submitted at 11:59 PM! 🏃‍♂️
Person B: That's some Fast & Furious level timing.
Person A: Family always meets deadlines.
\`\`\`

## Dialogue Styles 🎭

- **Funny**: Hilarious and comedic timing
- **Sarcastic**: Witty and dry humor
- **Wholesome**: Heartwarming and positive
- **Dramatic**: Over-the-top theatrical
- **Relatable**: Everyday situations we all know

## API Endpoints 🔌

### POST /api/generate-dialogue
Generate a meme dialogue from a description.

**Request Body**:
\`\`\`json
{
  "description": "when WiFi goes down during video call",
  "settings": {
    "style": "funny",
    "tone": "exaggerated",
    "characters": 2,
    "useEmojis": true
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "dialogue": "Person A: WiFi is down during my important call! 📡\\nPerson B: Time to use mobile data.\\nPerson A: *checks data usage* Never mind, I'll just disappear.",
  "style": "funny",
  "characters": ["Person A", "Person B"],
  "aiEnabled": true
}
\`\`\`

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4 via AI SDK
- **UI Components**: shadcn/ui
- **Storage**: Local Storage for history

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with 💬 and AI** - Turn any situation into comedy gold! 🎭
