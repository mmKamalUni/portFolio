export const personalDetails = {
  name: "Malik Murtaza Kamal",
  location: "Rawalpindi",
  phone: "+92 3160537443",
  email: "malikmkamal07@gmail.com",
  linkedin: "https://www.linkedin.com/in/murtaza-kamal-612ab9253",
} as const;

// TODO: Replace with the full objective paragraph provided by you.
export const objective = `TODO: Paste your full objective paragraph here.` as const;

export const education = [
  { institution: "FAST-NUCES", degree: "Bachelor of Software Engineering" },
  { institution: "Fauji Foundation College", degree: "Pre Medical" },
  { institution: "APSACS PMA Kakul", degree: "Biology" },
 ] as const;

// Add categories and items to match your provided list; one example shown.
export const skills = {
  productThinking: [
    "Requirements Gathering",
    "...",
  ],
  // TODO: Add the remaining categories and skills exactly as provided.
} as const;

export const projects = [
  {
    title: "Personal Portfolio Website",
    description: "Designed and launched...",
    bullets: ["Gained practical..."],
  },
  {
    title: "Movie Recommendation Website",
    description: "Developed a dynamic...",
    bullets: ["Applied product...", "Enhanced understanding..."],
  },
] as const;
