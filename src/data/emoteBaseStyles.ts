export type EmoteBaseStyle = {
  id: string;
  name: string;
  preview: string;
  basePrompt: string;
};

export const emoteBaseStyles: EmoteBaseStyle[] = [
  {
    id: "cartoon",
    name: "Cartoon",
    preview: "/emote-styles/cartoon.webp",
    basePrompt:
      "cute cartoon character face, bold outlines, expressive eyes, clean esports style",
  },
  {
    id: "chibi",
    name: "Chibi",
    preview: "/emote-styles/chibi.webp",
    basePrompt:
      "chibi character face, big head, small body proportions, kawaii style",
  },
  {
    id: "mascot",
    name: "Mascot",
    preview: "/emote-styles/mascot.webp",
    basePrompt:
      "esports mascot character face, strong expression, logo-ready design",
  },
  {
    id: "anime",
    name: "Anime",
    preview: "/emote-styles/anime.webp",
    basePrompt:
      "anime-style character face, clean line art, vibrant colors",
  },
];
