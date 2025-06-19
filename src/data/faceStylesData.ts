export const faceStylesData: Record<
string,
Record<string, { src: string; basePrompt: string }[]>
> = {
    "Art Style": {
      "Cartoon & Toon": [
        { src: "/styles/f4.webp", basePrompt: "Convert the user's photo into a friendly, approachable Western cartoon character logo/avatar, capturing likeness with clean lines/bright colors. The name ''Text'' MUST be integrated clearly below the character in a fun, rounded, bold font matching the cartoon style." },
        { src: "/styles/f49.webp", basePrompt: "Convert user's photo into a general exaggerated 'toony' cartoon style, capturing likeness with bold lines. Display the text ''Text'' prominently, often below, in a bold cartoonish font." },
        { src: "/styles/f52.webp", basePrompt: "Create a character portrait from user's photo in a modern Disney/Pixar 3D cartoon style. Integrate the name ''Text'' elegantly below the portrait using a clean, slightly stylized font appropriate for the theme." }
      ],
      "Anime & Manga": [
        { src: "/styles/f6.webp", basePrompt: "Convert the user's photo into a dynamic anime-style avatar, capturing likeness with cel-shading/energetic pose. Include the name ''Text'', exactly as written, below in a stylized, impactful anime font." },
        { src: "/styles/f54.webp", basePrompt: "Convert user's photo into a dynamic SHONEN anime-style avatar, capturing likeness. Include the text ''Text'' below in a bold, action-oriented font." },
        { src: "/styles/ff55.webp", basePrompt: "Convert user's photo into a portrait in a classic 90s SHOJO anime style (large expressive eyes, soft lines), keeping likeness. Add the name ''Text'' below in an elegant, possibly script-like anime font." },
        { src: "/styles/f32.webp", basePrompt: "Convert the user's photo into a portrait logo in a classic 90s anime style (distinctive large eyes, pointed chin, cel-shading). Add the text ''Text'', exactly as written, below in a retro anime font." }
      ],
      "Kawaii & Chibi": [
        { src: "/styles/f5.webp", basePrompt: "Create a cute chibi character avatar from user's photo, simplifying into chibi proportions while keeping features. Add the exact text ''Text'' below in a fun, rounded, bubbly font." },
        { src: "/styles/f25.webp", basePrompt: "Create a cute chibi character avatar from the user's photo, preserving key features but simplifying into chibi proportions. Add the name ''Text'', exactly as written, in a fun, bubbly font below." },
        { src: "/styles/f56.webp", basePrompt: "Create a cute chibi avatar from user's photo (big head, large eyes). Add the exact text ''Text'' below in a playful, bold font." }
      ],
      "Pixel Art & Retro": [
        { src: "/styles/f26.webp", basePrompt: "Generate an 8-bit or 16-bit pixel art avatar based on the user's photo, simplifying features while retaining basic recognizability. Include the text ''Text'' below, rendered pixel-perfectly in a blocky pixel font." },
        { src: "/styles/f57.webp", basePrompt: "Generate an 8-bit or 16-bit pixel art avatar based on user's photo. Include the text ''Text'' below in a clear, readable pixel font." },
        { src: "/styles/f58.webp", basePrompt: "Apply an 80s retro synthwave style to the user's photo portrait (neon grids, sunset colors). Include the exact text ''Text'' below in a distinct 80s-style retro font, possibly with a neon glow." }
      ],
      "Vector & Geometric": [
        { src: "/styles/f7.webp", basePrompt: "Create a clean, minimalist avatar logo from user's photo suitable for a professional channel, simplifying features into smooth vector lines. Add the name ''Text'' below in modern, legible sans-serif typography." },
        { src: "/styles/f8.webp", basePrompt: "Create a clean, minimalist professional avatar logo from user's photo (face/shoulders, vector lines, flat shapes). Integrate the name ''Text'' clearly below or beside the portrait using a clean, professional sans-serif font." },
        { src: "/styles/f16.webp", basePrompt: "Create an abstract esports avatar from user's photo, stylizing with geometric lines and glowing [blue/red/green] energy effects. Integrate the text ''Text'' within the abstract design using a clean, futuristic font." },
        { src: "/styles/f38.webp", basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style (angular polygons, flat colors). Add the exact text ''Text'' below using a clean sans-serif font." },
        { src: "/styles/f39.webp", basePrompt: "Create a modern flat illustration style portrait logo from the user's photo (clean shapes, minimal shading). Add the name ''Text'' below in a friendly, matching sans-serif font." },
        { src: "/styles/f40.webp", basePrompt: "Design a minimalist portrait logo from user's photo using only clean, continuous black line art. Include the text ''Text'' below in a simple, thin, minimalist font." },
        { src: "/styles/f59.webp", basePrompt: "Generate a logo portrait from user's photo in a low-poly vector art style. Add the text ''Text'' below using a clean, matching sans-serif font." },
        { src: "/styles/f60.webp", basePrompt: "Create a modern flat illustration style portrait from user's photo. Add the name ''Text'' below in a clean, matching sans-serif font." }
      ],
      "Painterly & Sketch": [
        { src: "/styles/f41.webp", basePrompt: "Design a logo portrait based on user's photo with a watercolor paint effect (soft textures, splashes). Render the exact text ''Text'' below in an elegant script or serif font that complements the painterly style." },
        { src: "/styles/f43.webp", basePrompt: "Transform user's photo into a classical portrait logo in a textured oil painting style (visible brush strokes). Place the text ''Text'', exactly as written, below in an elegant serif font." },
        { src: "/styles/f44.webp", basePrompt: "Convert user's photo into a realistic pencil sketch portrait logo (graphite textures, shading). Integrate the text ''Text'' below in a simple, convincing hand-written or sketch-style font." },
        { src: "/styles/f61.webp", basePrompt: "Design a logo portrait based on user's photo with a watercolor paint effect. Render the exact text ''Text'' below using an elegant, flowing font." },
        { src: "/styles/f63.webp", basePrompt: "Convert user's photo into a realistic pencil sketch portrait logo. Integrate the precise text ''Text'' below in a hand-written sketch font." }
      ],
      "Illustrative & Comic": [
        { src: "/styles/f42.webp", basePrompt: "Create a stylized portrait logo from user's photo in a black and white graphic novel inking style (bold outlines, sharp shadows). Add the text ''Text'', exactly as written, below in a dynamic comic-book style font." },
        { src: "/styles/f64.webp", basePrompt: "Create a stylized portrait from user's photo in a black and white graphic novel inking style. Add the text ''Text'' below in a matching bold comic font." }
      ],
      "Effects & Urban": [
        { src: "/styles/f1.webp", basePrompt: "Transform user's photo portrait with heavy blue/magenta glitch effects and digital distortion. Integrate the name ''Text'' below using a strongly distorted, futuristic glitch font." },
        { src: "/styles/f2.webp", basePrompt: "Create a logo from user's photo with subtle glitch lines and intense cyan/yellow neon outlines. Integrate the name ''Text'' below in a clean but brightly glowing futuristic font." },
        { src: "/styles/f3.webp", basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the gamer tag ''Text'' as a separate, distinct glowing neon sign element below." },
        { src: "/styles/f17.webp", basePrompt: "Render user's photo as an intense esports avatar engulfed in digital flames. Integrate the exact text ''Text'' below in a sharp font with fiery effects or embers." },
        { src: "/styles/f18.webp", basePrompt: "Design an esports avatar from user's photo with an ice/frost theme. Integrate the text ''Text'' below in a cool, sharp, crystalline or frozen-style font." },
        { src: "/styles/f27.webp", basePrompt: "Generate a logo from user's photo designed like a die-cut sticker (cartoon style, thick white border). Add the text ''Text'' below or integrated into the sticker design using a bold, clear font." },
        { src: "/styles/f65.webp", basePrompt: "Render the user's photo portrait in a bold streetwear/graffiti style with spray paint textures. Integrate the text ''Text'' below in a dynamic graffiti tag or bubble letter style." },
        { src: "/styles/f66.webp", basePrompt: "Transform user's photo portrait with heavy blue/magenta glitch effects. Integrate the exact name ''Text'' below using a heavily distorted glitch font." },
        { src: "/styles/f67.webp", basePrompt: "Generate a logo of user's face stylized with bright pink/orange neon outlines. Integrate the text ''Text'' below, rendered as its own neon element." },
        { src: "/styles/f68.webp", basePrompt: "Generate a logo from user's photo like a die-cut sticker. Add the text ''Text'' clearly below in a bold, sticker-like font." }
      ],
      "Mascot & Emblem": [
        { src: "/styles/f10.webp", basePrompt: "Fuse user's photo with wolf features for an esports mascot avatar. Integrate the exact text ''Text'' below in a bold, metallic, maybe claw-marked font." },
        { src: "/styles/f11.webp", basePrompt: "Fuse user's photo with dragon features for an esports mascot avatar. Integrate the text ''Text'' below in a sharp, fantasy or runic font." },
        { src: "/styles/f12.webp", basePrompt: "Fuse user's photo with eagle features for an esports mascot avatar. Integrate the name ''Text'' below in a clean, powerful, sharp font." },
        { src: "/styles/f19.webp", basePrompt: "Create an esports emblem or badge incorporating the user's stylized face (from photo) in the center. Surround with sharp shapes and integrate the team name ''Text'' prominently within the emblem using a strong esports font." },
        { src: "/styles/f69.webp", basePrompt: "Create an esports emblem or badge incorporating the user's stylized face. Surround with dynamic shapes and clearly display the text ''Text'' using a bold, competitive font." },
        { src: "/styles/f70.webp", basePrompt: "Transform user's photo into a friendly cartoon animal mascot head, using their features as inspiration. Include the name ''Text'' below in a playful font matching the mascot." }
      ]
    },
    "Game Title": {
      "Shooters (FPS/TPS)": [
        { src: "/styles/f20.webp", basePrompt: "Create an Apex Legends inspired avatar from user's photo, in the game's sharp style. Integrate the text ''Text'' below using a font similar to Apex Legends UI fonts." },
        { src: "/styles/f21.webp", basePrompt: "Transform user's photo into a Call of Duty style operator portrait with tactical gear. Integrate the text ''Text'' below using a modern military or stencil font." },
        { src: "/styles/f22.webp", basePrompt: "Design a logo based on user's photo in a gritty Counter-Strike style (CT or T avatar). Include the text ''Text'' below in a clean, bold sans-serif font." },
        { src: "/styles/f24.webp", basePrompt: "Create a Destiny Guardian avatar from user's photo (Titan/Warlock/Hunter style). Integrate the text ''Text'' below using a font inspired by Destiny's UI or lore." },
        { src: "/styles/ff25.webp", basePrompt: "Transform user's photo into a character logo in the bright, stylized 3D cartoon art style of Fortnite. Include the text ''Text'' below in a fun, chunky font similar to the game." },
        { src: "/styles/ff26.webp", basePrompt: "Render user's photo as a gritty Gears of War COG soldier in bulky armor. Integrate the text ''Text'' below using the iconic Gears of War stencil font." },
        { src: "/styles/f27.webp", basePrompt: "Create an Overwatch hero style portrait from user's photo in the game's clean cartoon look. Integrate the text ''Text'' below using a font similar to Overwatch's branding." },
        { src: "/styles/f28.webp", basePrompt: "Create a Battle Royale character portrait from user's photo (PUBG style, realistic tactical gear). Integrate the text ''Text'' below in a rugged military font." },
        { src: "/styles/f29.webp", basePrompt: "Design a tactical operator portrait logo from user's photo in Rainbow Six Siege style. Integrate the text ''Text'' below in a clean, technical font." },
        { src: "/styles/f30.webp", basePrompt: "Create a modern tactical operator portrait from user's photo in Valorant agent style. Integrate the text ''Text'' below using a sharp, stylish font like Valorant's UI." },
        { src: "/styles/f33.webp", basePrompt: "Create a Battle Royale character portrait based on user's photo, outfitted in realistic tactical gear (PUBG/Apex style). Integrate the exact text ''Text'' below in a rugged stencil font." },
        { src: "/styles/f36.webp", basePrompt: "Create a modern tactical operator portrait from user's photo (headset, glasses, cap), high-contrast style like COD/Valorant. Integrate the name ''Text'' below in a clean military-style font." },
        { src: "/styles/f48.webp", basePrompt: "Create a Free Fire inspired character logo from the user's photo in a vibrant, tactical style. Integrate the exact text ''Text'' below in a bold, slightly distressed font." }
      ],
      "MOBA / Strategy": [
        { src: "/styles/f31.webp", basePrompt: "Transform user's photo into a stylized hero portrait in the painterly style of DOTA 2. Integrate the text ''Text'' below using a font fitting the DOTA 2 aesthetic." },
        { src: "/styles/ff32.webp", basePrompt: "Create a League of Legends champion-style portrait from user's photo in splash art style. Integrate the text ''Text'' below using the League of Legends specific font or similar." },
        { src: "/styles/ff33.webp", basePrompt: "Render user's photo as a vibrant hero character in Mobile Legends style. Integrate the text ''Text'' below using a dynamic fantasy font." },
        { src: "/styles/f34.webp", basePrompt: "Design a Sci-Fi portrait based on user's photo in Starcraft style. Integrate the text ''Text'' using a futuristic, blocky Starcraft-like font." },
        { src: "/styles/ff35.webp", basePrompt: "Transform user's photo into a character portrait in the fantasy art style of Warcraft. Integrate the text ''Text'' using the classic Warcraft font." }
      ],
      "RPG & Adventure": [
        { src: "/styles/f35.webp", basePrompt: "Depict user from photo as a fantasy adventurer in detailed RPG style. Include the text ''Text'' below using a classic fantasy or medieval font." },
        { src: "/styles/ff36.webp", basePrompt: "Create a dynamic action-adventure hero portrait from user's photo (Uncharted style). Integrate the text ''Text'' below in a slightly rugged adventure font." },
        { src: "/styles/ff37.webp", basePrompt: "Render user's photo in the detailed MMO style of Lost Ark. Integrate the text ''Text'' below using an ornate fantasy font." },
        { src: "/styles/ff38.webp", basePrompt: "Depict user from photo as a colonial-era adventurer in New World style. Integrate the text ''Text'' below using a historical serif font." },
        { src: "/styles/ff39.webp", basePrompt: "Transform user's photo into a character portrait in the cel-shaded style of Zelda. Integrate the text ''Text'' using a font inspired by the Zelda series." }
      ],
      "Simulation & Sports": [
        { src: "/styles/ff40.webp", basePrompt: "Create a realistic sports portrait from user's photo as a FIFA-style football player. Integrate ''Text'' below using a modern sports jersey font." },
        { src: "/styles/ff41.webp", basePrompt: "Design a fun logo showing user's face (cartoon style) on a Rocket League car. Add ''Text'' using a futuristic, energetic font." },
        { src: "/styles/ff42.webp", basePrompt: "Create a logo showing user's face (gritty style) as a World of Tanks commander. Integrate ''Text'' using a military stencil font." },
        { src: "/styles/ff43.webp", basePrompt: "Render user's photo as a racing driver avatar (face in helmet). Integrate ''Text'' below using a sleek, fast-looking font." }
      ],
      "Sandbox & Other": [
        { src: "/styles/ff44.webp", basePrompt: "Create a logo portrait from user's photo in the illustrative style of GTA. Integrate ''Text'' using the iconic GTA 'Price Down' font or similar." },
        { src: "/styles/f45.webp", basePrompt: "Transform user's photo into a portrait logo in the retro, noir-ish style of Mafia games. Integrate ''Text'' using a classic 1930s-50s era font." },
        { src: "/styles/f46.webp", basePrompt: "Render user's photo as a blocky Minecraft character avatar. Integrate ''Text'' below using a pixelated Minecraft-style font." },
        { src: "/styles/f47.webp", basePrompt: "Create a gritty, survival horror portrait from user's photo, inspired by Resident Evil. Integrate ''Text'' using a distressed, horror-themed font." }
      ]
    },

    "Theme & Motif": {
      "Fantasy & Mythical": [
        { src: "/styles/f19.webp", basePrompt: "Transform the user's photo into a semi-realistic fantasy portrait avatar as an Elf. Integrate the text ''Text'' using an elegant script font." },
        { src: "/styles/f20.webp", basePrompt: "Create a fantasy portrait avatar from the user's photo as a Mage. Add the text ''Text'' using a mystical or runic font." },
        { src: "/styles/f71.webp", basePrompt: "Transform user's photo into a fantasy portrait as an Elf. Integrate ''Text'' using an elegant font." },
        { src: "/styles/f72.webp", basePrompt: "Fuse user's photo with dragon features for an avatar. Integrate the text ''Text'' using a bold, fantasy font." },
        { src: "/styles/f73.webp", basePrompt: "Create a general high-fantasy themed portrait from the user's photo (glowing runes, magical aura). Include the text ''Text'' using a magical font." }
      ],
      "SciFi, Tech & Space": [
        { src: "/styles/f9.webp", basePrompt: "Create a professional graphic logo for podcast host ''Text'' based on photo (flat illustration style, microphone icon). Use clear, modern typography for ''Text''." },
        { src: "/styles/f14.webp",  basePrompt: "Generate esports avatar based on user's photo as a mech pilot. Integrate the text ''Text'' using a blocky, sci-fi font." },
        { src: "/styles/f15.webp",  basePrompt: "Create an esports avatar placing user's face inside futuristic power armor. Add the text ''Text'' using a bold tech font." },
        { src: "/styles/f22.webp", basePrompt: "Convert user's photo into a cyberpunk hacker-style avatar. Integrate the text ''Text'' using a digital glitch font." },
        { src: "/styles/f23.webp", basePrompt: "Render user's photo as a Steampunk adventurer avatar. Include the text ''Text'' using an ornate Victorian font." },
        { src: "/styles/f24.webp", basePrompt: "Create a sci-fi space explorer avatar from user's photo (spacesuit helmet). Add the text ''Text'' using a clean, futuristic font." },
        { src: "/styles/f74.webp", basePrompt: "Convert user's photo into a cyberpunk hacker avatar. Integrate the text ''Text'' using a glitchy digital font." },
        { src: "/styles/f75.webp", basePrompt: "Create a sci-fi space explorer avatar from user's photo. Add the text ''Text'' using a clean tech font." },
        { src: "/styles/f76.webp", basePrompt: "Create an avatar blending user's photo features with stylized alien characteristics. Integrate the text ''Text'' using an alien-inspired font." },
        { src: "/styles/f77.webp", basePrompt: "Render user's photo portrait with a high-technology theme (circuits, HUD). Integrate the exact text ''Text'' using a crisp digital font." }
      ],
      "Warriors & Heroes": [
        { src: "/styles/f13.webp",  basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior in a stylized helmet. Integrate ''Text'' using a strong, weathered font." },
        { src: "/styles/f21.webp", basePrompt: "Render the user's photo as a rugged fantasy Warrior avatar (armor, face paint). Use ''Text'' using a strong, slightly rough font." },
        { src: "/styles/f79.webp", basePrompt: "Transform user's photo into an avatar as a Knight/Spartan warrior. Integrate ''Text'' using a bold, historic font." },
        { src: "/styles/f80.webp", basePrompt: "Depict the user from their photo as a stealthy Ninja character. Integrate ''Text'' using a sharp, brush-stroke inspired font." },
        { src: "/styles/f81.webp", basePrompt: "Turn user's photo into a dynamic superhero avatar. Integrate ''Text'' using a bold, heroic, comic-book font." }
      ],
      "Horror & Dark Themes": [
        { src: "/styles/f82.webp", basePrompt: "Transform the user's photo into a zombie portrait logo in a gritty horror style. Integrate ''Text'' using a dripping or decayed font." },
        { src: "/styles/f83.webp", basePrompt: "Create a ghostly apparition avatar from the user's photo (semi-transparent, glowing). Integrate ''Text'' using a wispy or ethereal font." }
      ],
      "Astrology": [
        { src: "/styles/f84.webp", basePrompt: "Create a mystical avatar from user's photo incorporating their zodiac sign symbol and cosmic motifs. Include ''Text'' using a celestial or elegant font." }
      ]
    },
    "Seasonal & Cultural": {
      "Holidays": [
        { src: "/styles/f85.webp", basePrompt: "Create a Dia de Muertos themed portrait from user's photo (sugar skull makeup). Integrate ''Text'' using a decorative font." },
        { src: "/styles/f86.webp", basePrompt: "Design an Easter themed avatar from user's photo (pastel colors, bunny ears). Integrate ''Text'' using a playful script font." },
        { src: "/styles/f87.webp", basePrompt: "Create a Halloween themed avatar from user's photo (spooky elements, costume). Integrate ''Text'' using a creepy or gothic font." },
        { src: "/styles/f88.webp", basePrompt: "Generate a festive holiday avatar from user's photo (Santa hat, snow). Integrate ''Text'' using a festive script font." },
        { src: "/styles/f89.webp", basePrompt: "Create a Valentine's Day themed portrait from user's photo (hearts, pink/red). Integrate ''Text'' using a romantic script font." },
        { src: "/styles/f90.webp", basePrompt: "Design a St Patrick’s Day avatar from user's photo (leprechaun hat, green). Integrate ''Text'' using a Celtic-style font." }
      ],
      "Cultural / National": [
        { src: "/styles/f91.webp", basePrompt: "Create a logo portrait based on user's photo incorporating colors/symbols inspired by Brazil. Integrate ''Text'' using a lively font." },
        { src: "/styles/f92.webp", basePrompt: "Generate a patriotic avatar from user's photo using national flag colors/symbols. Integrate ''Text'' using a strong, classic font." }
      ]
    }
  }