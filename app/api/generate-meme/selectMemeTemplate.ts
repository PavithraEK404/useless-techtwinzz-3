// app/api/generate-meme/selectMemeTemplate.ts

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

export function selectMemeTemplate(description: string) {
  const lowerDesc = description.toLowerCase()

  // Prioritize templates based on keywords in the description
  if (
    lowerDesc.includes("drake") ||
    lowerDesc.includes("choice") ||
    lowerDesc.includes("reject") ||
    lowerDesc.includes("approve")
  ) {
    return MEME_TEMPLATES.find((template) => template.id === "drake") || MEME_TEMPLATES[0]
  }
  if (lowerDesc.includes("distracted") || lowerDesc.includes("boyfriend") || lowerDesc.includes("temptation")) {
    return MEME_TEMPLATES.find((template) => template.id === "distracted-boyfriend") || MEME_TEMPLATES[1]
  }
  if (
    lowerDesc.includes("yelling") ||
    lowerDesc.includes("cat") ||
    lowerDesc.includes("argument") ||
    lowerDesc.includes("confused")
  ) {
    return MEME_TEMPLATES.find((template) => template.id === "woman-yelling-cat") || MEME_TEMPLATES[2]
  }
  if (lowerDesc.includes("fine") || lowerDesc.includes("disaster") || lowerDesc.includes("calm")) {
    return MEME_TEMPLATES.find((template) => template.id === "this-is-fine") || MEME_TEMPLATES[3]
  }
  if (lowerDesc.includes("brain") || lowerDesc.includes("evolution") || lowerDesc.includes("progress")) {
    return MEME_TEMPLATES.find((template) => template.id === "expanding-brain") || MEME_TEMPLATES[4]
  }
  if (lowerDesc.includes("buttons") || lowerDesc.includes("choice") || lowerDesc.includes("difficult")) {
    return MEME_TEMPLATES.find((template) => template.id === "two-buttons") || MEME_TEMPLATES[5]
  }
  if (lowerDesc.includes("mind") || lowerDesc.includes("opinion") || lowerDesc.includes("statement")) {
    return MEME_TEMPLATES.find((template) => template.id === "change-my-mind") || MEME_TEMPLATES[6]
  }
  if (lowerDesc.includes("surprised") || lowerDesc.includes("pikachu") || lowerDesc.includes("unexpected")) {
    return MEME_TEMPLATES.find((template) => template.id === "surprised-pikachu") || MEME_TEMPLATES[7]
  }

  // If no specific keywords are found, return a random template
  return MEME_TEMPLATES[Math.floor(Math.random() * MEME_TEMPLATES.length)]
}
