export interface ThumbnailGame {
  id: string;
  name: string;
  promptTheme: string;
}

export const THUMBNAIL_GAMES = [
  {
    id: "generic",
    name: "No specific game / generic",
    promptTheme: "generic original gaming",
  },
  {
    id: "fortnite",
    name: "Fortnite",
    promptTheme:
      "vibrant Fortnite-inspired battle royale with colorful stylized characters and playful action",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    promptTheme:
      "Minecraft-inspired block-building adventure with pixel textures and survival-crafting energy",
  },
  {
    id: "call-of-duty",
    name: "Call of Duty",
    promptTheme:
      "Call of Duty-inspired modern military action with cinematic tactical combat",
  },
  {
    id: "free-fire",
    name: "Free Fire",
    promptTheme:
      "Free Fire-inspired mobile battle royale with vibrant survival action and tactical characters",
  },
  {
    id: "valorant",
    name: "Valorant",
    promptTheme:
      "Valorant-inspired competitive tactical hero-shooter with sleek agents and ability effects",
  },
  {
    id: "apex-legends",
    name: "Apex Legends",
    promptTheme:
      "Apex Legends-inspired futuristic battle royale with dynamic squad action and sci-fi technology",
  },
  {
    id: "roblox",
    name: "Roblox",
    promptTheme:
      "Roblox-inspired playful block-character gaming with colorful creator-driven adventure",
  },
  {
    id: "gta",
    name: "GTA",
    promptTheme:
      "Grand Theft Auto-inspired open-world crime action with cinematic vehicles, characters and urban energy",
  },
  {
    id: "elden-ring",
    name: "Elden Ring",
    promptTheme:
      "Elden Ring-inspired dark fantasy with colossal bosses, ruined kingdoms and cinematic medieval combat",
  },
  {
    id: "legend-of-zelda",
    name: "The Legend of Zelda",
    promptTheme:
      "The Legend of Zelda-inspired fantasy adventure with ancient ruins, magical artifacts and heroic exploration",
  },
  {
    id: "counter-strike-2",
    name: "Counter-Strike 2",
    promptTheme:
      "Counter-Strike 2-inspired competitive tactical shooter action with modern weapons and esports intensity",
  },
  {
    id: "five-nights-at-freddys",
    name: "Five Nights at Freddy's",
    promptTheme:
      "Five Nights at Freddy's-inspired survival horror with eerie animatronics, dark security rooms and jump-scare tension",
  },
  {
    id: "league-of-legends",
    name: "League of Legends",
    promptTheme:
      "League of Legends-inspired fantasy MOBA action with powerful champions, magical abilities and competitive arena energy",
  },
  {
    id: "mortal-kombat",
    name: "Mortal Kombat",
    promptTheme:
      "Mortal Kombat-inspired fantasy fighting action with dramatic face-offs, elemental powers and intense arena combat",
  },
  {
    id: "overwatch-2",
    name: "Overwatch 2",
    promptTheme:
      "Overwatch 2-inspired colorful futuristic hero-shooter action with distinctive heroes and energetic team combat",
  },
  {
    id: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    promptTheme:
      "Red Dead Redemption 2-inspired cinematic western adventure with outlaws, horses and dramatic frontier landscapes",
  },
  {
    id: "pokemon",
    name: "Pokémon",
    promptTheme:
      "Pokémon-inspired creature-collecting adventure with colorful monsters, young trainers and magical discovery",
  },
  {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    promptTheme:
      "Cyberpunk 2077-inspired futuristic open-world action with neon city streets, advanced technology and rebellious characters",
  },
  {
    id: "pubg",
    name: "PUBG",
    promptTheme:
      "PUBG-inspired realistic battle royale survival with tactical weapons, rugged environments and high-stakes combat",
  },
] as const satisfies readonly ThumbnailGame[];

export type ThumbnailGameId = (typeof THUMBNAIL_GAMES)[number]["id"];

export function getThumbnailGame(gameId: string): ThumbnailGame | undefined {
  return THUMBNAIL_GAMES.find((game) => game.id === gameId);
}
