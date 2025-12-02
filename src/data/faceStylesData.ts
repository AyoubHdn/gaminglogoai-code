import { s3Style } from "~/utils/s3Paths";
export const faceStylesData: Record<
string,
Record<string, {name: string; src: string; basePrompt: string }[]>
> = {
    "Art Style": {
      "Cartoon & Toon": [
        { name: "Cartoon", src: s3Style("/styles/f4.webp"), basePrompt: "Convert the user's photo into a friendly, approachable Western cartoon character logo/avatar, capturing likeness with clean lines/bright colors. The name ''Text'' MUST be integrated clearly below the character in a fun, rounded, bold font matching the cartoon style." },
        { name: "Toony", src: s3Style("/styles/f49.webp"), basePrompt: "Convert user's photo into a general exaggerated 'toony' cartoon style, capturing likeness with bold lines. Display the text ''Text'' prominently, often below, in a bold cartoonish font." },
        { name: "Disney", src: s3Style("/styles/f52.webp"), basePrompt: "Create a character portrait from user's photo in a modern Disney/Pixar 3D cartoon style. Integrate the name ''Text'' elegantly below the portrait using a clean, slightly stylized font appropriate for the theme." }
      ],
      "Anime & Manga": [
        { name: "Anime", src: s3Style("/styles/f6.webp"), basePrompt: "Convert the user's photo into a dynamic anime-style avatar, capturing likeness with cel-shading/energetic pose. Include the name ''Text'', exactly as written, below in a stylized, impactful anime font." },
        { name: "Shonen", src: s3Style("/styles/f54.webp"), basePrompt: "Convert user's photo into a dynamic SHONEN anime-style avatar, capturing likeness. Include the text ''Text'' below in a bold, action-oriented font." },
        { name: "Shojo", src: s3Style("/styles/ff55.webp"), basePrompt: "Convert user's photo into a portrait in a classic 90s SHOJO anime style (large expressive eyes, soft lines), keeping likeness. Add the name ''Text'' below in an elegant, possibly script-like anime font." },
        { name: "Retro", src: s3Style("/styles/f32.webp"), basePrompt: "Convert the user's photo into a portrait logo in a classic 90s anime style (distinctive large eyes, pointed chin, cel-shading). Add the text ''Text'', exactly as written, below in a retro anime font." }
      ],
      "Kawaii & Chibi": [
        { name: "Chibi", src: s3Style("/styles/f5.webp"), basePrompt: "Create a cute chibi character avatar from user's photo, simplifying into chibi proportions while keeping features. Add the exact text ''Text'' below in a fun, rounded, bubbly font." },
        { name: "Cute", src: s3Style("/styles/f25.webp"), basePrompt: "Create a cute chibi character avatar from the user's photo, preserving key features but simplifying into chibi proportions. Add the name ''Text'', exactly as written, in a fun, bubbly font below." },
        { name: "Kawaii", src: s3Style("/styles/f56.webp"), basePrompt: "Create a cute chibi avatar from user's photo (big head, large eyes). Add the exact text ''Text'' below in a playful, bold font." }
      ],
      "Pixel Art & Retro": [
        { name: "Pixel Art", src: s3Style("/styles/f26.webp"), basePrompt: "Generate an 8-bit or 16-bit pixel art avatar based on the user's photo, simplifying features while retaining basic recognizability. Include the text ''Text'' below, rendered pixel-perfectly in a blocky pixel font." },
        { name: "8-bit", src: s3Style("/styles/f57.webp"), basePrompt: "Generate an 8-bit or 16-bit pixel art avatar based on user's photo. Include the text ''Text'' below in a clear, readable pixel font." },
        { name: "80s", src: s3Style("/styles/f58.webp"), basePrompt: "Apply an 80s retro synthwave style to the user's photo portrait (neon grids, sunset colors). Include the exact text ''Text'' below in a distinct 80s-style retro font, possibly with a neon glow." }
      ],
      "Vector & Geometric": [
        { name: "Vector", src: s3Style("/styles/f7.webp"), basePrompt: "Create a clean, minimalist avatar logo from user's photo suitable for a professional channel, simplifying features into smooth vector lines. Add the name ''Text'' below in modern, legible sans-serif typography." },
        { name: "Minimalist", src: s3Style("/styles/f8.webp"), basePrompt: "Create a clean, minimalist professional avatar logo from user's photo (face/shoulders, vector lines, flat shapes). Integrate the name ''Text'' clearly below or beside the portrait using a clean, professional sans-serif font." },
        { name: "Abstract", src: s3Style("/styles/f16.webp"), basePrompt: "Create an abstract esports avatar from user's photo, stylizing with geometric lines and glowing [blue/red/green] energy effects. Integrate the text ''Text'' within the abstract design using a clean, futuristic font." },
        { name: "Low-poly", src: s3Style("/styles/f38.webp"), basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style (angular polygons, flat colors). Add the exact text ''Text'' below using a clean sans-serif font." },
        { name: "Flat", src: s3Style("/styles/f39.webp"), basePrompt: "Create a modern flat illustration style portrait logo from the user's photo (clean shapes, minimal shading). Add the name ''Text'' below in a friendly, matching sans-serif font." },
        { name: "Black and white line art", src: s3Style("/styles/f40.webp"), basePrompt: "Design a minimalist portrait logo from user's photo using only clean, continuous black line art. Include the text ''Text'' below in a simple, thin, minimalist font." },
        { name: "Vector art", src: s3Style("/styles/f59.webp"), basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style. Add the text ''Text'' below using a clean, matching sans-serif font." },
        { name: "Illustration", src: s3Style("/styles/f60.webp"), basePrompt: "Create a modern flat illustration style portrait from user's photo. Add the name ''Text'' below in a clean, matching sans-serif font." }
      ],
      "Painterly & Sketch": [
        { name: "Watercolor", src: s3Style("/styles/f41.webp"), basePrompt: "Design a logo portrait based on user's photo with a watercolor paint effect (soft textures, splashes). Render the exact text ''Text'' below in an elegant script or serif font that complements the painterly style." },
        { name: "Oil painting", src: s3Style("/styles/f43.webp"), basePrompt: "Transform user's photo into a classical portrait logo in a textured oil painting style (visible brush strokes). Place the text ''Text'', exactly as written, below in an elegant serif font." },
        { name: "Sketch", src: s3Style("/styles/f44.webp"), basePrompt: "Convert user's photo into a realistic pencil sketch portrait logo (graphite textures, shading). Integrate the text ''Text'' below in a simple, convincing hand-written or sketch-style font." },
        { name: "Painterly", src: s3Style("/styles/f61.webp"), basePrompt: "Design a logo portrait based on user's photo with a watercolor paint effect. Render the exact text ''Text'' below using an elegant, flowing font." },
        { name: "Realistic", src: s3Style("/styles/f63.webp"), basePrompt: "Convert user's photo into a realistic pencil sketch portrait logo. Integrate the precise text ''Text'' below in a hand-written sketch font." }
      ],
      "Illustrative & Comic": [
        { name: "Monochrome", src: s3Style("/styles/f42.webp"), basePrompt: "Create a stylized portrait logo from user's photo in a black and white graphic novel inking style (bold outlines, sharp shadows). Add the text ''Text'', exactly as written, below in a dynamic comic-book style font." },
        { name: "Comic", src: s3Style("/styles/f64.webp"), basePrompt: "Create a stylized portrait from user's photo in a black and white graphic novel inking style. Add the text ''Text'' below in a matching bold comic font." }
      ],
      "Effects & Urban": [
        { name: "Magenta glitch", src: s3Style("/styles/f1.webp"), basePrompt: "Transform user's photo portrait with heavy blue/magenta glitch effects and digital distortion. Integrate the name ''Text'' below using a strongly distorted, futuristic glitch font." },
        { name: "Glitch", src: s3Style("/styles/f2.webp"), basePrompt: "Create a logo from user's photo with subtle glitch lines and intense cyan/yellow neon outlines. Integrate the name ''Text'' below in a clean but brightly glowing futuristic font." },
        { name: "Glitch Neon", src: s3Style("/styles/f3.webp"), basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the gamer tag ''Text'' as a separate, distinct glowing neon sign element below." },
        { name: "Flames", src: s3Style("/styles/f17.webp"), basePrompt: "Render user's photo as an intense esports avatar engulfed in digital flames. Integrate the exact text ''Text'' below in a sharp font with fiery effects or embers." },
        { name: "Ice", src: s3Style("/styles/f18.webp"), basePrompt: "Design an esports avatar from user's photo with an ice/frost theme. Integrate the text ''Text'' below in a cool, sharp, crystalline or frozen-style font." },
        { name: "Sticker", src: s3Style("/styles/f27.webp"), basePrompt: "Generate a logo from user's photo designed like a die-cut sticker (cartoon style, thick white border). Add the text ''Text'' below or integrated into the sticker design using a bold, clear font." },
        { name: "Graffiti", src: s3Style("/styles/f65.webp"), basePrompt: "Render the user's photo portrait in a bold streetwear/graffiti style with spray paint textures. Integrate the text ''Text'' below in a dynamic graffiti tag or bubble letter style." },
        { name: "Distorted glitch", src: s3Style("/styles/f66.webp"), basePrompt: "Transform user's photo portrait with heavy blue/magenta glitch effects. Integrate the exact name ''Text'' below using a heavily distorted glitch font." },
        { name: "Neon", src: s3Style("/styles/f67.webp"), basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the text ''Text'' below, rendered as its own neon element." },
        { name: "Cartoon sticker", src: s3Style("/styles/f68.webp"), basePrompt: "Generate a logo from user's photo like a die-cut sticker. Add the text ''Text'' clearly below in a bold, sticker-like font." }
      ],
      "Mascot & Emblem": [
        { name: "Wolf", src: s3Style("/styles/f10.webp"), basePrompt: "Fuse user's photo with wolf features for an esports mascot avatar. Integrate the exact text ''Text'' below in a bold, metallic, maybe claw-marked font." },
        { name: "Dragon", src: s3Style("/styles/f11.webp"), basePrompt: "Fuse user's photo with dragon features for an esports mascot avatar. Integrate the text ''Text'' below in a sharp, fantasy or runic font." },
        { name: "Eagle", src: s3Style("/styles/f12.webp"), basePrompt: "Fuse user's photo with eagle features for an esports mascot avatar. Integrate the name ''Text'' below in a clean, powerful, sharp font." },
        { name: "Emblem", src: s3Style("/styles/f69.webp"), basePrompt: "Create an esports emblem or badge incorporating the user's stylized face. Surround with dynamic shapes and clearly display the text ''Text'' using a bold, competitive font." },
        { name: "Cartoon animal", src: s3Style("/styles/f70.webp"), basePrompt: "Transform user's photo into a friendly cartoon animal mascot head, using their features as inspiration. Include the name ''Text'' below in a playful font matching the mascot." }
      ]
    },
    "Game Title": {
      "Shooters": [
        { name: "Apex Legends", src: s3Style("/styles/ff20.webp"), basePrompt: "Create an Apex Legends inspired avatar from user's photo, in the game's sharp style. Integrate the text ''Text'' below using a font similar to Apex Legends UI fonts." },
        { name: "Call of Duty", src: s3Style("/styles/ff21.webp"), basePrompt: "Transform user's photo into a Call of Duty style operator portrait with tactical gear. Integrate the text ''Text'' below using a modern military or stencil font." },
        { name: "Counter-Strike", src: s3Style("/styles/f100.webp"), basePrompt: "Design a logo based on user's photo in a gritty Counter-Strike style. Include the text ''Text'' below in a clean, bold sans-serif font." },
        { name: "Destiny", src: s3Style("/styles/f24.webp"), basePrompt: "Create a Destiny Guardian avatar from user's photo (Titan/Warlock/Hunter style). Integrate the text ''Text'' below using a font inspired by Destiny's UI or lore." },
        { name: "Fortnite", src: s3Style("/styles/ff25.webp"), basePrompt: "Transform user's photo into a character logo in the bright, stylized 3D cartoon art style of Fortnite. Include the text ''Text'' below in a fun, chunky font similar to the game." },
        { name: "Gears of War", src: s3Style("/styles/ff26.webp"), basePrompt: "Render user's photo as a gritty Gears of War COG soldier in bulky armor. Integrate the text ''Text'' below using the iconic Gears of War stencil font." },
        { name: "Overwatch", src: s3Style("/styles/ff24.webp"), basePrompt: "Create an Overwatch hero style portrait from user's photo in the game's clean cartoon look. Integrate the text ''Text'' below using a font similar to Overwatch's branding." },
        { name: "PUBG", src: s3Style("/styles/f28.webp"), basePrompt: "Create a Battle Royale character portrait from user's photo (PUBG style, realistic tactical gear). Integrate the text ''Text'' below in a rugged military font." },
        { name: "Rainbow Six Siege", src: s3Style("/styles/f29.webp"), basePrompt: "Design a tactical operator portrait logo from user's photo in Rainbow Six Siege style. Integrate the text ''Text'' below in a clean, technical font." },
        { name: "Valorant", src: s3Style("/styles/f30.webp"), basePrompt: "Create a modern tactical operator portrait from user's photo in Valorant agent style. Integrate the text ''Text'' below using a sharp, stylish font like Valorant's UI." },
        { name: "Battle Royale", src: s3Style("/styles/f33.webp"), basePrompt: "Create a Battle Royale character portrait based on user's photo, outfitted in realistic tactical gear (PUBG/Apex style). Integrate the exact text ''Text'' below in a rugged stencil font." },
        { name: "COD", src: s3Style("/styles/f36.webp"), basePrompt: "Create a modern tactical operator portrait from user's photo (headset, glasses, cap), high-contrast style like COD. Integrate the name ''Text'' below in a clean military-style font." },
        { name: "Free Fire", src: s3Style("/styles/f48.webp"), basePrompt: "Create a Free Fire inspired character logo from the user's photo in a vibrant, tactical style. Integrate the exact text ''Text'' below in a bold, slightly distressed font." }
      ],
      "MOBA / Strategy": [
        { name: "DOTA", src: s3Style("/styles/f31.webp"), basePrompt: "Transform user's photo into a stylized hero portrait in the painterly style of DOTA 2. Integrate the text ''Text'' below using a font fitting the DOTA 2 aesthetic." },
        { name: "League of Legends", src: s3Style("/styles/ff32.webp"), basePrompt: "Create a League of Legends champion-style portrait from user's photo in splash art style. Integrate the text ''Text'' below using the League of Legends specific font or similar." },
        { name: "Mobile Legends", src: s3Style("/styles/ff33.webp"), basePrompt: "Render user's photo as a vibrant hero character in Mobile Legends style. Integrate the text ''Text'' below using a dynamic fantasy font." },
        { name: "Starcraft", src: s3Style("/styles/f34.webp"), basePrompt: "Design a Sci-Fi portrait based on user's photo in Starcraft style. Integrate the text ''Text'' using a futuristic, blocky Starcraft-like font." },
        { name: "Warcraft", src: s3Style("/styles/ff35.webp"), basePrompt: "Transform user's photo into a character portrait in the fantasy art style of Warcraft. Integrate the text ''Text'' using the classic Warcraft font." }
      ],
      "RPG & Adventure": [
        { name: "RPG", src: s3Style("/styles/f35.webp"), basePrompt: "Depict user from photo as a fantasy adventurer in detailed RPG style. Include the text ''Text'' below using a classic fantasy or medieval font." },
        { name: "Uncharted", src: s3Style("/styles/ff36.webp"), basePrompt: "Create a dynamic action-adventure hero portrait from user's photo (Uncharted style). Integrate the text ''Text'' below in a slightly rugged adventure font." },
        { name: "Lost Ark", src: s3Style("/styles/ff37.webp"), basePrompt: "Render user's photo in the detailed MMO style of Lost Ark. Integrate the text ''Text'' below using an ornate fantasy font." },
        { name: "New World", src: s3Style("/styles/ff38.webp"), basePrompt: "Depict user from photo as a colonial-era adventurer in New World style. Integrate the text ''Text'' below using a historical serif font." },
        { name: "Zelda", src: s3Style("/styles/ff39.webp"), basePrompt: "Transform user's photo into a character portrait in the cel-shaded style of Zelda. Integrate the text ''Text'' using a font inspired by the Zelda series." }
      ],
      "Simulation & Sports": [
        { name: "FIFA", src: s3Style("/styles/ff40.webp"), basePrompt: "Create a realistic sports portrait from user's photo as a FIFA-style football player. Integrate ''Text'' below using a modern sports jersey font." },
        { name: "Rocket League", src: s3Style("/styles/ff41.webp"), basePrompt: "Design a fun logo showing user's face (cartoon style) on a Rocket League car. Add ''Text'' using a futuristic, energetic font." },
        { name: "World of Tanks", src: s3Style("/styles/ff42.webp"), basePrompt: "Create a logo showing user's face (gritty style) as a World of Tanks commander. Integrate ''Text'' using a military stencil font." },
        { name: "Forza", src: s3Style("/styles/ff43.webp"), basePrompt: "Render user's photo as a racing driver avatar (face in helmet). Integrate ''Text'' below using a sleek, fast-looking font." }
      ],
      "Sandbox & Other": [
        { name: "GTA", src: s3Style("/styles/ff44.webp"), basePrompt: "Create a logo portrait from user's photo in the illustrative style of GTA. Integrate ''Text'' using the iconic GTA 'Price Down' font or similar." },
        { name: "Mafia", src: s3Style("/styles/f45.webp"), basePrompt: "Transform user's photo into a portrait logo in the retro, noir-ish style of Mafia games. Integrate ''Text'' using a classic 1930s-50s era font." },
        { name: "Minecraft", src: s3Style("/styles/f46.webp"), basePrompt: "Render user's photo as a blocky Minecraft character avatar. Integrate ''Text'' below using a pixelated Minecraft-style font." },
        { name: "Resident Evil", src: s3Style("/styles/f47.webp"), basePrompt: "Create a gritty, survival horror portrait from user's photo, inspired by Resident Evil. Integrate ''Text'' using a distressed, horror-themed font." },
        { name: "Pixel", src: s3Style("/styles/f50.webp"), basePrompt: "Create a Minecraft-style profile picture based on the reference photo. Keep the face and main features recognizable but transform them into a pixelated Minecraft character design. Use a blocky, 3D voxel art style with sharp edges, low resolution details, and vibrant colors. Format it as a square avatar, centered on the face, with a clean simple background. Add the text ''Text'' below the avatar in a bold Minecraft font style, pixelated to match the theme." },
      ]
    },

    "Theme & Motif": {
      "Fantasy & Mythical": [
        { name: "Fantasy", src: s3Style("/styles/f19.webp"), basePrompt: "Transform the user's photo into a semi-realistic fantasy portrait avatar as an Elf. Integrate the text ''Text'' using an elegant script font." },
        { name: "Mage", src: s3Style("/styles/f20.webp"), basePrompt: "Create a fantasy portrait avatar from the user's photo as a Mage. Add the text ''Text'' using a mystical or runic font." },
        { name: "Elf", src: s3Style("/styles/f71.webp"), basePrompt: "Transform user's photo into a fantasy portrait as an Elf. Integrate ''Text'' using an elegant font." },
        { name: "Dragon", src: s3Style("/styles/f72.webp"), basePrompt: "Fuse user's photo with dragon features for an avatar. Integrate the text ''Text'' using a bold, fantasy font." },
        { name: "High Fantasy", src: s3Style("/styles/f73.webp"), basePrompt: "Create a general high-fantasy themed portrait from the user's photo (glowing runes, magical aura). Include the text ''Text'' using a magical font." }
      ],
      "SciFi, Tech & Space": [
        { name: "Podcast", src: s3Style("/styles/f9.webp"), basePrompt: "Create a professional graphic logo for podcast host ''Text'' based on photo (flat illustration style, microphone icon). Use clear, modern typography for ''Text''." },
        { name: "Mech Pilot", src: s3Style("/styles/f14.webp"),  basePrompt: "Generate esports avatar based on user's photo as a mech pilot. Integrate the text ''Text'' using a blocky, sci-fi font." },
        { name: "Power Armor", src: s3Style("/styles/f15.webp"),  basePrompt: "Create an esports avatar placing user's face inside futuristic power armor. Add the text ''Text'' using a bold tech font." },
        { name: "Cyberpunk", src: s3Style("/styles/f22.webp"), basePrompt: "Convert user's photo into a cyberpunk hacker-style avatar. Integrate the text ''Text'' using a digital glitch font." },
        { name: "Steampunk Adventurer", src: s3Style("/styles/f23.webp"), basePrompt: "Render user's photo as a Steampunk adventurer avatar. Include the text ''Text'' using an ornate Victorian font." },
        { name: "Space Explorer", src: s3Style("/styles/f24.webp"), basePrompt: "Create a sci-fi space explorer avatar from user's photo (spacesuit helmet). Add the text ''Text'' using a clean, futuristic font." },
        { name: "Cyberpunk Hacker", src: s3Style("/styles/f74.webp"), basePrompt: "Convert user's photo into a cyberpunk hacker avatar. Integrate the text ''Text'' using a glitchy digital font." },
        { name: "Space Explorer", src: s3Style("/styles/f75.webp"), basePrompt: "Create a sci-fi space explorer avatar from user's photo. Add the text ''Text'' using a clean tech font." },
        { name: "Alien", src: s3Style("/styles/f76.webp"), basePrompt: "Create an avatar blending user's photo features with stylized alien characteristics. Integrate the text ''Text'' using an alien-inspired font." },
        { name: "High-Tech", src: s3Style("/styles/f77.webp"), basePrompt: "Render user's photo portrait with a high-technology theme (circuits, HUD). Integrate the exact text ''Text'' using a crisp digital font." }
      ],
      "Warriors & Heroes": [
        { name: "Knight/Spartan", src: s3Style("/styles/f13.webp"),  basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior in a stylized helmet. Integrate ''Text'' using a strong, weathered font." },
        { name: "Rugged Warrior", src: s3Style("/styles/f21.webp"), basePrompt: "Render the user's photo as a rugged fantasy Warrior avatar (armor, face paint). Use ''Text'' using a strong, slightly rough font." },
        { name: "Knight/Spartan", src: s3Style("/styles/f79.webp"), basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior. Integrate ''Text'' using a bold, historic font." },
        { name: "Ninja", src: s3Style("/styles/f80.webp"), basePrompt: "Depict the user from their photo as a stealthy Ninja character. Integrate ''Text'' using a sharp, brush-stroke inspired font." },
        { name: "Superhero", src: s3Style("/styles/f81.webp"), basePrompt: "Turn user's photo into a dynamic superhero avatar. Integrate ''Text'' using a bold, heroic, comic-book font." }
      ],
      "Horror & Dark Themes": [
        { name: "Zombie", src: s3Style("/styles/f82.webp"), basePrompt: "Transform the user's photo into a zombie portrait logo in a gritty horror style. Integrate ''Text'' using a dripping or decayed font." },
        { name: "Ghost", src: s3Style("/styles/f83.webp"), basePrompt: "Create a ghostly apparition avatar from the user's photo (semi-transparent, glowing). Integrate ''Text'' using a wispy or ethereal font." }
      ],
      "Astrology": [
        { name: "Zodiac", src: s3Style("/styles/f84.webp"), basePrompt: "Create a mystical avatar from user's photo incorporating their zodiac sign symbol and cosmic motifs. Include ''Text'' using a celestial or elegant font." }
      ]
    },
    "Seasonal & Cultural": {
      "Holidays": [
        { name: "Dia de Muertos", src: s3Style("/styles/f85.webp"), basePrompt: "Create a Dia de Muertos themed portrait from user's photo (sugar skull makeup). Integrate ''Text'' using a decorative font." },
        { name: "Easter", src: s3Style("/styles/f86.webp"), basePrompt: "Design an Easter themed avatar from user's photo (pastel colors, bunny ears). Integrate ''Text'' using a playful script font." },
        { name: "Halloween", src: s3Style("/styles/f87.webp"), basePrompt: "Create a Halloween themed avatar from user's photo (spooky elements, costume). Integrate ''Text'' using a creepy or gothic font." },
        { name: "Christmas", src: s3Style("/styles/f88.webp"), basePrompt: "Generate a festive holiday avatar from user's photo (Santa hat, snow). Integrate ''Text'' using a festive script font." },
        { name: "Valentine's Day", src: s3Style("/styles/f89.webp"), basePrompt: "Create a Valentine's Day themed portrait from user's photo (hearts, pink/red). Integrate ''Text'' using a romantic script font." },
        { name: "St Patrick’s Day", src: s3Style("/styles/f90.webp"), basePrompt: "Design a St Patrick’s Day avatar from user's photo (leprechaun hat, green). Integrate ''Text'' using a Celtic-style font." }
      ],
      "Cultural / National": [
        { name: "Brazil", src: s3Style("/styles/f91.webp"), basePrompt: "Create a logo portrait based on user's photo incorporating colors/symbols inspired by Brazil. Integrate ''Text'' using a lively font." },
        { name: "Patriotic", src: s3Style("/styles/f92.webp"), basePrompt: "Generate a patriotic avatar from user's photo using national flag colors/symbols. Integrate ''Text'' using a strong, classic font." }
      ]
    }
  }