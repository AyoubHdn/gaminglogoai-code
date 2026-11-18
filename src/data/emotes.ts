export type EmoteKey =
  | "GG" | "LOL" | "RIP" | "WOW" | "HYPE"
  | "HI" | "HEY" | "YO" | "SUP" | "WELCOME"
  | "OMG" | "WTF" | "REALLY" | "YIKES"
  | "POG" | "PROGGERS" | "OOP" | "OOF"
  | "EZ" | "EASY" | "DUB" | "TOP1" | "1HP"
  | "CRACK" | "TOXIC" | "REKT" | "FAIL"
  | "THANKS" | "BYE" | "NOOO" | "YESSS"
  | "LEGEND" | "POWER" | "DEAD" | "200IQ"
  | "GOTEM" | "GOODVIBES" | "CLIPTHAT"
  | "RAID" | "BAN" | "LIT";

export interface EmoteDefinition {
  key: EmoteKey;
  label: string;
  example: string;
  prompt: string; // facial expression ONLY
}

export const emotes: EmoteDefinition[] = [
  // Core
  { key: "GG", label: "GG", example: "GG.webp", prompt: "happy victory expression, confident smile" },
  { key: "LOL", label: "LOL", example: "LOL.webp", prompt: "laughing hard, eyes closed, exaggerated laughter" },
  { key: "RIP", label: "RIP", example: "RIP.webp", prompt: "sad defeated expression, humorous loss" },
  { key: "WOW", label: "WOW", example: "WOW.webp", prompt: "shocked surprised expression, wide eyes" },
  { key: "HYPE", label: "HYPE", example: "HYPE.webp", prompt: "extreme excitement, shouting expression" },

  // Greetings
  { key: "HI", label: "Hi", example: "HI.webp", prompt: "friendly greeting expression, warm smile" },
  { key: "HEY", label: "Hey", example: "HEY.webp", prompt: "casual greeting expression, raised eyebrows" },
  { key: "YO", label: "Yo", example: "YO.webp", prompt: "cool confident greeting expression" },
  { key: "SUP", label: "Sup", example: "SUP.webp", prompt: "relaxed friendly expression" },
  { key: "WELCOME", label: "Welcome", example: "WELCOME.webp", prompt: "friendly welcoming expression" },
  // Reactions
  { key: "OMG", label: "Omg!", example: "OMG.webp", prompt: "extreme surprise expression, mouth open" },
  { key: "WTF", label: "WTF", example: "WTF.webp", prompt: "confused shocked disbelief expression" },
  { key: "REALLY", label: "Really?", example: "REALLY.webp", prompt: "skeptical doubtful expression" },
  { key: "YIKES", label: "Yikes!", example: "YIKES.webp", prompt: "awkward uncomfortable expression" },

  // Twitch culture
  { key: "POG", label: "Pog", example: "POG.webp", prompt: "poggers open-mouth excitement expression" },
  { key: "PROGGERS", label: "Proggers", example: "PROGGERS.webp", prompt: "excited proud gamer expression" },
  { key: "OOP", label: "Oop", example: "OOP.webp", prompt: "sudden mistake realization expression" },
  { key: "OOF", label: "Oof", example: "OOF.webp", prompt: "painful hit reaction expression" },

  // Wins & skill
  { key: "EZ", label: "EZ", example: "EZ.webp", prompt: "smug confident expression" },
  { key: "EASY", label: "Easy", example: "EASY.webp", prompt: "relaxed confident victory expression" },
  { key: "DUB", label: "Dub", example: "DUB.webp", prompt: "celebrating victory expression" },
  { key: "TOP1", label: "Top 1", example: "TOP1.webp", prompt: "champion proud expression" },
  { key: "1HP", label: "1HP", example: "1HP.webp", prompt: "exhausted barely alive expression" },

  // Negative / toxic
  { key: "CRACK", label: "Crack", example: "CRACK.webp", prompt: "overconfident aggressive expression" },
  { key: "TOXIC", label: "Toxic", example: "TOXIC.webp", prompt: "angry mocking toxic expression" },
  { key: "REKT", label: "Rekt", example: "REKT.webp", prompt: "defeated embarrassed expression" },
  { key: "FAIL", label: "Fail", example: "FAIL.webp", prompt: "frustrated disappointed expression" },

  // Social
  { key: "THANKS", label: "Thanks", example: "THANKS.webp", prompt: "grateful happy expression" },
  { key: "BYE", label: "Bye", example: "BYE.webp", prompt: "waving goodbye expression" },
  { key: "NOOO", label: "Nooo", example: "NOOO.webp", prompt: "dramatic frustrated scream expression" },
  { key: "YESSS", label: "Yesss", example: "YESSS.webp", prompt: "big win celebration expression" },

  // Status & memes
  { key: "LEGEND", label: "Legend", example: "LEGEND.webp", prompt: "heroic confident expression" },
  { key: "POWER", label: "Power", example: "POWER.webp", prompt: "intense powerful expression" },
  { key: "DEAD", label: "Dead", example: "DEAD.webp", prompt: "knocked-out dramatic expression" },
  { key: "200IQ", label: "200 IQ", example: "200IQ.webp", prompt: "smart genius smug expression" },
  { key: "GOTEM", label: "Got Em", example: "GOTEM.webp", prompt: "triumphant caught-you expression" },
  { key: "GOODVIBES", label: "Good Vibes", example: "GOODVIBES.webp", prompt: "calm positive happy expression" },
  { key: "CLIPTHAT", label: "Clip That", example: "CLIPTHAT.webp", prompt: "excited impressed reaction expression" },

  // Moderation / events
  { key: "RAID", label: "Raid", example: "RAID.webp", prompt: "excited welcoming hype expression" },
  { key: "BAN", label: "Ban", example: "BAN.webp", prompt: "strict angry moderator expression" },
  { key: "LIT", label: "Lit", example: "LIT.webp", prompt: "high-energy party excitement expression" },
];
