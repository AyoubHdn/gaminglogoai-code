import { s3Style } from "~/utils/s3Paths";
export interface EmoteBaseStyleItem {
  id: string;
  name: string;
  preview: string;
  basePrompt: string;
}

export type EmoteBaseStyleData = Record<
  string, // category
  Record<string, EmoteBaseStyleItem[]> // subcategory
>;

export const emoteBaseStyles: EmoteBaseStyleData = {
    "Art Style": {
      "Cartoon & Toon": [
        { id: "Cartoon", name: "Cartoon", preview: s3Style("/twitch/emotes/styles/f4.webp"), basePrompt: "Convert the user's photo into a friendly Western cartoon-style face.\nUse bold outlines, bright colors, simplified shapes, and an expressive face.\nKeep the head centered and readable at small emote sizes." },
        { id: "Toony", name: "Toony", preview: s3Style("/twitch/emotes/styles/f49.webp"), basePrompt: "Convert the user's photo into an exaggerated toony cartoon face.\nUse oversized facial features, thick lines, and playful proportions.\nEnsure strong contrast and clarity at small resolutions." },
        { id: "Disney", name: "Disney", preview: s3Style("/twitch/emotes/styles/f52.webp"), basePrompt: "Convert the user's photo into a modern 3D cartoon face inspired by Disney/Pixar style.\nSmooth shading, soft lighting, expressive eyes, centered composition." },
      ],
      "Anime & Manga": [
        { id: "Anime", name: "Anime", preview: s3Style("/twitch/emotes/styles/f6.webp"), basePrompt: "Convert the user's photo into an anime-style face.\nUse clean line art, cel shading, sharp highlights, and expressive eyes.\nCentered head, simplified details for emote readability." },
        { id: "Shonen", name: "Shonen", preview: s3Style("/twitch/emotes/styles/f54.webp"), basePrompt: "Convert the user's photo into a shonen anime-style face.\nDynamic expression, bold anime lines, strong shadows, high contrast." },
        { id: "Shojo", name: "Shojo", preview: s3Style("/twitch/emotes/styles/ff55.webp"), basePrompt: "Convert the user's photo into a shojo anime-style face.\nSoft lines, large expressive eyes, gentle shading, pastel tones." },
        //{ id: "Retro", name: "Retro", preview: s3Style("/styles/f32.webp"), basePrompt: "Convert the user's photo into a portrait logo in a classic 90s anime style (distinctive large eyes, pointed chin, cel-shading). Add the text ''Text'', exactly as written, below in a retro anime font." }
      ],
      "Kawaii & Chibi": [
        { id: "Chibi", name: "Chibi", preview: s3Style("/twitch/emotes/styles/f5.webp"), basePrompt: "Create a cute chibi-style face from the user's photo.\nOversized head, simplified facial features, rounded shapes, kawaii expression." },
        { id: "Cute", name: "Cute", preview: s3Style("/twitch/emotes/styles/f25.webp"), basePrompt: "Create a kawaii chibi face with big eyes and minimal details.\nFocus on cuteness and clarity at very small sizes." },
        //{ id: "Kawaii", name: "Kawaii", preview: s3Style("/styles/f56.webp"), basePrompt: "Create a cute chibi avatar from user's photo (big head, large eyes). Add the exact text ''Text'' below in a playful, bold font." }
      ],
      "Pixel Art & Retro": [
        { id: "Pixel Art", name: "Pixel Art", preview: s3Style("/twitch/emotes/styles/f26.webp"), basePrompt: "Convert the user's face into an 8-bit pixel art emote.\nSimplified pixel facial features, strong silhouette, readable at tiny scale." },
        //{ id: "8-bit", name: "8-bit", preview: s3Style("/styles/f57.webp"), basePrompt: "Generate an 8-bit or 16-bit pixel art avatar based on user's photo. Include the text ''Text'' below in a clear, readable pixel font." },
        { id: "80s", name: "80s", preview: s3Style("/twitch/emotes/styles/f58.webp"), basePrompt: "Convert the user's face into a retro synthwave-style cartoon face.\nNeon highlights, high contrast lighting, simplified facial structure."}
      ],
      "Vector & Geometric": [
        { id: "Vector", name: "Vector", preview: s3Style("/twitch/emotes/styles/f7.webp"), basePrompt: "Create a clean vector-style face from the user's photo.\nSmooth shapes, flat colors, minimal shading, professional clarity."},
        //{ id: "Minimalist", name: "Minimalist", preview: s3Style("/twitch/twitch/emotes/styles/f8.webp"), basePrompt: "Create a minimalist black-and-white line-art face.\nContinuous clean lines, no shading, strong facial silhouette." },
        /*{ id: "Abstract", name: "Abstract", preview: s3Style("/styles/f16.webp"), basePrompt: "Create an abstract esports avatar from user's photo, stylizing with geometric lines and glowing [blue/red/green] energy effects. Integrate the text ''Text'' within the abstract design using a clean, futuristic font." },
        { id: "Low-poly", name: "Low-poly", preview: s3Style("/styles/f38.webp"), basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style (angular polygons, flat colors). Add the exact text ''Text'' below using a clean sans-serif font." },
        { id: "Flat", name: "Flat", preview: s3Style("/styles/f39.webp"), basePrompt: "Create a modern flat illustration style portrait logo from the user's photo (clean shapes, minimal shading). Add the name ''Text'' below in a friendly, matching sans-serif font." },
        { id: "Black and white line art", name: "Black and white line art", preview: s3Style("/styles/f40.webp"), basePrompt: "Design a minimalist portrait logo from user's photo using only clean, continuous black line art. Include the text ''Text'' below in a simple, thin, minimalist font." },
        { id: "Vector art", name: "Vector art", preview: s3Style("/styles/f59.webp"), basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style. Add the text ''Text'' below using a clean, matching sans-serif font." },
        { id: "Illustration", name: "Illustration", preview: s3Style("/styles/f60.webp"), basePrompt: "Create a modern flat illustration style portrait from user's photo. Add the name ''Text'' below in a clean, matching sans-serif font." }*/
      ],
      "Painterly & Sketch": [
        { id: "Watercolor", name: "Watercolor", preview: s3Style("/twitch/emotes/styles/f41.webp"), basePrompt: "\"Convert the user's face into a watercolor-style painted emote.\nSoft textures but simplified shapes for small-scale clarity.\"" },
        //{ id: "Oil painting", name: "Oil painting", preview: s3Style("/styles/f43.webp"), basePrompt: "Transform user's photo into a classical portrait logo in a textured oil painting style (visible brush strokes). Place the text ''Text'', exactly as written, below in an elegant serif font." },
        { id: "Sketch", name: "Sketch", preview: s3Style("/twitch/emotes/styles/f44.webp"), basePrompt: "\"Convert the user's face into a pencil sketch-style emote.\nVisible sketch lines, clear facial structure, high contrast.\"" },
        //{ id: "Painterly", name: "Painterly", preview: s3Style("/styles/f61.webp"), basePrompt: "Design a logo portrait based on user's photo with a watercolor paint effect. Render the exact text ''Text'' below using an elegant, flowing font." },
        //{ id: "Realistic", name: "Realistic", preview: s3Style("/styles/f63.webp"), basePrompt: "Convert user's photo into a realistic pencil sketch portrait logo. Integrate the precise text ''Text'' below in a hand-written sketch font." }
      ],
      /*"Illustrative & Comic": [
        { id: "Monochrome", name: "Monochrome", preview: s3Style("/twitch/twitch/emotes/styles/f42.webp"), basePrompt: "Create a stylized portrait logo from user's photo in a black and white graphic novel inking style (bold outlines, sharp shadows). Add the text ''Text'', exactly as written, below in a dynamic comic-book style font." },
        { id: "Comic", name: "Comic", preview: s3Style("/twitch/twitch/emotes/styles/f64.webp"), basePrompt: "Create a stylized portrait from user's photo in a black and white graphic novel inking style. Add the text ''Text'' below in a matching bold comic font." }
      ],*/
      "Effects & Urban": [
        //{ id: "Magenta glitch", name: "Magenta glitch", preview: s3Style("/twitch/twitch/emotes/styles/f1.webp"), basePrompt: "\"Convert the user's face into a cyberpunk glitch-style emote.\nNeon edges, digital distortion, high contrast facial highlights.\"" },
        { id: "Glitch", name: "Glitch", preview: s3Style("/twitch/emotes/styles/f2.webp"), basePrompt: "\"Convert the user's face into a neon-outlined emote.\nBright glowing edges, dark inner shading, strong facial silhouette.\"" },
        //{ id: "Glitch Neon", name: "Glitch Neon", preview: s3Style("/styles/f3.webp"), basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the gamer tag ''Text'' as a separate, distinct glowing neon sign element below." },
        //{ id: "Flames", name: "Flames", preview: s3Style("/styles/f17.webp"), basePrompt: "Render user's photo as an intense esports avatar engulfed in digital flames. Integrate the exact text ''Text'' below in a sharp font with fiery effects or embers." },
        //{ id: "Ice", name: "Ice", preview: s3Style("/styles/f18.webp"), basePrompt: "Design an esports avatar from user's photo with an ice/frost theme. Integrate the text ''Text'' below in a cool, sharp, crystalline or frozen-style font." },
        { id: "Sticker", name: "Sticker", preview: s3Style("/twitch/emotes/styles/f27.webp"), basePrompt: "\"Convert the user's face into a sticker-style emote.\nThick white outline, bold colors, cartoon clarity.\"" },
        //{ id: "Graffiti", name: "Graffiti", preview: s3Style("/styles/f65.webp"), basePrompt: "Render the user's photo portrait in a bold streetwear/graffiti style with spray paint textures. Integrate the text ''Text'' below in a dynamic graffiti tag or bubble letter style." },
        //{ id: "Distorted glitch", name: "Distorted glitch", preview: s3Style("/styles/f66.webp"), basePrompt: "Transform user's photo portrait with heavy blue/magenta glitch effects. Integrate the exact name ''Text'' below using a heavily distorted glitch font." },
        //{ id: "Neon", name: "Neon", preview: s3Style("/styles/f67.webp"), basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the text ''Text'' below, rendered as its own neon element." },
        //{ id: "Cartoon sticker", name: "Cartoon sticker", preview: s3Style("/styles/f68.webp"), basePrompt: "Generate a logo from user's photo like a die-cut sticker. Add the text ''Text'' clearly below in a bold, sticker-like font." }
      ],
      "Mascot & Emblem": [
        { id: "Wolf", name: "Wolf", preview: s3Style("/twitch/emotes/styles/f10.webp"), basePrompt: "Blend the user's facial features with a wolf mascot face.\nEsports-style expression, sharp lines, aggressive but readable design.\"" },
        { id: "Dragon", name: "Dragon", preview: s3Style("/twitch/emotes/styles/f11.webp"), basePrompt: "Blend the user's face with dragon features.\nFantasy stylization, strong jawline, glowing eyes." },
        //{ id: "Eagle", name: "Eagle", preview: s3Style("/styles/f12.webp"), basePrompt: "Fuse user's photo with eagle features for an esports mascot avatar. Integrate the name ''Text'' below in a clean, powerful, sharp font." },
        //{ id: "Emblem", name: "Emblem", preview: s3Style("/styles/f69.webp"), basePrompt: "Create an esports emblem or badge incorporating the user's stylized face. Surround with dynamic shapes and clearly display the text ''Text'' using a bold, competitive font." },
        //{ id: "Cartoon animal", name: "Cartoon animal", preview: s3Style("/styles/f70.webp"), basePrompt: "Transform user's photo into a friendly cartoon animal mascot head, using their features as inspiration. Include the name ''Text'' below in a playful font matching the mascot." }
      ]
    },
    /*"Game Title": {
      "Shooters": [
        { id: "Apex Legends", name: "Apex Legends", preview: s3Style("/styles/ff20.webp"), basePrompt: "Create an Apex Legends inspired avatar from user's photo, in the game's sharp style. Integrate the text ''Text'' below using a font similar to Apex Legends UI fonts." },
        { id: "Call of Duty", name: "Call of Duty", preview: s3Style("/styles/ff21.webp"), basePrompt: "Transform user's photo into a Call of Duty style operator portrait with tactical gear. Integrate the text ''Text'' below using a modern military or stencil font." },
        { id: "Counter-Strike", name: "Counter-Strike", preview: s3Style("/styles/f100.webp"), basePrompt: "Design a logo based on user's photo in a gritty Counter-Strike style. Include the text ''Text'' below in a clean, bold sans-serif font." },
        { id: "Destiny", name: "Destiny", preview: s3Style("/styles/f24.webp"), basePrompt: "Create a Destiny Guardian avatar from user's photo (Titan/Warlock/Hunter style). Integrate the text ''Text'' below using a font inspired by Destiny's UI or lore." },
        { id: "Fortnite", name: "Fortnite", preview: s3Style("/styles/ff25.webp"), basePrompt: "Transform user's photo into a character logo in the bright, stylized 3D cartoon art style of Fortnite. Include the text ''Text'' below in a fun, chunky font similar to the game." },
        { id: "Gears of War", name: "Gears of War", preview: s3Style("/styles/ff26.webp"), basePrompt: "Render user's photo as a gritty Gears of War COG soldier in bulky armor. Integrate the text ''Text'' below using the iconic Gears of War stencil font." },
        { id: "Overwatch", name: "Overwatch", preview: s3Style("/styles/ff24.webp"), basePrompt: "Create an Overwatch hero style portrait from user's photo in the game's clean cartoon look. Integrate the text ''Text'' below using a font similar to Overwatch's branding." },
        { id: "PUBG", name: "PUBG", preview: s3Style("/styles/f28.webp"), basePrompt: "Create a Battle Royale character portrait from user's photo (PUBG style, realistic tactical gear). Integrate the text ''Text'' below in a rugged military font." },
        { id: "Rainbow Six Siege", name: "Rainbow Six Siege", preview: s3Style("/styles/f29.webp"), basePrompt: "Design a tactical operator portrait logo from user's photo in Rainbow Six Siege style. Integrate the text ''Text'' below in a clean, technical font." },
        { id: "Valorant", name: "Valorant", preview: s3Style("/styles/f30.webp"), basePrompt: "Create a modern tactical operator portrait from user's photo in Valorant agent style. Integrate the text ''Text'' below using a sharp, stylish font like Valorant's UI." },
        { id: "Battle Royale", name: "Battle Royale", preview: s3Style("/styles/f33.webp"), basePrompt: "Create a Battle Royale character portrait based on user's photo, outfitted in realistic tactical gear (PUBG/Apex style). Integrate the exact text ''Text'' below in a rugged stencil font." },
        { id: "COD", name: "COD", preview: s3Style("/styles/f36.webp"), basePrompt: "Create a modern tactical operator portrait from user's photo (headset, glasses, cap), high-contrast style like COD. Integrate the name ''Text'' below in a clean military-style font." },
        { id: "Free Fire", name: "Free Fire", preview: s3Style("/styles/f48.webp"), basePrompt: "Create a Free Fire inspired character logo from the user's photo in a vibrant, tactical style. Integrate the exact text ''Text'' below in a bold, slightly distressed font." }
      ],
      "MOBA / Strategy": [
        { id: "DOTA", name: "DOTA", preview: s3Style("/styles/f31.webp"), basePrompt: "Transform user's photo into a stylized hero portrait in the painterly style of DOTA 2. Integrate the text ''Text'' below using a font fitting the DOTA 2 aesthetic." },
        { id: "League of Legends", name: "League of Legends", preview: s3Style("/styles/ff32.webp"), basePrompt: "Create a League of Legends champion-style portrait from user's photo in splash art style. Integrate the text ''Text'' below using the League of Legends specific font or similar." },
        { id: "Mobile Legends", name: "Mobile Legends", preview: s3Style("/styles/ff33.webp"), basePrompt: "Render user's photo as a vibrant hero character in Mobile Legends style. Integrate the text ''Text'' below using a dynamic fantasy font." },
        { id: "Starcraft", name: "Starcraft", preview: s3Style("/styles/f34.webp"), basePrompt: "Design a Sci-Fi portrait based on user's photo in Starcraft style. Integrate the text ''Text'' using a futuristic, blocky Starcraft-like font." },
        { id: "Warcraft", name: "Warcraft", preview: s3Style("/styles/ff35.webp"), basePrompt: "Transform user's photo into a character portrait in the fantasy art style of Warcraft. Integrate the text ''Text'' using the classic Warcraft font." }
      ],
      "RPG & Adventure": [
        { id: "RPG", name: "RPG", preview: s3Style("/styles/f35.webp"), basePrompt: "Depict user from photo as a fantasy adventurer in detailed RPG style. Include the text ''Text'' below using a classic fantasy or medieval font." },
        { id: "Uncharted", name: "Uncharted", preview: s3Style("/styles/ff36.webp"), basePrompt: "Create a dynamic action-adventure hero portrait from user's photo (Uncharted style). Integrate the text ''Text'' below in a slightly rugged adventure font." },
        { id: "Lost Ark", name: "Lost Ark", preview: s3Style("/styles/ff37.webp"), basePrompt: "Render user's photo in the detailed MMO style of Lost Ark. Integrate the text ''Text'' below using an ornate fantasy font." },
        { id: "New World", name: "New World", preview: s3Style("/styles/ff38.webp"), basePrompt: "Depict user from photo as a colonial-era adventurer in New World style. Integrate the text ''Text'' below using a historical serif font." },
        { id: "Zelda", name: "Zelda", preview: s3Style("/styles/ff39.webp"), basePrompt: "Transform user's photo into a character portrait in the cel-shaded style of Zelda. Integrate the text ''Text'' using a font inspired by the Zelda series." }
      ],
      "Simulation & Sports": [
        { id: "FIFA", name: "FIFA", preview: s3Style("/styles/ff40.webp"), basePrompt: "Create a realistic sports portrait from user's photo as a FIFA-style football player. Integrate ''Text'' below using a modern sports jersey font." },
        { id: "Rocket League", name: "Rocket League", preview: s3Style("/styles/ff41.webp"), basePrompt: "Design a fun logo showing user's face (cartoon style) on a Rocket League car. Add ''Text'' using a futuristic, energetic font." },
        { id: "World of Tanks", name: "World of Tanks", preview: s3Style("/styles/ff42.webp"), basePrompt: "Create a logo showing user's face (gritty style) as a World of Tanks commander. Integrate ''Text'' using a military stencil font." },
        { id: "Forza", name: "Forza", preview: s3Style("/styles/ff43.webp"), basePrompt: "Render user's photo as a racing driver avatar (face in helmet). Integrate ''Text'' below using a sleek, fast-looking font." }
      ],
      "Sandbox & Other": [
        { id: "GTA", name: "GTA", preview: s3Style("/styles/ff44.webp"), basePrompt: "Create a logo portrait from user's photo in the illustrative style of GTA. Integrate ''Text'' using the iconic GTA 'Price Down' font or similar." },
        { id: "Mafia", name: "Mafia", preview: s3Style("/styles/f45.webp"), basePrompt: "Transform user's photo into a portrait logo in the retro, noir-ish style of Mafia games. Integrate ''Text'' using a classic 1930s-50s era font." },
        { id: "Minecraft", name: "Minecraft", preview: s3Style("/styles/f46.webp"), basePrompt: "Render user's photo as a blocky Minecraft character avatar. Integrate ''Text'' below using a pixelated Minecraft-style font." },
        { id: "Resident Evil", name: "Resident Evil", preview: s3Style("/styles/f47.webp"), basePrompt: "Create a gritty, survival horror portrait from user's photo, inspired by Resident Evil. Integrate ''Text'' using a distressed, horror-themed font." },
        { id: "Pixel", name: "Pixel", preview: s3Style("/styles/f50.webp"), basePrompt: "Create a Minecraft-style profile picture based on the reference photo. Keep the face and main features recognizable but transform them into a pixelated Minecraft character design. Use a blocky, 3D voxel art style with sharp edges, low resolution details, and vibrant colors. Format it as a square avatar, centered on the face, with a clean simple background. Add the text ''Text'' below the avatar in a bold Minecraft font style, pixelated to match the theme." },
      ]
    },

    "Theme & Motif": {
      "Fantasy & Mythical": [
        { id: "Fantasy", name: "Fantasy", preview: s3Style("/styles/f19.webp"), basePrompt: "Transform the user's photo into a semi-realistic fantasy portrait avatar as an Elf. Integrate the text ''Text'' using an elegant script font." },
        { id: "Mage", name: "Mage", preview: s3Style("/styles/f20.webp"), basePrompt: "Create a fantasy portrait avatar from the user's photo as a Mage. Add the text ''Text'' using a mystical or runic font." },
        { id: "Elf", name: "Elf", preview: s3Style("/styles/f71.webp"), basePrompt: "Transform user's photo into a fantasy portrait as an Elf. Integrate ''Text'' using an elegant font." },
        { id: "Dragon", name: "Dragon", preview: s3Style("/styles/f72.webp"), basePrompt: "Fuse user's photo with dragon features for an avatar. Integrate the text ''Text'' using a bold, fantasy font." },
        { id: "High Fantasy", name: "High Fantasy", preview: s3Style("/styles/f73.webp"), basePrompt: "Create a general high-fantasy themed portrait from the user's photo (glowing runes, magical aura). Include the text ''Text'' using a magical font." }
      ],
      "SciFi, Tech & Space": [
        { id: "Podcast", name: "Podcast", preview: s3Style("/styles/f9.webp"), basePrompt: "Create a professional graphic logo for podcast host ''Text'' based on photo (flat illustration style, microphone icon). Use clear, modern typography for ''Text''." },
        { id: "Mech Pilot", name: "Mech Pilot", preview: s3Style("/styles/f14.webp"),  basePrompt: "Generate esports avatar based on user's photo as a mech pilot. Integrate the text ''Text'' using a blocky, sci-fi font." },
        { id: "Power Armor", name: "Power Armor", preview: s3Style("/styles/f15.webp"),  basePrompt: "Create an esports avatar placing user's face inside futuristic power armor. Add the text ''Text'' using a bold tech font." },
        { id: "Cyberpunk", name: "Cyberpunk", preview: s3Style("/styles/f22.webp"), basePrompt: "Convert user's photo into a cyberpunk hacker-style avatar. Integrate the text ''Text'' using a digital glitch font." },
        { id: "Steampunk Adventurer", name: "Steampunk Adventurer", preview: s3Style("/styles/f23.webp"), basePrompt: "Render user's photo as a Steampunk adventurer avatar. Include the text ''Text'' using an ornate Victorian font." },
        { id: "Space Explorer", name: "Space Explorer", preview: s3Style("/styles/f24.webp"), basePrompt: "Create a sci-fi space explorer avatar from user's photo (spacesuit helmet). Add the text ''Text'' using a clean, futuristic font." },
        { id: "Cyberpunk Hacker", name: "Cyberpunk Hacker", preview: s3Style("/styles/f74.webp"), basePrompt: "Convert user's photo into a cyberpunk hacker avatar. Integrate the text ''Text'' using a glitchy digital font." },
        { id: "Space Explorer", name: "Space Explorer", preview: s3Style("/styles/f75.webp"), basePrompt: "Create a sci-fi space explorer avatar from user's photo. Add the text ''Text'' using a clean tech font." },
        { id: "Alien", name: "Alien", preview: s3Style("/styles/f76.webp"), basePrompt: "Create an avatar blending user's photo features with stylized alien characteristics. Integrate the text ''Text'' using an alien-inspired font." },
        { id: "High-Tech", name: "High-Tech", preview: s3Style("/styles/f77.webp"), basePrompt: "Render user's photo portrait with a high-technology theme (circuits, HUD). Integrate the exact text ''Text'' using a crisp digital font." }
      ],
      "Warriors & Heroes": [
        { id: "Knight/Spartan", name: "Knight/Spartan", preview: s3Style("/styles/f13.webp"),  basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior in a stylized helmet. Integrate ''Text'' using a strong, weathered font." },
        { id: "Rugged Warrior", name: "Rugged Warrior", preview: s3Style("/styles/f21.webp"), basePrompt: "Render the user's photo as a rugged fantasy Warrior avatar (armor, face paint). Use ''Text'' using a strong, slightly rough font." },
        { id: "Knight/Spartan", name: "Knight/Spartan", preview: s3Style("/styles/f79.webp"), basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior. Integrate ''Text'' using a bold, historic font." },
        { id: "Ninja", name: "Ninja", preview: s3Style("/styles/f80.webp"), basePrompt: "Depict the user from their photo as a stealthy Ninja character. Integrate ''Text'' using a sharp, brush-stroke inspired font." },
        { id: "Superhero", name: "Superhero", preview: s3Style("/styles/f81.webp"), basePrompt: "Turn user's photo into a dynamic superhero avatar. Integrate ''Text'' using a bold, heroic, comic-book font." }
      ],
      "Horror & Dark Themes": [
        { id: "Zombie", name: "Zombie", preview: s3Style("/styles/f82.webp"), basePrompt: "Transform the user's photo into a zombie portrait logo in a gritty horror style. Integrate ''Text'' using a dripping or decayed font." },
        { id: "Ghost", name: "Ghost", preview: s3Style("/styles/f83.webp"), basePrompt: "Create a ghostly apparition avatar from the user's photo (semi-transparent, glowing). Integrate ''Text'' using a wispy or ethereal font." }
      ],
      "Astrology": [
        { id: "Zodiac", name: "Zodiac", preview: s3Style("/styles/f84.webp"), basePrompt: "Create a mystical avatar from user's photo incorporating their zodiac sign symbol and cosmic motifs. Include ''Text'' using a celestial or elegant font." }
      ]
    },
    "Seasonal & Cultural": {
      "Holidays": [
        { id: "Dia de Muertos", name: "Dia de Muertos", preview: s3Style("/styles/f85.webp"), basePrompt: "Create a Dia de Muertos themed portrait from user's photo (sugar skull makeup). Integrate ''Text'' using a decorative font." },
        { id: "Easter", name: "Easter", preview: s3Style("/styles/f86.webp"), basePrompt: "Design an Easter themed avatar from user's photo (pastel colors, bunny ears). Integrate ''Text'' using a playful script font." },
        { id: "Halloween", name: "Halloween", preview: s3Style("/styles/f87.webp"), basePrompt: "Create a Halloween themed avatar from user's photo (spooky elements, costume). Integrate ''Text'' using a creepy or gothic font." },
        { id: "Christmas", name: "Christmas", preview: s3Style("/styles/f88.webp"), basePrompt: "Generate a festive holiday avatar from user's photo (Santa hat, snow). Integrate ''Text'' using a festive script font." },
        { id: "Valentine's Day", name: "Valentine's Day", preview: s3Style("/styles/f89.webp"), basePrompt: "Create a Valentine's Day themed portrait from user's photo (hearts, pink/red). Integrate ''Text'' using a romantic script font." },
        { id: "St Patrick’s Day", name: "St Patrick’s Day", preview: s3Style("/styles/f90.webp"), basePrompt: "Design a St Patrick’s Day avatar from user's photo (leprechaun hat, green). Integrate ''Text'' using a Celtic-style font." }
      ],
      "Cultural / National": [
        { id: "Brazil", name: "Brazil", preview: s3Style("/styles/f91.webp"), basePrompt: "Create a logo portrait based on user's photo incorporating colors/symbols inspired by Brazil. Integrate ''Text'' using a lively font." },
        { id: "Patriotic", name: "Patriotic", preview: s3Style("/styles/f92.webp"), basePrompt: "Generate a patriotic avatar from user's photo using national flag colors/symbols. Integrate ''Text'' using a strong, classic font." }
      ]
    }*/
  };
