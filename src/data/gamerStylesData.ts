import { s3Style } from "~/utils/s3Paths";

export const gamerStylesData: Record<
string,
Record<string, { src: string; basePrompt: string }[]>
> = {
  "Game Titles": { 
    "Fortnite": [
      {
        src: s3Style("/styles/s640.webp"),
        
        basePrompt: "A Fortnite-style gaming logo for a team called ''Text'' — includes a cartoonish masked hero mascot holding a glowing pickaxe, bold blocky text ''Text'' underneath, vibrant neon blue and purple color scheme, glowing outline, dynamic comic-style pose, slight 3D effect, clean background, esports logo, high detail, Fortnite aesthetic",
      },
      {
        src: s3Style("/styles/s641.webp"),
        
        basePrompt: "A Fortnite-style gaming logo for a team called ''Text'' — includes a cartoonish masked hero mascot holding a glowing pickaxe, bold blocky text ''Text'', neon blue and purple glow, dynamic comic-style pose, futuristic background, clean esports look",
      },
      {
        src: s3Style("/styles/s642.webp"),
        
        basePrompt: "A Fortnite-style mascot logo for ''Text'' — a flying character with a jetpack and sniper rifle, electric teal and pink colors, dramatic action pose, futuristic sky elements, glowing stylized text ''Text'' below, modern cartoon design, esports-ready",
      },
      {
        src: s3Style("/styles/s643.webp"),
        
        basePrompt: "Gaming logo in Fortnite style for ''Text'' — features a cute but aggressive cartoon llama with shades and a golden crown, bright rainbow and turquoise colors, playful font ''Text'' underneath, outlined in neon glow, comic-style layout, fun esports look",
      },
      {
        src: s3Style("/styles/s644.webp"),
        
        basePrompt: "A Fortnite-inspired logo for team ''Text'' — includes a robot builder mascot holding building tools, bold 3D block letters ''Text'', glowing green and orange color scheme, digital blueprint background, sharp outlines, gaming/esports design",
      },
      {
        src: s3Style("/styles/s645.webp"),
        
        basePrompt: "A Fortnite-style abstract mascot logo for ''Text'' — features a cyber ninja with energy blades, electric blue and red contrast, glitch effects, aggressive pose, text ''Text'' in digital blocky font, neon glow, esports-grade polish",
      },
      {
        src: s3Style("/styles/s646.webp"),
        
        basePrompt: "Fortnite-style gaming logo for ''Text'' — a secret agent banana character wearing a tuxedo, holding a futuristic pistol, bold gold and black color combo, comic book pose, text ''Text'' in playful military font, stylized icon with cartoon finish",
      },
      {
        src: s3Style("/styles/s647.webp"),
        
        basePrompt: "A mascot logo in Fortnite style for ''Text'' — features a storm-powered soldier with glowing hands and lightning effects, purple and white color palette, bold angular font ''Text'', outlined with electric blue neon, dynamic background, esports style",
      },
      {
        src: s3Style("/styles/s648.webp"),
        
        basePrompt: "Fortnite-style logo for gaming team ''Text'' — includes a toxic mutant character with green glowing eyes and gas mask, dripping neon green and black color scheme, toxic barrel prop, graffiti-style text ''Text'', high-energy comic design",
      },
      {
        src: s3Style("/styles/s649.webp"),
        
        basePrompt: "Gaming logo in Fortnite-style for team ''Text'' — fierce cybernetic wolf howling at a digital moon, dark blue and silver tones, glowing claw marks in background, stylized text ''Text'' with futuristic font, esport-ready branding",
      },
      {
        src: s3Style("/styles/s650.webp"),
        
        basePrompt: "Fortnite-themed pixel art gaming logo for team ''Text'' — 8-bit style character with rocket launcher, fun color palette of pink, yellow, and aqua, pixelated explosion behind, retro blocky text ''Text'', clean square layout, energetic design",
      },
      
    ],
    "Minecraft": [
      {
        src: s3Style("/styles/s701.webp"),
        
        basePrompt: "Create a Minecraft-inspired mascot logo of a Creeper with glowing green pixel energy, blocky style, and place the text 'Text' in bold pixel font beneath.",
      },
      {
        src: s3Style("/styles/s702.webp"),
        
        basePrompt: "Design a Minecraft warrior mascot holding a diamond sword, blocky armor glowing with neon edges, with the name 'Text' in Minecraft-style pixel text.",
      },
      {
        src: s3Style("/styles/s703.webp"),
        
        basePrompt: "Generate a mascot logo of an Enderman with glowing purple eyes, surrounded by floating blocks, with bold blocky text 'Text' at the bottom.",
      },
      {
        src: s3Style("/styles/s704.webp"),
        
        basePrompt: "Design a Minecraft wolf mascot with pixel fur, glowing effects, aggressive pose, and include the text [USER TEXT] in pixelated font style.",
      },
      {
        src: s3Style("/styles/s705.webp"),
        
        basePrompt: "Create a Minecraft villager mascot with emerald effects, glowing blocky outlines, and the name 'Text' below in blocky pixel typography.",
      },
      {
        src: s3Style("/styles/s706.webp"),
        
        basePrompt: "Design a Minecraft block emblem logo, with grass, dirt, and stone textures forming a shield, and the text 'Text' engraved in pixel art style.",
      },
      {
        src: s3Style("/styles/s707.webp"),
        
        basePrompt: "Create a Minecraft gaming logo featuring crossed diamond pickaxes, glowing effects, and bold blocky text 'Text' beneath.",
      },
      {
        src: s3Style("/styles/s708.webp"),
        
        basePrompt: "Generate a Minecraft-inspired logo with a diamond sword stuck in a glowing block, with 'Text' in bold pixelated font across.",
      },
      {
        src: s3Style("/styles/s709.webp"),
        
        basePrompt: "Design a Minecraft badge-style logo with pixel clouds, sun, and grass blocks, with the team name 'Text' in retro pixel typography.",
      },
      {
        src: s3Style("/styles/s710.webp"),
        
        basePrompt: "Create a Minecraft cave logo with ores glowing in the background, pickaxe and sword crossing, and bold pixel text 'Text' at the center.",
      },
    ],
    "Apex Legends": [
      {
        src: s3Style("/styles/s300.webp"),
        
        basePrompt: "A logo for ''Text'' inspired by Apex Legends. The text ''Text'' is styled in bold, futuristic typography, surrounded by dynamic energy lines and iconic Apex Legends symbols. The background features a battle-ready landscape with vibrant colors, capturing the essence of intense gameplay and teamwork.",
      },
      {
        src: s3Style("/styles/s301.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on Apex Legends. The text ''Text'' uses sleek, modern fonts with metallic accents, integrated with Apex Legends' signature characters and vibrant colors, set against a backdrop of a futuristic battlefield.",
      },
      {
        src: s3Style("/styles/s302.webp"),
        
        basePrompt: "Create an Apex Legends-themed logo for ''Text''. The text ''Text'' is in sharp, angular fonts with neon highlights, featuring Apex Legends' iconic weapons and characters in the background, embodying the game's competitive spirit.",
      },
      {
        src: s3Style("/styles/s303.webp"),
        
        basePrompt: "A dynamic logo for ''Text'' inspired by Apex Legends. The text ''Text'' is bold and stylized, surrounded by the game's legend icons and vibrant energy effects, set against a backdrop of a futuristic cityscape.",
      },
      {
        src: s3Style("/styles/s304.webp"),
        
        basePrompt: "Design ''Text'' as an Apex Legends logo. The text ''Text'' incorporates elements from the game, such as advanced technology motifs and bright color accents, set in a high-energy, action-packed scene.",
      },
      {
        src: s3Style("/styles/s305.webp"),
        
        basePrompt: "Create a stylized logo for ''Text'' based on Apex Legends. The text ''Text'' features futuristic fonts with glowing edges, integrated with elements like the game's legends and weaponry, against a vibrant, action-oriented background.",
      },
      {
        src: s3Style("/styles/s306.webp"),
        
        basePrompt: "A professional logo for ''Text'' inspired by Apex Legends. The text ''Text'' is designed with sleek lines and sharp angles, featuring iconic Apex Legends symbols and a dynamic color palette that reflects the game's intensity.",
      },
      {
        src: s3Style("/styles/s307.webp"),
        
        basePrompt: "Create an Apex Legends-themed design for ''Text''. The text ''Text'' is in bold, modern typography with integrated game elements like legends and futuristic landscapes, set against a high-energy color scheme.",
      },
      {
        src: s3Style("/styles/s308.webp"),
        
        basePrompt: "A vibrant logo for ''Text'' inspired by Apex Legends. The text ''Text'' uses dynamic fonts with neon accents, surrounded by action-packed graphics and iconic game elements, capturing the competitive essence of Apex Legends.",
      },
      {
        src: s3Style("/styles/s309.webp"),
        
        basePrompt: "Design a creative Apex Legends logo for ''Text''. The text ''Text'' features futuristic fonts and vibrant colors, integrated with the game's legends and high-tech weaponry, set against a backdrop of a futuristic battlefield.",
      },
    ],
    "Call of Duty": [
      {
        src: s3Style("/styles/s310.webp"),
        
        basePrompt: "A logo for ''Text'' themed around Call of Duty. The text ''Text'' is rendered in rugged, military-inspired fonts, adorned with camouflage patterns and tactical gear elements. The backdrop showcases a battlefield scene with bold, aggressive colors, reflecting the high-stakes action of the game.",
      },
      {
        src: s3Style("/styles/s311.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on Call of Duty. The text ''Text'' uses sturdy, bold fonts with metallic accents, integrated with Call of Duty's signature weapons and soldiers, set against a backdrop of a war-torn landscape.",
      },
      {
        src: s3Style("/styles/s312.webp"),
        
        basePrompt: "Create a Call of Duty-themed logo for ''Text''. The text ''Text'' is in strong, angular fonts with tactical elements and military symbols in the background, embodying the game's intense combat spirit.",
      },
      {
        src: s3Style("/styles/s313.webp"),
        
        basePrompt: "A dynamic logo for ''Text'' inspired by Call of Duty. The text ''Text'' is bold and stylized, surrounded by the game's iconic soldiers and weaponry, set against a backdrop of a warzone with explosive color effects.",
      },
      {
        src: s3Style("/styles/s314.webp"),
        
        basePrompt: "Develop an intense Call of Duty emblem for ''Text''. The text ''Text'' should incorporate advanced weapon motifs, robust typography, and strong color contrasts to showcase action-packed warfare.",
      },
      {
        src: s3Style("/styles/s315.webp"),
        
        basePrompt: "Create a stylized logo for ''Text'' based on Call of Duty. The text ''Text'' features strong, military-style fonts with glowing edges, integrated with elements like soldiers and modern warfare equipment, against a bold, action-oriented background.",
      },
      {
        src: s3Style("/styles/s316.webp"),
        
        basePrompt: "A professional logo for ''Text'' inspired by Call of Duty. The text ''Text'' is designed with solid lines and strong angles, featuring iconic Call of Duty symbols and a dynamic color palette that reflects the game's intensity.",
      },
      {
        src: s3Style("/styles/s317.webp"),
        
        basePrompt: "Create a Call of Duty-themed design for ''Text''. The text ''Text'' is in bold, military-inspired typography with integrated game elements like soldiers and weaponry, set against a high-energy color scheme.",
      },
      {
        src: s3Style("/styles/s318.webp"),
        
        basePrompt: "A vibrant logo for ''Text'' inspired by Call of Duty. The text ''Text'' uses dynamic fonts with tactical accents, surrounded by action-packed graphics and iconic game elements like rifles and grenades, capturing the competitive essence of Call of Duty.",
      },
      {
        src: s3Style("/styles/s319.webp"),
        
        basePrompt: "Design a creative Call of Duty logo for ''Text''. The text ''Text'' features strong, bold fonts and vibrant colors, integrated with the game's soldiers and high-tech weaponry, set against a backdrop of a battlefield with explosive effects.",
      },
    ],
    "Counter-Strike": [
    {
      src: s3Style("/styles/s320.webp"),
      
      basePrompt:
        "Design a tactical Counter-Strike-themed gaming logo for ''Text''. Use gritty, military-style fonts with weapon silhouettes and a bold, urban color palette."
    },
    {
      src: s3Style("/styles/s321.webp"),
      
      basePrompt:
        "Create a Counter-Strike logo for ''Text''. Incorporate sleek, modern lettering, camouflage or city rubble textures, and iconic CSGO gear for a high-stakes combat vibe."
    },
    {
      src: s3Style("/styles/s322.webp"),
      
      basePrompt:
        "Forge a dynamic Counter-Strike logo for ''Text''. Use edgy fonts, references to flashbangs or rifles, and a dark, intense backdrop to reflect competitive shooter energy."
    },
    {
      src: s3Style("/styles/s323.webp"),
      
      basePrompt:
        "Develop an action-ready Counter-Strike design for ''Text''. Combine bold, mission-focused text with sniper scope or bomb-defusal motifs, evoking intense strategic gameplay."
    },
    /*{
      src: s3Style("/styles/s324.webp"),
      
      basePrompt:
        "Craft a stealthy Counter-Strike logo for ''Text''. Employ angular fonts, minimal neon outlines, and details like special ops masks or tactical knives, conveying deadly precision."
    },*/
    {
      src: s3Style("/styles/s325.webp"),
      
      basePrompt:
        "Create a professional Counter-Strike logo for ''Text''. Use strong, blocky lettering, subtle bullet hole effects, and team-based color schemes to capture squad-based warfare."
    },
    {
      src: s3Style("/styles/s326.webp"),
      
      basePrompt:
        "Design a high-impact Counter-Strike emblem for ''Text''. Combine bold, modern fonts with references to grenades or headshots, set against an electrifying tournament backdrop."
    },
    {
      src: s3Style("/styles/s327.webp"),
      
      basePrompt:
        "Generate a gritty Counter-Strike-themed logo for ''Text''. Use hard-edged typography, metallic textures, and iconic terrorist or counter-terrorist silhouettes for an immersive warzone feel."
    },
    {
      src: s3Style("/styles/s328.webp"),
      
      basePrompt:
        "Develop a creative Counter-Strike logo for ''Text''. Merge aggressive fonts with a blend of explosions, bullet casings, and urban map references, highlighting adrenaline-fueled gameplay."
    },
    {
      src: s3Style("/styles/s329.webp"),
      
      basePrompt:
        "Produce a modern Counter-Strike gaming logo for ''Text''. Incorporate strong typography, tactical gear icons, and dynamic lighting to evoke the tension and speed of the game."
    },
    {
      src: s3Style("/styles/s330.webp"),
      
      basePrompt:
        "Design an e-sports Counter-Strike mascot logo for ''Text''. Feature a masked operative or soldier in bold outlines and edgy fonts, capturing intense tactical energy."
    },
    {
      src: s3Style("/styles/s331.webp"),
      
      basePrompt:
        "Create a Counter-Strike e-sports emblem for ''Text''. Show a fierce commando or sniper with neon highlights, bold typography, and a gritty urban palette."
    },
    {
      src: s3Style("/styles/s332.webp"),
      
      basePrompt:
        "Forge a modern CSGO-style logo for ''Text''. Use a dynamic crouched soldier or crosshair icon, bold blocky fonts, and dramatic lighting reminiscent of e-sports events."
    },
    {
      src: s3Style("/styles/s333.webp"),
      
      basePrompt:
        "Develop a Counter-Strike mascot logo for ''Text''. Portray a special ops figure or assault rifle silhouette, paired with sharp, angular text and intense color contrasts."
    },
    {
      src: s3Style("/styles/s334.webp"),
      
      basePrompt:
        "Craft a neon-touched CSGO e-sports logo for ''Text''. Center on a stylish commando mask or pistol, bold stylized fonts, and glowing accents for a tournament-ready look."
    },
    {
      src: s3Style("/styles/s335.webp"),
      
      basePrompt:
        "Create a tactical Counter-Strike icon for ''Text''. Feature a menacing CT or T figure with edgy line art, bold uppercase lettering, and steel-gray to neon color transitions."
    },
    {
      src: s3Style("/styles/s336.webp"),
      
      basePrompt:
        "Design an aggressive CSGO clan logo for ''Text''. Incorporate a hooded operative or bullet shell motif, with strong color blocks and stylized e-sports typography."
    },
    {
      src: s3Style("/styles/s337.webp"),
      
      basePrompt:
        "Generate a gritty Counter-Strike-themed logo for ''Text''. Use hard-edged typography, metallic textures, and iconic terrorist or counter-terrorist silhouettes for an immersive warzone feel."
    },
    {
      src: s3Style("/styles/s338.webp"),
      
      basePrompt:
        "Develop a creative Counter-Strike logo for ''Text''. Merge aggressive fonts with a blend of explosions, bullet casings, and urban map references, highlighting adrenaline-fueled gameplay."
    },
    {
      src: s3Style("/styles/s339.webp"),
      
      basePrompt:
        "Produce a modern Counter-Strike gaming logo for ''Text''. Incorporate strong typography, tactical gear icons, and dynamic lighting to evoke the tension and speed of the game."
    }
  ],
  "Cyberpunk 2077": [
    {
      src: s3Style("/styles/s340.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' in a neon dystopia. The text ''Text'' glows with circuit-like patterns, while a cybernetic skull or robotic figure exudes intense futuristic vibes."
    },
    {
      src: s3Style("/styles/s341.webp"),
      
      basePrompt: "An e-sports crest for ''Text'' inspired by Cyberpunk 2077. The text ''Text'' is bold and metallic, surrounded by neon wires and glitch effects, reflecting a high-tech urban underworld."
    },
    {
      src: s3Style("/styles/s342.webp"),
      
      basePrompt: "An e-sports style logo for ''Text'' featuring a futuristic wolf head with integrated LED elements. The text ''Text'' beams in neon pink and teal against a gritty city backdrop."
    },
    {
      src: s3Style("/styles/s343.webp"),
      
      basePrompt: "A neon-inspired e-sports emblem for ''Text'' with angular cyber armor. The text ''Text'' is outlined by holographic lines, capturing the essence of a futuristic combat arena."
    },
    {
      src: s3Style("/styles/s344.webp"),
      
      basePrompt: "A hardcore e-sports mascot design for ''Text'' featuring a techno-samurai. The text ''Text'' glows in bold red neon, blending ancient warrior aesthetics with futuristic elements."
    },
    {
      src: s3Style("/styles/s345.webp"),
      
      basePrompt: "A logo for ''Text'' that embraces the edgy style of Cyberpunk 2077. The text ''Text'' has a metallic sheen, accompanied by neon city silhouettes and circuit-inspired graphics."
    },
    {
      src: s3Style("/styles/s346.webp"),
      
      basePrompt: "A logo for ''Text'' showcasing a neon-lit skyline with towering holograms. The text ''Text'' appears in glitchy, sci-fi typography, hinting at technological rebellion."
    },
    {
      src: s3Style("/styles/s347.webp"),
      
      basePrompt: "A logo for ''Text'' merging street graffiti style with cybernetic details. The text ''Text'' is outlined by glowing wires, symbolizing the gritty, high-tech underbelly."
    },
    {
      src: s3Style("/styles/s348.webp"),
      
      basePrompt: "A futuristic neon fractal design for 'Text.' The text ''Text'' is embedded in a pulsating circuit board pattern, reflecting the edgy vibe of a cybernetic future."
    },
    {
      src: s3Style("/styles/s349.webp"),
      
      basePrompt: "A logo for ''Text'' with a bold mix of chrome and neon aesthetics. The text ''Text'' features glitch effects, highlighting the electrifying world of Cyberpunk 2077."
    }
  ],
  "Free Fire": [
        {
          src: s3Style("/styles/s0.webp"),
          
          basePrompt: "An e-sport logo for ''Text'' inspired by Free Fire. The text ''Text'' is styled in bold, fiery typography with sharp edges, surrounded by sleek flames and Free Fire’s iconic weapons. The design features a compact, badge-like shape with a rugged battleground background in vibrant tropical tones, exuding a fierce, competitive vibe."
        },
        {
          src: s3Style("/styles/s1.webp"),
          
          basePrompt: "Design an e-sport logo for ''Text'' based on Free Fire. The text ''Text'' uses sleek, modern fonts with glowing ember accents, framed in a shield-like structure. Integrated with Free Fire’s signature character silhouettes and bold colors, it’s set against a minimal island battlefield outline, perfect for a pro gaming team."
        },
        {
          src: s3Style("/styles/s2.webp"),
          
          basePrompt: "Create a Free Fire-themed e-sport logo for ''Text''. The text ''Text'' is in sharp, angular fonts with neon highlights, encased in a geometric emblem. Featuring Free Fire’s iconic weaponry and survival gear, the design captures a high-stakes, competitive edge with a clean, team-ready look."
        },
        {
          src: s3Style("/styles/s3.webp"),
          
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by Free Fire. The text ''Text'' is bold and stylized with a metallic sheen, surrounded by compact character icons and explosive accents. Framed in a circular badge, it’s set against a subtle tropical warzone texture, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s4.webp"),
          
          basePrompt: "Design ''Text'' as a Free Fire e-sport logo. The text ''Text'' is crafted with rugged, futuristic fonts and fiery outlines, integrated into a hexagonal emblem with survival motifs and bold accents. The design is sleek and aggressive, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s5.webp"),
          
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on Free Fire. The text ''Text'' features rugged fonts with glowing edges, paired with a minimalist Free Fire weapon icon. Encased in a sharp, angular frame, it’s set against a vibrant, team-focused color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s6.webp"),
          
          basePrompt: "A professional e-sport logo for ''Text'' inspired by Free Fire. The text ''Text'' is designed with sleek lines and bold angles, centered in a streamlined crest. Featuring Free Fire’s iconic symbols and a dynamic color palette, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s7.webp"),
          
          basePrompt: "Create a Free Fire-themed e-sport design for ''Text''. The text ''Text'' is in bold, modern typography with subtle tropical accents, integrated into a symmetrical badge. Paired with character and weapon icons, it’s set in a high-energy scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s8.webp"),
          
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by Free Fire. The text ''Text'' uses dynamic fonts with fiery gradients, framed in a bold, circular emblem. Surrounded by action-packed Free Fire elements, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s9.webp"),
          
          basePrompt: "Design a creative Free Fire e-sport logo for ''Text''. The text ''Text'' features bold, futuristic fonts with vibrant overlays, centered in a jagged, team-oriented crest. Integrated with Free Fire’s survival weaponry and characters, it’s a striking emblem for e-sport domination."
        },
        {
          src: s3Style("/styles/s711.webp"),
          
          basePrompt: "Design a mascot logo inspired by Free Fire’s DJ Alok, with his glowing headphones, stylish outfit, and neon purple/blue energy waves around him. The logo must include the word 'Text' in bold futuristic font beneath."
        },
        {
          src: s3Style("/styles/s712.webp"),
          
          basePrompt: "Create a mascot logo inspired by Free Fire’s Chrono, wearing futuristic armor with a glowing blue energy shield. The logo must include the word 'Text' in bold esports-style font below."
        },
        {
          src: s3Style("/styles/s713.webp"),
          
          basePrompt: "Generate a mascot logo inspired by Free Fire’s K (Captain Booyah), with his iconic gold-and-black jacket glowing with radiant energy. The logo must include the team name 'Text' in strong cyber font."
        },
        {
          src: s3Style("/styles/s714.webp"),
          
          basePrompt: "Design a mascot logo inspired by Free Fire’s Jota, in combat stance holding dual guns with a fiery glowing background. The logo must include the word 'Text' in sharp metallic typography below."
        },
        {
          src: s3Style("/styles/s715.webp"),
          
          basePrompt: "Create a mascot logo inspired by Free Fire’s Kelly, sprinting at high speed with neon yellow streaks showing her motion. The logo must include the word 'Text' in bold angled gaming font beneath."
        },
        {
          src: s3Style("/styles/s716.webp"),
          
          basePrompt: "Design a mascot logo inspired by Free Fire’s Dimitri, with his DJ setup glowing, futuristic beats visualized as purple soundwaves around him. The logo must include the word 'Text' in glowing neon font."
        },
        {
          src: s3Style("/styles/s717.webp"),
          
          basePrompt: "Generate a mascot logo inspired by Free Fire’s Hayato, styled as a samurai warrior holding a glowing katana, surrounded by purple flames. The logo must include the word 'Text' in bold Japanese-style font below."
        },
        {
          src: s3Style("/styles/s718.webp"),
          
          basePrompt: "Create a mascot logo inspired by Free Fire’s character Xayne, featuring her futuristic cyber armor, short hair, glowing red highlights, and aggressive stance. The logo must include the word 'Text' in sharp metallic typography at the bottom."
        },
        {
          src: s3Style("/styles/s719.webp"),
          
          basePrompt: "Design a mascot logo inspired by Free Fire’s Olivia, styled as a heroic medic with her combat outfit, glowing health aura, and red cross effects. The design must include the word 'Text' in bold pixel-inspired font beneath."
        },
        {
          src: s3Style("/styles/s720.webp"),
          
          basePrompt: "Generate a mascot logo inspired by Free Fire’s Moco, with her iconic neon green hair, hacker glasses, and holographic cyber interface around her. The logo must include the word 'Text' in glowing cyberpunk-style font at the bottom."
        },
      ],
      "DOTA": [
        {
          src: s3Style("/styles/s651.webp"),
          
          basePrompt: "A DOTA-style emblem logo for ''Text'' — a stone shield with glowing red runes, ancient fantasy design, bold metallic text underneath, dark mystical background, esports-ready, highly detailed"
        },
        {
          src: s3Style("/styles/s652.webp"),

          basePrompt: "Epic fantasy gaming logo for team ''Text'' — a fierce raven with glowing red eyes perched on a spiked axe, black and crimson color scheme, dramatic medieval text ''Text'', dark aura, DOTA-inspired look"
        },
        {
          src: s3Style("/styles/s653.webp"),

          basePrompt: "DOTA-style emblem for ''Text'' — a flaming sword stuck in molten rock, glowing golden-red aura, epic fantasy typography for the team name, highly detailed, esports fantasy style"
        },
        {
          src: s3Style("/styles/s654.webp"),

          basePrompt: "Fantasy gaming logo for ''Text'' — features a hooded assassin silhouette with glowing daggers, purple and black color scheme, sinister atmosphere, medieval gothic text ''Text'', sharp emblem layout"
        },
        {
          src: s3Style("/styles/s655.webp"),
          
          basePrompt: "A DOTA-style emblem logo for ''Text'' — metallic crest with glowing runes engraved, magical aura, blue and silver tones, bold engraved fantasy font, esports-ready, high detail"
        },
        {
          src: s3Style("/styles/s656.webp"),

          basePrompt: "Epic gaming logo for ''Text'' — armored knight helmet with crossed swords, silver and bronze metallic glow, medieval heraldic style, bold serif text ''Text'', esports design with fantasy energy"
        },
        {
          src: s3Style("/styles/s657.webp"),

          basePrompt: "DOTA-inspired fantasy logo for ''Text'' — a fierce dragon head breathing fire, red-orange flames, ancient rune circle in background, glowing bold medieval-style text ''Text''"
        },
        {
          src: s3Style("/styles/s658.webp"),

          basePrompt: "Gaming logo for team ''Text'' — dark cosmic portal with glowing purple energy, shadowy hunters surrounding it, fantasy aura, mystical typography ''Text'', DOTA-style design"
        },
        {
          src: s3Style("/styles/s659.webp"),
          
          basePrompt: "A DOTA-style emblem logo for ''Text'' — giant stone golem face carved with glowing green cracks, shield-shaped crest, epic metallic fantasy text ''Text'', dark earthy tones"
        },
        {
          src: s3Style("/styles/s660.webp"),
          
          basePrompt: "Epic fantasy logo for ''Text'' — thunderous storm clouds with glowing lightning striking a medieval sword, blue and gold mystical aura, bold ornamental font ''Text'', esports DOTA-style design"
        },
        
      ],
    // You can continue this pattern for other specific game titles like Counter-Strike, Cyberpunk 2077, etc.
  },
  "Game Genres": {
    "Action Adventure": [
      {
        src: s3Style("/styles/s350.webp"),
        
        basePrompt: "A logo for ''Text'' in the Action Adventure genre. The text ''Text'' is designed with dynamic, flowing lines and adventurous motifs like compasses and mountains. The background incorporates vibrant landscapes and elements that evoke excitement and exploration.",
      },
      {
        src: s3Style("/styles/s351.webp"),
        
        basePrompt: "Create an Action Adventure-themed logo for ''Text''. The text ''Text'' uses bold, adventurous fonts with integrated elements like compasses, treasure maps, and rugged terrains, set against a backdrop of an expansive landscape.",
      },
      {
        src: s3Style("/styles/s352.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on the Action Adventure genre. The text ''Text'' is rendered in dynamic, flowing fonts, surrounded by symbols of exploration like compasses, mountains, and adventurous gear, set against a vibrant, action-packed background.",
      },
      {
        src: s3Style("/styles/s353.webp"),
        
        basePrompt: "A dynamic logo for ''Text'' inspired by Action Adventure games. The text ''Text'' is bold and stylized, integrated with elements like treasure chests, maps, and rugged landscapes, set against a backdrop that evokes a sense of exploration and excitement.",
      },
      {
        src: s3Style("/styles/s354.webp"),
        
        basePrompt: "Develop an adventure-driven gaming logo for ''Text''. The text ''Text'' should feature strong, exploratory fonts with compasses and pathfinder motifs, reflecting energetic, globe-trotting gameplay.",
      },
      {
        src: s3Style("/styles/s355.webp"),
        
        basePrompt: "A professional Action Adventure logo for ''Text''. The text ''Text'' is designed with dynamic lines and adventurous motifs, featuring elements like compasses and mountains, set against a vibrant, exploratory background.",
      },
      {
        src: s3Style("/styles/s356.webp"),
        
        basePrompt: "Create a stylized logo for ''Text'' based on Action Adventure themes. The text ''Text'' features bold, flowing fonts with integrated elements like treasure maps, compasses, and rugged terrains, set against a vibrant, action-oriented background.",
      },
      {
        src: s3Style("/styles/s357.webp"),
        
        basePrompt: "A vibrant logo for ''Text'' inspired by Action Adventure games. The text ''Text'' uses dynamic fonts with adventurous accents, surrounded by symbols like compasses, mountains, and exploration gear, capturing the genre's excitement and exploration.",
      },
      {
        src: s3Style("/styles/s358.webp"),
        
        basePrompt: "Design a creative Action Adventure logo for ''Text''. The text ''Text'' features adventurous fonts and vibrant colors, integrated with symbols like treasure chests, maps, and rugged landscapes, set against a backdrop that evokes exploration and excitement.",
      },
      {
        src: s3Style("/styles/s359.webp"),
        
        basePrompt: "A modern Action Adventure-themed logo for ''Text''. The text ''Text'' is styled with bold, dynamic typography and surrounded by elements like compasses, mountains, and exploration motifs, set against an expansive, vibrant background.",
      },
    ],
    "Fighting": [
      {
        src: s3Style("/styles/s360.webp"),
        
        basePrompt: "A logo for ''Text'' inspired by the Fighting genre. The text ''Text'' is bold and aggressive, featuring sharp edges and dynamic poses of fighters. The background includes elements like smoke, punching gloves, and vibrant colors to capture the intensity of combat.",
      },
      {
        src: s3Style("/styles/s361.webp"),
        
        basePrompt: "Create a Fighting-themed logo for ''Text''. The text ''Text'' uses strong, edgy fonts with integrated elements like boxing gloves, fighter silhouettes, and dynamic action lines, set against a high-energy, intense backdrop.",
      },
      {
        src: s3Style("/styles/s362.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on the Fighting genre. The text ''Text'' is rendered in bold, aggressive fonts, surrounded by elements like punching gloves, fighters in action, and vibrant color accents, reflecting the genre's intensity.",
      },
      {
        src: s3Style("/styles/s363.webp"),
        
        basePrompt: "A dynamic logo for ''Text'' inspired by Fighting games. The text ''Text'' is bold and stylized, integrated with elements like boxing gloves, fighter silhouettes, and dynamic energy effects, set against a backdrop that evokes the intensity of combat.",
      },
      {
        src: s3Style("/styles/s364.webp"),
        
        basePrompt: "Develop an intense fighting logo for ''Text''. The text ''Text'' should combine aggressive fonts with boxer or martial artist silhouettes, accentuating raw power and action-ready visuals."
      },
      {
        src: s3Style("/styles/s365.webp"),
        
        basePrompt: "A professional Fighting logo for ''Text''. The text ''Text'' is designed with strong, edgy lines and aggressive motifs, featuring elements like boxing gloves and fighter silhouettes, set against a high-energy, combat-focused background.",
      },
      {
        src: s3Style("/styles/s366.webp"),
        
        basePrompt: "Create a stylized Fighting logo for ''Text''. The text ''Text'' features bold, dynamic fonts with integrated elements like boxing gloves, fighters in action, and vibrant color accents, set against an intense, high-energy background.",
      },
      {
        src: s3Style("/styles/s367.webp"),
        
        basePrompt: "A vibrant Fighting-themed logo for ''Text''. The text ''Text'' uses bold, aggressive fonts with dynamic accents, surrounded by symbols like punching gloves and fighter silhouettes, capturing the genre's intensity and energy.",
      },
      {
        src: s3Style("/styles/s368.webp"),
        
        basePrompt: "Design a creative Fighting logo for ''Text''. The text ''Text'' features bold, dynamic fonts and vibrant colors, integrated with symbols like boxing gloves and fighter silhouettes, set against a backdrop that evokes the intensity of combat.",
      },
      {
        src: s3Style("/styles/s369.webp"),
        
        basePrompt: "A modern Fighting-themed logo for ''Text''. The text ''Text'' is styled with bold, edgy typography and surrounded by elements like punching gloves, fighter silhouettes, and dynamic energy lines, set against an intense, high-energy background.",
      },
    ],
    "MOBA": [
    {
      src: s3Style("/styles/s370.webp"),
      
      basePrompt:
        "Create a MOBA-inspired gaming logo for ''Text''. Use vibrant, stylized fonts with character class icons, capturing fast-paced team combat and fantasy adventure."
    },
    {
      src: s3Style("/styles/s371.webp"),
      
      basePrompt:
        "Design a dynamic MOBA logo for ''Text''. Incorporate epic fonts, lane or tower motifs, and bold magical or tech elements to showcase high-intensity strategic battles."
    },
    {
      src: s3Style("/styles/s372.webp"),
      
      basePrompt:
        "Forge a bold MOBA-themed logo for ''Text''. Blend sweeping, heroic typography with references to minions or battle arenas, highlighting cooperative gameplay and epic showdowns."
    },
    {
      src: s3Style("/styles/s373.webp"),
      
      basePrompt:
        "Develop a colorful MOBA logo for ''Text''. Use stylized, energetic letters with champion silhouettes or ability icons, set against a vibrant battlefield backdrop."
    },
    {
      src: s3Style("/styles/s374.webp"),
      
      basePrompt:
        "Craft a professional MOBA gaming logo for ''Text''. Combine sleek, modern fonts with layered shield or crest imagery, reflecting tactical team synergy and hero-based strategies."
    },
    {
      src: s3Style("/styles/s375.webp"),
      
      basePrompt:
        "Create a stylized MOBA design for ''Text''. Employ bold lettering, mystical power or aura effects, and distinct lane references to channel the thrill of champion warfare."
    },
    {
      src: s3Style("/styles/s376.webp"),
      
      basePrompt:
        "Design a fantasy-tech MOBA logo for ''Text''. Merge futuristic and magical elements in the text style, adding small minion or turret icons for a balanced strategic feel."
    },
    {
      src: s3Style("/styles/s377.webp"),
      
      basePrompt:
        "Generate a high-energy MOBA logo for ''Text''. Use strong, angular fonts with swirling spells or sword silhouettes, capturing the intense clash of heroes."
    },
    {
      src: s3Style("/styles/s378.webp"),
      
      basePrompt:
        "Develop a creative MOBA-themed logo for ''Text''. Incorporate realm-based motifs, hero weapon outlines, and color-coded team bars for a dynamic eSports presence."
    },
    {
      src: s3Style("/styles/s379.webp"),
      
      basePrompt:
        "Produce a modern MOBA logo for ''Text''. Utilize stylized, heroic typography, faint lightning or elemental effects, and subtle references to lane or jungle conflicts."
    },
    {
      src: s3Style("/styles/s380.webp"),
      
      basePrompt:
        "Design a MOBA-inspired mascot logo for ''Text''. Feature a stylized hero champion or creature with vivid outlines, epic fonts, and dynamic color transitions."
    },
    {
      src: s3Style("/styles/s381.webp"),
      
      basePrompt:
        "Create a fast-paced MOBA crest for ''Text''. Showcase a fierce warrior or mage icon in bold line art, with energetic, angled fonts and glowing accents."
    },
    {
      src: s3Style("/styles/s382.webp"),
      
      basePrompt:
        "Forge a heroic MOBA emblem for ''Text''. Combine a mythical fighter or beast silhouette, neon highlights, and e-sports style typography for a competitive edge."
    },
    {
      src: s3Style("/styles/s383.webp"),
      
      basePrompt:
        "Develop a dynamic MOBA logo for ''Text''. Use a champion-like figure or creature, thick cartoonish outlines, and bold team-font design with magical color flares."
    },
    {
      src: s3Style("/styles/s384.webp"),
      
      basePrompt:
        "Craft a vibrant e-sports logo for ''Text''. Center on a MOBA hero or monster, big eyes or dramatic expression, and blocky letters for intense, team-based action."
    },
    {
      src: s3Style("/styles/s385.webp"),
      
      basePrompt:
        "Create a stylized MOBA icon for ''Text''. Show a fierce champion or summoner creature with glowing aura, and a modern, edgy font that commands attention."
    },
    {
      src: s3Style("/styles/s386.webp"),
      
      basePrompt:
        "Design a sleek MOBA mascot logo for ''Text''. Incorporate a strong fantasy or sci-fi hero silhouette, neon arcs, and futuristic e-sports typography."
    },
    {
      src: s3Style("/styles/s387.webp"),
      
      basePrompt:
        "Generate a bold MOBA-themed design for ''Text''. Feature a dynamic pose of a champion or minion, dramatic outlines, and fierce stylized text that pops."
    },
    {
      src: s3Style("/styles/s388.webp"),
      
      basePrompt:
        "Develop a competitive MOBA crest for ''Text''. Use a central hero or epic beast with aura effects, framed by angled, heroic text in bright e-sports colors."
    },
    {
      src: s3Style("/styles/s389.webp"),
      
      basePrompt:
        "Produce a modern MOBA clan logo for ''Text''. Highlight a legendary champion or summoner staff, layered neon shapes, and a crisp uppercase font for tournament appeal."
    }
  ],
  "Shooters": [
    {
      src: s3Style("/styles/s390.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' featuring a fierce commando. The text ''Text'' is stenciled in tactical font, with crossed rifles and bullet casings in the background."
    },
    {
      src: s3Style("/styles/s391.webp"),
      
      basePrompt: "An e-sports shooter logo for ''Text'' with a menacing skull wearing night-vision goggles. The text ''Text'' is bold and metallic, capturing intense military action."
    },
    {
      src: s3Style("/styles/s392.webp"),
      
      basePrompt: "An e-sports style insignia for ''Text'' highlighting a stylized crosshair. The text ''Text'' pops with a sharp gradient, surrounded by dynamic muzzle flash effects."
    },
    {
      src: s3Style("/styles/s393.webp"),
      
      basePrompt: "A gritty e-sports emblem for ''Text'' featuring a stylized bullet. The text ''Text'' is bold and aggressive, accompanied by sparks and tactical gear elements."
    },
    {
      src: s3Style("/styles/s394.webp"),
      
      basePrompt: "An e-sports badge for ''Text'' with a sleek sniper scope design. The text ''Text'' is sharp and imposing, set against camouflage patterns and bullet fragments."
    },
    {
      src: s3Style("/styles/s395.webp"),
      
      basePrompt: "A logo for ''Text'' evoking the intensity of FPS games. The text ''Text'' is styled with gunmetal textures, with crosshair icons and smokey effects in the background."
    },
    {
      src: s3Style("/styles/s396.webp"),
      
      basePrompt: "A logo for ''Text'' featuring a dynamic bullet trail across the design. The text ''Text'' is robust, representing the high-octane action of shooter gameplay."
    },
    {
      src: s3Style("/styles/s397.webp"),
      
      basePrompt: "A logo for ''Text'' with a bold shield shape, sporting a modern rifle silhouette. The text ''Text'' stands out with crisp lines, hinting at competitive shooting prowess."
    },
    {
      src: s3Style("/styles/s398.webp"),
      
      basePrompt: "A logo for ''Text'' featuring a minimalistic helmet outline. The text ''Text'' carries a strong military vibe, combined with gritty textures and subtle bullet holes."
    },
    {
      src: s3Style("/styles/s399.webp"),
      
      basePrompt: "A refined shooter logo for ''Text'' with crosshairs and a stylized muzzle flash. The text ''Text'' is intense and angular, symbolizing precision and force."
    }
  ],
  "RPG": [
        {
          src: s3Style("/styles/s10.webp"),
          
          basePrompt: "An e-sport logo for ''Text'' inspired by RPG themes. The text ''Text'' is styled in ornate, medieval typography with a glowing aura, framed in a shield-like emblem. Surrounded by mystical runes and a dragon silhouette, the design features a dark, enchanted forest background, exuding a heroic and competitive spirit."
        },
        {
          src: s3Style("/styles/s11.webp"),
          
          basePrompt: "Design an e-sport logo for ''Text'' based on RPG aesthetics. The text ''Text'' uses bold, gothic fonts with metallic edges, centered in a circular crest. Integrated with a warrior’s sword and arcane symbols, it’s set against a subtle castle ruin texture, perfect for a pro RPG gaming team."
        },
        {
          src: s3Style("/styles/s12.webp"),
          
          basePrompt: "Create an RPG-themed e-sport logo for ''Text''. The text ''Text'' is in sharp, runic fonts with ethereal highlights, encased in a jagged badge. Featuring a mage’s staff and a mythical beast, the design captures a magical, competitive edge with a sleek, team-ready look."
        },
        {
          src: s3Style("/styles/s13.webp"),
          
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by RPG worlds. The text ''Text'' is bold and stylized with a crystalline sheen, surrounded by compact adventurer icons and swirling mana effects. Framed in an octagonal emblem, it’s set against a faint dungeon backdrop, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s14.webp"),
          
          basePrompt: "Design ''Text'' as an RPG e-sport logo. The text ''Text'' is crafted with elegant, fantasy fonts and a golden outline, integrated into a hexagonal crest with knightly armor motifs and glowing gems. The design is epic and aggressive, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s15.webp"),
          
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on RPG elements. The text ''Text'' features ancient fonts with shimmering edges, paired with a minimalist enchanted sword icon. Encased in a sharp, angular frame, it’s set against a mystical, team-focused color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s16.webp"),
          
          basePrompt: "A professional e-sport logo for ''Text'' inspired by RPG lore. The text ''Text'' is designed with sleek, calligraphic lines and bold curves, centered in a streamlined banner. Featuring arcane sigils and a phoenix emblem, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s17.webp"),
          
          basePrompt: "Create an RPG-themed e-sport design for ''Text''. The text ''Text'' is in bold, fantasy typography with subtle celestial accents, integrated into a symmetrical shield. Paired with a sorcerer’s orb and warrior helm, it’s set in a high-energy scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s18.webp"),
          
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by RPG adventures. The text ''Text'' uses dynamic fonts with arcane gradients, framed in a bold, diamond-shaped emblem. Surrounded by heroic RPG elements like scrolls and crowns, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s19.webp"),
          
          basePrompt: "Design a creative RPG e-sport logo for ''Text''. The text ''Text'' features bold, mythical fonts with vibrant overlays, centered in a rugged, team-oriented crest. Integrated with a dragon’s claw and enchanted relics, it’s a striking emblem for e-sport domination."
        },
      ],
    "Simulation ": [
      {
        src: s3Style("/styles/s661.webp"),

        basePrompt: "A simulation game logo for ''Text'' — a colorful farm emblem with a red barn, windmill, crops, and sun, playful cartoon style, bold friendly text ''Text'', bright green and yellow colors, clean flat design"
      },
      {
        src: s3Style("/styles/s662.webp"),

        basePrompt: "A modern simulation game logo for ''Text'' — tall skyscrapers with glowing windows, blue and silver tones, stylized skyline inside a circular emblem, clean bold text ''Text'', minimal futuristic design"
      },
      {
        src: s3Style("/styles/s663.webp"),

        basePrompt: "Friendly cartoon-style logo for ''Text'' — smiling characters, house, and heart icons, bright cheerful colors, bold rounded text ''Text'', simple and vibrant, inviting family-friendly design"
      },
      {
        src: s3Style("/styles/s664.webp"),

        basePrompt: "Simulation game logo for ''Text'' — globe with trees, water, and wind turbines, green and blue palette, clean modern emblem, eco-friendly look, bold smooth text ''Text'', minimalist but colorful style"
      },
      {
        src: s3Style("/styles/s665.webp"),

        basePrompt: "Logo for ''Text'' — sleek airplane icon flying through clouds, dynamic swoosh effect, blue and white color scheme, bold modern text ''Text'', aviation-inspired emblem"
      },
      {
        src: s3Style("/styles/s666.webp"),

        basePrompt: "Simulation game logo for ''Text'' — a clean and friendly emblem featuring a hospital building with a red cross and heartbeat line. Include the exact readable word ''Text'' in bold sans-serif font below the icon. Use light blue and red colors, professional yet playful design, vector-style, esports-quality logo with clear typography."
      },
      {
        src: s3Style("/styles/s667.webp"),

        basePrompt: "Colorful animal-themed logo for ''Text'' — includes cartoon lion, elephant, and giraffe peeking over the text, bright green jungle leaves, fun friendly typography ''Text'', playful simulation vibe"
      },
      {
        src: s3Style("/styles/s668.webp"),

        basePrompt: "Simulation game logo for ''Text'' — realistic train engine coming out of a circular emblem with tracks, metallic and dark green tones, industrial style, bold serif text ''Text'', nostalgic railway vibe"
      },
      {
        src: s3Style("/styles/s669.webp"),

        basePrompt: "Playful cooking simulation logo for ''Text'' — chef hat, spoon and fork crossed behind the text, bright red and yellow palette, rounded cartoon style font ''Text'', light-hearted, fun design"
      },
      {
        src: s3Style("/styles/s670.webp"),

        basePrompt: "Professional yet fun logo for ''Text'' — bar chart and dollar sign inside a shield, blue and gold color scheme, modern clean text ''Text'', corporate yet playful style for management simulation"
      },
    ],
    // Continue with other game genres like Shooters, RPG, etc.
  },
  "Art": {
    "8‐bit": [
      {
        src: s3Style("/styles/s400.webp"),
        
        basePrompt: "A retro 8-bit logo for ''Text''. The text ''Text'' is created using pixel art with a nostalgic color palette, surrounded by classic gaming elements like pixelated characters and blocks. The background features a vintage arcade-style pattern, capturing the essence of old-school gaming.",
      },
      {
        src: s3Style("/styles/s401.webp"),
        
        basePrompt: "Create an 8-bit pixel art logo for ''Text''. The text ''Text'' uses pixelated fonts with bright, retro colors, integrated with classic gaming icons like pixels, joysticks, and arcade machines, set against a nostalgic, pixelated background.",
      },
      {
        src: s3Style("/styles/s402.webp"),
        
        basePrompt: "Design a pixel art-inspired logo for ''Text'' in an 8-bit style. The text ''Text'' is rendered with blocky, pixelated fonts and surrounded by retro gaming elements like pixel hearts and stars, set against a vibrant, nostalgic background.",
      },
      {
        src: s3Style("/styles/s403.webp"),
        
        basePrompt: "A dynamic 8-bit logo for ''Text''. The text ''Text'' is designed with pixelated fonts and bright, retro colors, integrated with classic gaming symbols like game controllers and pixelated characters, set against a nostalgic arcade backdrop.",
      },
      {
        src: s3Style("/styles/s404.webp"),
        
        basePrompt: "Create an 8-bit retro gaming logo for ''Text''. The text ''Text'' features pixelated fonts with vibrant, nostalgic colors, surrounded by classic gaming elements like pixels, joysticks, and arcade machines, set against a pixelated background.",
      },
      {
        src: s3Style("/styles/s405.webp"),
        
        basePrompt: "A professional 8-bit pixel art logo for ''Text''. The text ''Text'' is designed with blocky, pixelated typography and integrated with retro gaming symbols like pixels and arcade elements, set against a colorful, nostalgic background.",
      },
      {
        src: s3Style("/styles/s406.webp"),
        
        basePrompt: "Create a stylized 8-bit logo for ''Text'' with a pixel art aesthetic. The text ''Text'' features pixelated fonts and bright retro colors, surrounded by classic gaming icons like pixels, joysticks, and arcade machines, set against a vibrant, nostalgic backdrop.",
      },
      {
        src: s3Style("/styles/s407.webp"),
        
        basePrompt: "A vibrant 8-bit pixel art logo for ''Text''. The text ''Text'' uses pixelated typography with bright, retro colors, surrounded by classic gaming elements like pixel hearts and stars, set against a nostalgic, pixelated background.",
      },
      {
        src: s3Style("/styles/s408.webp"),
        
        basePrompt: "Design a creative 8-bit pixel art logo for ''Text''. The text ''Text'' features pixelated fonts and vibrant retro colors, integrated with classic gaming symbols like pixels and arcade icons, set against a nostalgic arcade-style background.",
      },
      {
        src: s3Style("/styles/s409.webp"),
        
        basePrompt: "A modern 8-bit logo for ''Text'' inspired by retro gaming. The text ''Text'' is styled with pixelated typography and bright, nostalgic colors, integrated with classic gaming elements like pixels, joysticks, and arcade machines, set against a pixelated background.",
      },
    ],
    "Cartoon": [
      {
        src: s3Style("/styles/s410.webp"),
        
        basePrompt: "A cartoonish logo for ''Text''. The text ''Text'' is designed with playful, exaggerated fonts and bright colors, surrounded by fun, toony elements like smiling characters and vibrant backgrounds, capturing a lighthearted and energetic vibe.",
      },
      {
        src: s3Style("/styles/s411.webp"),
        
        basePrompt: "Create a toony, exaggerated logo for ''Text''. The text ''Text'' uses bubbly, playful fonts with bright, vibrant colors, integrated with cartoon elements like cute characters and whimsical backgrounds, set against a cheerful, energetic backdrop.",
      },
      {
        src: s3Style("/styles/s412.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on cartoonish themes. The text ''Text'' is rendered in exaggerated, playful fonts with bright colors, surrounded by fun, toony elements like animated characters and vibrant patterns, set against a lively, cartoonish background.",
      },
      {
        src: s3Style("/styles/s413.webp"),
        
        basePrompt: "A dynamic cartoonish logo for ''Text''. The text ''Text'' is bold and stylized with playful, exaggerated typography, integrated with elements like smiling characters and vibrant colors, set against a backdrop that evokes a sense of fun and energy.",
      },
      {
        src: s3Style("/styles/s414.webp"),
        
        basePrompt: "Create a toony, exaggerated design for ''Text''. The text ''Text'' incorporates playful elements like cute characters, vibrant colors, and whimsical backgrounds, with bold, exaggerated fonts and a cheerful, energetic color scheme.",
      },
      {
        src: s3Style("/styles/s415.webp"),
        
        basePrompt: "A professional cartoonish logo for ''Text''. The text ''Text'' is designed with exaggerated, playful fonts and bright colors, featuring cartoon elements like smiling characters and fun patterns, set against a lively, colorful background.",
      },
      {
        src: s3Style("/styles/s416.webp"),
        
        basePrompt: "Create a stylized cartoon logo for ''Text''. The text ''Text'' features playful, exaggerated typography with integrated elements like cute characters and whimsical shapes, set against a vibrant, energetic backdrop that captures a fun and lively atmosphere.",
      },
      {
        src: s3Style("/styles/s417.webp"),
        
        basePrompt: "A vibrant cartoonish logo for ''Text''. The text ''Text'' uses bold, playful fonts with bright colors, surrounded by fun, toony elements like animated characters and vibrant patterns, capturing a lively and energetic vibe.",
      },
      {
        src: s3Style("/styles/s418.webp"),
        
        basePrompt: "Design a creative cartoon logo for ''Text''. The text ''Text'' features playful, exaggerated fonts and bright colors, integrated with fun, toony elements like smiling characters and whimsical backgrounds, set against a colorful, energetic backdrop.",
      },
      {
        src: s3Style("/styles/s419.webp"),
        
        basePrompt: "A modern cartoonish logo for ''Text'' inspired by toony, exaggerated styles. The text ''Text'' is styled with playful, bold typography and bright colors, surrounded by fun, animated elements like cute characters and vibrant patterns, set against a lively, colorful background.",
      },
    ],
    "Emblem": [
      {
        src: s3Style("/styles/s420.webp"),
        
        basePrompt:
          "Design a regal emblem logo for ''Text''. Use ornate shields, crests, and bold typography, capturing an epic, old-world gaming aesthetic."
      },
      {
        src: s3Style("/styles/s421.webp"),
        
        basePrompt:
          "Create a classic emblem-styled logo for ''Text''. Incorporate heraldic symbols, filigree accents, and a strong central shield for a timeless fantasy feel."
      },
      {
        src: s3Style("/styles/s422.webp"),
        
        basePrompt:
          "Forge a robust emblem gaming logo for ''Text''. Use powerful, symmetrical iconography, thick lines, and grand typography reminiscent of knightly banners."
      },
      {
        src: s3Style("/styles/s423.webp"),
        
        basePrompt:
          "Develop a modern emblem design for ''Text''. Blend crisp geometry with subtle metallic textures, anchored by an iconic crest that screams competitive royalty."
      },
      {
        src: s3Style("/styles/s424.webp"),
        
        basePrompt:
          "Craft an intricate emblem-based logo for ''Text''. Incorporate layered shield motifs, filigree flourishes, and bold, stylized fonts for a polished medieval flair."
      },
      {
        src: s3Style("/styles/s425.webp"),
        
        basePrompt:
          "Create a commanding emblem logo for ''Text''. Feature majestic animals or mythical creatures, elegant heraldry, and strong text that stands out in eSports contexts."
      },
      {
        src: s3Style("/styles/s426.webp"),
        
        basePrompt:
          "Design a stylized emblem gaming logo for ''Text''. Use dynamic shapes, regal borders, and crisp lettering to portray a noble yet modern gaming identity."
      },
      {
        src: s3Style("/styles/s427.webp"),
        
        basePrompt:
          "Produce a triumphant emblem-themed logo for ''Text''. Merge bold crest outlines, subtle gem or metal effects, and powerful, uppercase fonts for a conquering vibe."
      },
      {
        src: s3Style("/styles/s428.webp"),
        
        basePrompt:
          "Develop a creative emblem logo for ''Text''. Combine knightly shield silhouettes, swirling scrollwork, and a heroic color palette to emphasize epic grandeur."
      },
      {
        src: s3Style("/styles/s429.webp"),
        
        basePrompt:
          "Generate a modern-fantasy emblem for ''Text''. Fuse ornate, symmetrical shapes with futuristic lines, and add a strong typographic focal point that suits eSports."
      },
      {
        src: s3Style("/styles/s430.webp"),
        
        basePrompt:
          "Design a regal emblem logo for ''Text''. Include a stylized mascot or creature within a shield, with bold e-sports lines and ornate, heroic text."
      },
      {
        src: s3Style("/styles/s431.webp"),
        
        basePrompt:
          "Create a classic emblem-styled gaming logo for ''Text''. Incorporate heraldic symbols, filigree accents, and a strong central shield for a timeless fantasy feel."
      },
      {
        src: s3Style("/styles/s432.webp"),
        
        basePrompt:
          "Forge a robust e-sports emblem for ''Text''. Use powerful, symmetrical iconography, thick lines, and grand typography reminiscent of knightly banners."
      },
      {
        src: s3Style("/styles/s433.webp"),
        
        basePrompt:
          "Develop a modern emblem design for ''Text''. Blend crisp geometry with subtle metallic textures, anchored by an iconic crest that screams competitive royalty."
      },
      {
        src: s3Style("/styles/s434.webp"),
        
        basePrompt:
          "Craft an intricate emblem-based logo for ''Text''. Incorporate layered shield motifs, filigree flourishes, and bold, stylized fonts for a polished medieval flair."
      },
      {
        src: s3Style("/styles/s435.webp"),
        
        basePrompt:
          "Create a commanding emblem logo for ''Text''. Use a roaring beast or armored figure, dramatic highlight strokes, and a thick typeface that stands out in e-sports."
      },
      /*{
        src: s3Style("/styles/s436.webp"),
        
        basePrompt:
          "Design a stylized emblem gaming logo for ''Text''. Emphasize crest geometry, bold color blocks, and a fierce central mascot, with modern outlines for e-sports excitement."
      },*/
      {
        src: s3Style("/styles/s437.webp"),
        
        basePrompt:
          "Produce a triumphant emblem-themed logo for ''Text''. Merge bold crest outlines, subtle gem or metal effects, and powerful, uppercase fonts for a conquering vibe."
      },
      {
        src: s3Style("/styles/s438.webp"),
        
        basePrompt:
          "Develop a creative crest for ''Text''. Combine knightly shield silhouettes, swirling scrollwork, and a heroic color palette to emphasize epic grandeur."
      },
      {
        src: s3Style("/styles/s439.webp"),
        
        basePrompt:
          "Generate a modern-fantasy emblem for ''Text''. Fuse ornate, symmetrical shapes with futuristic lines, and add a strong typographic focal point that suits e-sports."
      }
    ],
    "Kawaii": [
    {
      src: s3Style("/styles/s440.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' in kawaii style, featuring an adorable anime creature. The text ''Text'' is playful, surrounded by pastel stars and hearts."
    },
    {
      src: s3Style("/styles/s441.webp"),
      
      basePrompt: "A kawaii e-sports badge for ''Text'' with a chibi panda holding a tiny controller. The text ''Text'' is bubbly and bright, perfect for a fun gaming team."
    },
    {
      src: s3Style("/styles/s442.webp"),
      
      basePrompt: "A cute e-sports logo for ''Text'' featuring a magical unicorn. The text ''Text'' is written in pastel gradients, with sparkles and candy-like outlines."
    },
    {
      src: s3Style("/styles/s443.webp"),
      
      basePrompt: "An e-sports crest for ''Text'' with a whimsical kitten. The text ''Text'' shines in bright pink, framed by glittery hearts and playful anime effects."
    },
    {
      src: s3Style("/styles/s444.webp"),
      
      basePrompt: "A kawaii e-sports insignia for ''Text'' highlighting a big-eyed bunny. The text ''Text'' features pastel polka dots, giving it a charming, youthful vibe."
    },
    {
      src: s3Style("/styles/s445.webp"),
      
      basePrompt: "A logo for ''Text'' with soft pastel colors and bubble-like shapes. The text ''Text'' is curved and friendly, surrounded by cute bows and stars."
    },
    {
      src: s3Style("/styles/s446.webp"),
      
      basePrompt: "A logo for ''Text'' featuring a sweet ice cream cone character. The text ''Text'' is in a playful font, complemented by smiling faces and sparkly highlights."
    },
    {
      src: s3Style("/styles/s447.webp"),
      
      basePrompt: "A logo for ''Text'' with a dreamy rainbow and cloud design. The text ''Text'' is soft and cheerful, embodying a lighthearted kawaii spirit."
    },
    {
      src: s3Style("/styles/s448.webp"),
      
      basePrompt: "A logo for ''Text'' depicting a cute little robot with heart-shaped eyes. The text ''Text'' is rounded and pastel-toned, capturing a techno-kawaii essence."
    },
    {
      src: s3Style("/styles/s449.webp"),
      
      basePrompt: "A logo for ''Text'' showcasing a cuddly chibi bear. The text ''Text'' is bright and inviting, surrounded by stars and soft pink sparkles."
    }
  ],
  "Animal": [
        {
          src: s3Style("/styles/s20.webp"),
          
          basePrompt: "An e-sport logo for ''Text'' inspired by animal themes. The text ''Text'' is styled in bold, claw-slashed typography with a primal edge, framed in a circular badge. Featuring a roaring lion’s head with a fiery mane, the design is set against a rugged savanna texture, exuding strength and competitive ferocity."
        },
        {
          src: s3Style("/styles/s21.webp"),
          
          basePrompt: "Design an e-sport logo for ''Text'' based on animal motifs. The text ''Text'' uses sleek, angular fonts with metallic claw marks, centered in a shield-like emblem. Integrated with a striking eagle in mid-flight, it’s set against a subtle stormy sky outline, perfect for a pro gaming team."
        },
        {
          src: s3Style("/styles/s22.webp"),
          
          basePrompt: "Create an animal-themed e-sport logo for ''Text''. The text ''Text'' is in sharp, jagged fonts with neon claw accents, encased in a geometric crest. Featuring a snarling wolf with glowing eyes, the design captures a fierce, competitive spirit with a sleek, team-ready look."
        },
        {
          src: s3Style("/styles/s23.webp"),
          
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by animals. The text ''Text'' is bold and stylized with a weathered texture, surrounded by a coiled serpent with venomous fangs. Framed in an octagonal badge, it’s set against a faint jungle backdrop, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s24.webp"),
          
          basePrompt: "Design ''Text'' as an animal e-sport logo. The text ''Text'' is crafted with rugged, bone-like fonts and a glowing outline, integrated into a hexagonal emblem with a charging rhino silhouette. The design is powerful and aggressive, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s25.webp"),
          
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on animal elements. The text ''Text'' features primal fonts with etched claw marks, paired with a minimalist tiger head icon. Encased in a sharp, angular frame, it’s set against a vibrant, team-focused color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s26.webp"),
          
          basePrompt: "A professional e-sport logo for ''Text'' inspired by animal power. The text ''Text'' is designed with sleek lines and bold curves, centered in a streamlined crest. Featuring a majestic bear with raised paws, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s27.webp"),
          
          basePrompt: "Create an animal-themed e-sport design for ''Text''. The text ''Text'' is in bold, modern typography with subtle feather accents, integrated into a symmetrical badge. Paired with a diving falcon and claw marks, it’s set in a high-energy scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s28.webp"),
          
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by animal ferocity. The text ''Text'' uses dynamic fonts with wild fur gradients, framed in a bold, diamond-shaped emblem. Surrounded by a leaping panther in action, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s29.webp"),
          
          basePrompt: "Design a creative animal e-sport logo for ''Text''. The text ''Text'' features bold, tribal fonts with vibrant overlays, centered in a rugged, team-oriented crest. Integrated with a howling coyote and jagged claw accents, it’s a striking emblem for e-sport domination."
        },
      ],
      "Monogram": [
        {
          src: s3Style("/styles/s671.webp"),
          
          basePrompt: "Gaming monogram logo with the letters ''Text'' intertwined in a bold futuristic style, metallic silver and electric blue gradient, sharp edges with neon glow, esports emblem, dark background, highly detailed, Fortnite/DOTA-inspired look."
        },
        {
          src: s3Style("/styles/s672.webp"),
          
          basePrompt: "Monogram gaming logo with the letters ''Text'' designed in angular overlapping style, glowing purple and pink neon outlines, glitch effects, esports-ready, dynamic modern typography, placed inside a shield emblem."
        },
        {
          src: s3Style("/styles/s673.webp"),
          
          basePrompt: "Stylized monogram logo with the letters ''Text'' carved into stone with glowing cracks, dark grey and fiery orange palette, aggressive fantasy vibe, bold serif font with runic touches, esports badge design."
        },
        {
          src: s3Style("/styles/s674.webp"),
          
          basePrompt: "Gaming monogram logo with the letters ''Text'' in a cyberpunk style, sharp techno letters with neon cyan and magenta glow, minimal clean background, futuristic esports logo design."
        },
        {
          src: s3Style("/styles/s675.webp"),
          
          basePrompt: "Monogram esports logo with the letters ''Text'' overlapping inside a circular emblem, gothic medieval style, dark red and black tones, dripping blood effect, bold serif typography, dramatic fantasy theme."
        },
        {
          src: s3Style("/styles/s676.webp"),
          
          basePrompt: "Gaming monogram logo with the letters ''Text'' fused together in bold blocky text, chrome metallic texture with glowing gold highlights, minimal modern background, esports professional look."
        },
        {
          src: s3Style("/styles/s677.webp"),
          
          basePrompt: "Stylized gaming monogram logo with the letters ''Text'', sharp wing-like extensions from the letters, dark purple and silver colors, fantasy style emblem, neon outline, epic esports branding."
        },
        {
          src: s3Style("/styles/s678.webp"),
          
          basePrompt: "Retro pixel-art monogram logo with the letters ''Text'', blocky 8-bit font with glowing pixel edges, bright neon green and orange palette, gaming-inspired design, nostalgic but modern esports look."
        },
        {
          src: s3Style("/styles/s679.webp"),
          
          basePrompt: "Aggressive esports monogram logo with the letters ''Text'', stylized snake fangs wrapping around the letters, glowing neon green and black palette, graffiti-styled typography, dark urban background."
        },
        {
          src: s3Style("/styles/s680.webp"),
          
          basePrompt: "Gaming monogram logo with the letters ''Text'' in bold angular design, chrome silver with electric blue lightning effects around it, futuristic and clean design, esports-grade branding."
        },
      ],
    // Continue with other art/design styles like Kawaii, Mascot Logo, etc.
  },
  "Themes & Motifs": {
    "Aliens": [
      {
        src: s3Style("/styles/s450.webp"),
        
        basePrompt: "A logo for ''Text'' with an alien theme. The text ''Text'' is styled with extraterrestrial fonts and green accents, surrounded by alien motifs like UFOs, spaceships, and glowing eyes, set against a cosmic backdrop.",
      },
      {
        src: s3Style("/styles/s451.webp"),
        
        basePrompt: "Create an alien-inspired logo for ''Text''. The text ''Text'' uses futuristic, otherworldly fonts with green and purple highlights, integrated with alien elements like UFOs and extraterrestrial landscapes, set against a star-filled space background.",
      },
      {
        src: s3Style("/styles/s452.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on alien themes. The text ''Text'' is rendered in sleek, futuristic fonts with glowing green accents, surrounded by alien symbols like UFOs and spaceships, set against a cosmic, starry backdrop.",
      },
      {
        src: s3Style("/styles/s453.webp"),
        
        basePrompt: "A dynamic logo for ''Text'' inspired by alien motifs. The text ''Text'' is bold and stylized with extraterrestrial fonts, integrated with elements like UFOs, alien eyes, and glowing symbols, set against a vibrant cosmic background.",
      },
      {
        src: s3Style("/styles/s454.webp"),
        
        basePrompt: "Create an alien themed design for ''Text''. The text ''Text'' incorporates extraterrestrial elements such as UFOs, spaceships, and alien silhouettes, with sleek, futuristic fonts and a green and purple color scheme, set against a cosmic backdrop.",
      },
      {
        src: s3Style("/styles/s455.webp"),
        
        basePrompt: "A professional alien-inspired logo for ''Text''. The text ''Text'' is designed with sleek, futuristic typography and green accents, featuring alien motifs like UFOs and spaceships, set against a star-filled space background.",
      },
      {
        src: s3Style("/styles/s456.webp"),
        
        basePrompt: "Create a stylized alien logo for ''Text''. The text ''Text'' features extraterrestrial fonts and green, glowing accents, integrated with elements like UFOs and alien landscapes, set against a vibrant, cosmic background.",
      },
      {
        src: s3Style("/styles/s457.webp"),
        
        basePrompt: "A vibrant alien-themed logo for ''Text''. The text ''Text'' uses futuristic, otherworldly fonts with green and purple highlights, surrounded by alien symbols like UFOs and glowing eyes, capturing the extraterrestrial essence.",
      },
      {
        src: s3Style("/styles/s458.webp"),
        
        basePrompt: "Design a creative alien logo for ''Text''. The text ''Text'' features sleek, extraterrestrial typography and bright green accents, integrated with alien motifs like UFOs and spaceships, set against a starry space background.",
      },
      {
        src: s3Style("/styles/s459.webp"),
        
        basePrompt: "A modern alien-inspired logo for ''Text'' themed around extraterrestrial motifs. The text ''Text'' is styled with futuristic fonts and green accents, surrounded by alien elements like UFOs and glowing symbols, set against a cosmic, star-filled backdrop.",
      },
    ],
"Astrology": [
      {
        src: s3Style("/styles/s460.webp"),
        
        basePrompt: "Design an astrology-themed logo for ''Text''. Utilize starry, mystical fonts with zodiac symbols and constellations. Set against a dark, star-filled night sky to convey celestial elegance.",
      },
      {
        src: s3Style("/styles/s461.webp"),
        
        basePrompt: "Create an astrology-inspired logo for ''Text''. Use elegant, celestial fonts integrated with zodiac symbols and constellations. Set against a cosmic, starry backdrop for a mystical appearance.",
      },
      {
        src: s3Style("/styles/s462.webp"),
        
        basePrompt: "Design a gaming logo for ''Text'' based on astrology themes. Employ mystical, flowing fonts surrounded by zodiac symbols and star constellations. Set against a vibrant night sky with celestial colors.",
      },
      {
        src: s3Style("/styles/s463.webp"),
        
        basePrompt: "Create a dynamic astrology logo for ''Text''. Use bold, stylized typography with celestial elements like zodiac signs and constellations. Set against a cosmic background to evoke celestial wonder.",
      },
      {
        src: s3Style("/styles/s464.webp"),
        
        basePrompt: "Design an astrology-themed logo for ''Text''. Incorporate celestial elements such as zodiac symbols, stars, and constellations within elegant, flowing fonts. Set against a starry night sky for a mystical feel.",
      },
      {
        src: s3Style("/styles/s465.webp"),
        
        basePrompt: "Create a professional astrology-inspired logo for ''Text''. Utilize elegant, celestial typography integrated with zodiac symbols and star motifs. Set against a dark, star-filled background to emphasize celestial elegance.",
      },
      {
        src: s3Style("/styles/s466.webp"),
        
        basePrompt: "Design a stylized astrology logo for ''Text''. Use mystical, celestial fonts with integrated zodiac elements and constellations. Set against a vibrant, cosmic backdrop for a magical appearance.",
      },
      {
        src: s3Style("/styles/s467.webp"),
        
        basePrompt: "Create a vibrant astrology-themed logo for ''Text''. Employ elegant, flowing fonts with celestial accents, surrounded by zodiac symbols and constellations to capture the mystical essence of astrology.",
      },
      {
        src: s3Style("/styles/s468.webp"),
        
        basePrompt: "Design a creative astrology logo for ''Text''. Utilize elegant, celestial typography with integrated zodiac symbols and constellations. Set against a colorful, starry backdrop to evoke celestial beauty.",
      },
      {
        src: s3Style("/styles/s469.webp"),
        
        basePrompt: "Create a modern astrology-inspired logo for ''Text''. Use flowing, mystical fonts with star accents and zodiac symbols. Set against a cosmic, star-filled backdrop to reflect celestial sophistication.",
      },
    ],
    "Fantasy": [
    {
      src: s3Style("/styles/s470.webp"),
      
      basePrompt:
        "Design a whimsical fantasy gaming logo for ''Text''. Use flowing, magical fonts, enchanted forest or crystal motifs, and vibrant, otherworldly colors."
    },
    {
      src: s3Style("/styles/s471.webp"),
      
      basePrompt:
        "Create a high-fantasy logo for ''Text''. Incorporate dragon silhouettes, swirling arcane symbols, and bold, medieval-inspired fonts for epic immersion."
    },
    {
      src: s3Style("/styles/s472.webp"),
      
      basePrompt:
        "Forge a mystical fantasy logo for ''Text''. Merge glowing runic lettering, ethereal elemental effects, and subtle castle spires for a grand RPG-like style."
    },
    {
      src: s3Style("/styles/s473.webp"),
      
      basePrompt:
        "Develop a heroic fantasy gaming logo for ''Text''. Use proud, angular text, sword or shield icons, and sweeping magical energy lines to convey epic quests."
    },
    {
      src: s3Style("/styles/s474.webp"),
      
      basePrompt:
        "Craft an enchanted fantasy logo for ''Text''. Blend ornate, serif fonts with cosmic stardust or fairy-like glows, reflecting a dreamlike, storybook realm."
    },
    {
      src: s3Style("/styles/s475.webp"),
      
      basePrompt:
        "Create a professional fantasy logo for ''Text''. Employ polished medieval typography, creature silhouettes, and a regal color scheme for a premium RPG appeal."
    },
    {
      src: s3Style("/styles/s476.webp"),
      
      basePrompt:
        "Design a dark fantasy gaming logo for ''Text''. Combine sinister, jagged fonts, spiky demon horns, or eerie glowing eyes for a menacing, gothic presence."
    },
    {
      src: s3Style("/styles/s477.webp"),
      
      basePrompt:
        "Produce an ethereal fantasy logo for ''Text''. Use wispy, flowing lettering, star or moon motifs, and a soft pastel glow to evoke a magical wonderland."
    },
    {
      src: s3Style("/styles/s478.webp"),
      
      basePrompt:
        "Develop a colorful fantasy design for ''Text''. Merge vibrant arcane runes, gemlike crystals, and lively calligraphy that captures epic realm adventures."
    },
    {
      src: s3Style("/styles/s479.webp"),
      
      basePrompt:
        "Generate a modern fantasy gaming logo for ''Text''. Integrate clean, stylized fonts with subtle mystical shapes or creatures, creating a striking, eSports-ready style."
    },
    {
      src: s3Style("/styles/s480.webp"),
      
      basePrompt:
        "Design a whimsical fantasy mascot logo for ''Text''. Feature a playful wizard, dragon, or elf in bright lines, with bold e-sports text and vibrant magical accents."
    },
    {
      src: s3Style("/styles/s481.webp"),
      
      basePrompt:
        "Create a high-fantasy gaming logo for ''Text''. Integrate a majestic creature or armored knight, swirling arcane effects, and eye-catching bold typography."
    },
    {
      src: s3Style("/styles/s482.webp"),
      
      basePrompt:
        "Forge a mystical fantasy emblem for ''Text''. Combine glowing runic lettering, ethereal elemental effects, and subtle castle spires for a grand RPG-like style."
    },
    {
      src: s3Style("/styles/s483.webp"),
      
      basePrompt:
        "Develop a heroic fantasy clan logo for ''Text''. Show a sword-wielding warrior or mythical beast, set against luminous shapes and bold angled fonts."
    },
    {
      src: s3Style("/styles/s484.webp"),
      
      basePrompt:
        "Craft an enchanted fantasy design for ''Text''. Blend ornate, serif fonts with cosmic stardust or fairy-like glows, reflecting a dreamlike, storybook realm."
    },
    {
      src: s3Style("/styles/s485.webp"),
      
      basePrompt:
        "Create a professional fantasy gaming logo for ''Text''. Incorporate regal medieval fonts, mythical silhouettes, and a strong dynamic shading for premium RPG appeal."
    },
    {
      src: s3Style("/styles/s486.webp"),
      
      basePrompt:
        "Design a dark fantasy mascot for ''Text''. Include a sinister demon or undead sorcerer, sharp neon highlights, and aggressive e-sports typography."
    },
    {
      src: s3Style("/styles/s487.webp"),
      
      basePrompt:
        "Produce an ethereal fantasy logo for ''Text''. Use starry or moonlit accents, a magical creature silhouette, and softly glowing bold text for a dreamy vibe."
    },
    {
      src: s3Style("/styles/s488.webp"),
      
      basePrompt:
        "Develop a colorful fantasy e-sports logo for ''Text''. Merge rainbow-hued runes, a lively monster or wizard, and impactful cartoon-like text that leaps out."
    },
    {
      src: s3Style("/styles/s489.webp"),
      
      basePrompt:
        "Generate a modern fantasy gaming logo for ''Text''. Portray a futuristic mage or draconic beast in metallic outlines, combined with chunky, confident lettering."
    }
  ],
  "Horror": [
    {
      src: s3Style("/styles/s490.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' featuring a menacing demon skull. The text ''Text'' is distressed and dripping with dark, horror-infused energy."
    },
    {
      src: s3Style("/styles/s491.webp"),
      
      basePrompt: "An e-sports horror crest for ''Text'' with a twisted clown face. The text ''Text'' is jagged and blood-splattered, exuding a terrifying carnival feel."
    },
    {
      src: s3Style("/styles/s492.webp"),
      
      basePrompt: "An e-sports emblem for ''Text'' showing a grim reaper silhouette. The text ''Text'' is sharp, set against eerie fog and ghostly shadows."
    },
    {
      src: s3Style("/styles/s493.webp"),
      
      basePrompt: "A horror-themed e-sports logo for ''Text'' with a snarling werewolf. The text ''Text'' is carved in a spiky font, with a full moon backdrop."
    },
    {
      src: s3Style("/styles/s494.webp"),
      
      basePrompt: "An e-sports badge for ''Text'' depicting a creepy zombie hand. The text ''Text'' is bold and cracked, surrounded by splatters of greenish gore."
    },
    {
      src: s3Style("/styles/s495.webp"),
      
      basePrompt: "A logo for ''Text'' inspired by gothic horror. The text ''Text'' is ornate, framed by twisted vines and a looming haunted house silhouette."
    },
    {
      src: s3Style("/styles/s496.webp"),
      
      basePrompt: "A logo for ''Text'' showing a tattered, dripping bat emblem. The text ''Text'' has a sinister edge, highlighted by glowing red eyes in the background."
    },
    {
      src: s3Style("/styles/s497.webp"),
      
      basePrompt: "A logo for ''Text'' with a dark, macabre atmosphere. The text ''Text'' is scratched and weathered, hovering over a stylized graveyard scene."
    },
    {
      src: s3Style("/styles/s498.webp"),
      
      basePrompt: "A logo for ''Text'' evoking midnight horror. The text ''Text'' appears in a blood-red hue, flanked by twisted trees and eerie silhouettes."
    },
    {
      src: s3Style("/styles/s499.webp"),
      
      basePrompt: "A chilling logo for ''Text'' featuring a vampire’s open coffin. The text ''Text'' is bold and gothic, accentuated by dripping candles and black roses."
    }
  ],
  "Ninja": [
        {
          src: s3Style("/styles/s30.webp"),
          
          basePrompt: "An e-sport logo for ''Text'' inspired by ninja themes. The text ''Text'' is styled in sharp, slanted typography with a shadowy outline, framed in a sleek circular badge. Featuring a masked ninja wielding a katana, the design is set against a faint bamboo forest texture, exuding stealth and competitive precision."
        },
        {
          src: s3Style("/styles/s31.webp"),
          
          basePrompt: "Design an e-sport logo for ''Text'' based on ninja motifs. The text ''Text'' uses bold, angular fonts with metallic shuriken accents, centered in a shield-like emblem. Integrated with a ninja in a striking pose, it’s set against a subtle moonlit sky outline, perfect for a pro gaming team."
        },
        {
          src: s3Style("/styles/s32.webp"),
          
          basePrompt: "Create a ninja-themed e-sport logo for ''Text''. The text ''Text'' is in sleek, jagged fonts with neon smoke trails, encased in a geometric crest. Featuring a ninja hurling throwing stars, the design captures a swift, competitive edge with a clean, team-ready look."
        },
        {
          src: s3Style("/styles/s33.webp"),
          
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by ninjas. The text ''Text'' is bold and stylized with a brushed ink texture, surrounded by a ninja silhouette mid-leap with flowing scarves. Framed in an octagonal badge, it’s set against a faint temple rooftop backdrop, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s34.webp"),
          
          basePrompt: "Design ''Text'' as a ninja e-sport logo. The text ''Text'' is crafted with swift, calligraphic fonts and a glowing edge, integrated into a hexagonal emblem with kunai motifs and smoke wisps. The design is agile and fierce, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s35.webp"),
          
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on ninja elements. The text ''Text'' features stealthy fonts with etched blade marks, paired with a minimalist ninja mask icon. Encased in a sharp, angular frame, it’s set against a vibrant, team-focused color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s36.webp"),
          
          basePrompt: "A professional e-sport logo for ''Text'' inspired by ninja agility. The text ''Text'' is designed with sleek lines and bold slashes, centered in a streamlined crest. Featuring a ninja with a tanto blade and a flowing cloak, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s37.webp"),
          
          basePrompt: "Create a ninja-themed e-sport design for ''Text''. The text ''Text'' is in bold, swift typography with subtle smoke accents, integrated into a symmetrical badge. Paired with a ninja star and a hooded figure, it’s set in a high-energy scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s38.webp"),
          
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by ninja stealth. The text ''Text'' uses dynamic fonts with shadowy gradients, framed in a bold, diamond-shaped emblem. Surrounded by a ninja in a crouching stance with glowing eyes, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s39.webp"),
          
          basePrompt: "Design a creative ninja e-sport logo for ''Text''. The text ''Text'' features bold, brushed fonts with vibrant overlays, centered in a rugged, team-oriented crest. Integrated with a ninja wielding dual sais and a swirling smoke effect, it’s a striking emblem for e-sport domination."
        },
      ],
      "Space": [
        {
            src: s3Style("/styles/s681.webp"),
            
            basePrompt: "A powerful astronaut mascot in futuristic armor, holding a glowing plasma weapon, with ''Text'' written in bold galactic-style font, glowing neon effects."
        },
        {
            src: s3Style("/styles/s682.webp"),
            
            basePrompt: "A fierce alien warrior mascot with sharp glowing eyes, surrounded by stars and galaxies, with ''Text'' integrated into the design in sci-fi typography."
        },
        {
            src: s3Style("/styles/s683.webp"),
            
            basePrompt: "A robotic space wolf mascot, cybernetic details, glowing blue and purple neon, with ''Text'' displayed in a bold cosmic font."
        },
        {
            src: s3Style("/styles/s684.webp"),
            
            basePrompt: "A stylized astronaut mascot with a glowing visor, floating in space with energy waves, and ''Text'' incorporated in a futuristic style."
        },
        {
            src: s3Style("/styles/s685.webp"),
            
            basePrompt: "A dragon mascot made of cosmic fire and stardust, glowing in red and blue nebula colors, with the text ''Text'' in strong metallic letters."
        },
        {
            src: s3Style("/styles/s686.webp"),
            
            basePrompt: "A sleek space-themed logo with a glowing planet and orbit trails, ''Text'' in futuristic typography across the design."
        },
        {
            src: s3Style("/styles/s687.webp"),
            
            basePrompt: "A minimalist gaming logo with a neon spaceship flying through a galaxy, with ''Text'' glowing in sci-fi lettering."
        },
        {
            src: s3Style("/styles/s688.webp"),
            
            basePrompt: "A cyberpunk-inspired space logo with glitch effects, starry background, and ''Text'' in bold glowing font."
        },
        {
            src: s3Style("/styles/s689.webp"),
            
            basePrompt: "A crystalized asteroid logo glowing with purple and blue lights, ''Text'' carved into the stone with luminous details."
        },
        {
            src: s3Style("/styles/s690.webp"),
            
            basePrompt: "A futuristic emblem with neon rings, digital stars, and ''Text'' in sharp, angular cosmic typography."
        },
      ],
    // Continue with other themes & motifs like Horror, Ninja, etc.
  },
  "Colors": {
    "Black": [
      {
        src: s3Style("/styles/s500.webp"),
        
        basePrompt:
          "Design a sleek black-themed gaming logo for ''Text''. Use bold, futuristic typography with glossy black finishes and subtle neon or metallic accents. Place it against a dark background to project power and sophistication."
      },
      {
        src: s3Style("/styles/s501.webp"),
        
        basePrompt:
          "Create a black-themed gaming logo for ''Text''. Employ bold, edgy fonts with matte black accents, minimal neon highlights, and subtle dark textures to convey a stealthy, high-end style."
      },
      {
        src: s3Style("/styles/s502.webp"),
        
        basePrompt:
          "Design a professional black gaming logo for ''Text''. Utilize sleek, modern typography with glossy black edges on a deep black background. Add subtle digital or metallic detailing for a cutting-edge feel."
      },
      {
        src: s3Style("/styles/s503.webp"),
        
        basePrompt:
          "Create a minimalist black gaming logo for ''Text''. Use simple, bold black typography accented by faint neon lines or glitch effects. Position it on a black backdrop to highlight the brand's sleek, competitive edge."
      },
      {
        src: s3Style("/styles/s504.webp"),
        
        basePrompt:
          "Design a stylish black-themed gaming logo for ''Text''. Employ bold, angular fonts with matte black finishes and subtle futuristic lines. Place it on a sleek black background to command attention."
      },
      {
        src: s3Style("/styles/s505.webp"),
        
        basePrompt:
          "Create a professional black gaming logo for ''Text''. Use sleek, modern fonts with strong black outlines and subtle geometric shapes on a deep black backdrop, projecting authority and a high-tech aesthetic."
      },
      {
        src: s3Style("/styles/s506.webp"),
        
        basePrompt:
          "Design a minimalist black-themed gaming logo for ''Text''. Employ clean, modern lettering with subtle dark overlays or minimal neon highlights. Set it against a black background to convey an understated, high-tech vibe."
      },
      {
        src: s3Style("/styles/s507.webp"),
        
        basePrompt:
          "Create a sleek black-themed gaming logo for ''Text''. Use bold, futuristic fonts with glossy black detailing and muted neon accents. Place it on a dark backdrop for a stealthy, powerful presence."
      },
      {
        src: s3Style("/styles/s508.webp"),
        
        basePrompt:
          "Design a modern black gaming logo for ''Text''. Employ streamlined black typography with subtle neon outlines, set against a minimalist dark background to evoke a refined, high-tech gaming aura."
      },
      {
        src: s3Style("/styles/s509.webp"),
        
        basePrompt:
          "Create a stylish black-themed gaming logo for ''Text''. Use bold, minimalist black fonts with faint metallic or neon touches on a deep black backdrop, ensuring a sleek, contemporary gaming look."
      }
    ],
    "Blue": [
      {
        src: s3Style("/styles/s510.webp"),
        
        basePrompt:
          "Design a cool blue-themed gaming logo for ''Text''. Use sleek, futuristic fonts in electric shades of blue with dynamic wave motifs. Place it against a calming yet energetic blue backdrop for a crisp, modern style."
      },
      {
        src: s3Style("/styles/s511.webp"),
        
        basePrompt:
          "Create a blue-themed gaming logo for ''Text''. Incorporate edgy fonts with shimmering blue highlights and subtle wave or bubble designs. Position it on a serene but lively blue background for an agile, fluid vibe."
      },
      {
        src: s3Style("/styles/s512.webp"),
        
        basePrompt:
          "Design a professional blue gaming logo for ''Text''. Employ modern, tech-savvy fonts layered in varying shades of blue, accented by stylized wave or droplet shapes. Set it on a calming, futuristic blue backdrop."
      },
      {
        src: s3Style("/styles/s513.webp"),
        
        basePrompt:
          "Create a minimalist blue gaming logo for ''Text''. Use clean, edgy blue typography with faint glitch or wave lines. Place it on a serene yet electric blue backdrop for a sleek, contemporary gaming feel."
      },
      {
        src: s3Style("/styles/s514.webp"),
        
        basePrompt:
          "Design a stylish blue-themed gaming logo for ''Text''. Employ smooth, futuristic blue fonts with fluid wave accents. Position it on a sleek, neon-blue background for a modern, energetic style."
      },
      {
        src: s3Style("/styles/s515.webp"),
        
        basePrompt:
          "Create a professional blue gaming logo for ''Text''. Use polished, modern fonts with bold, cobalt-blue edges and fluid wave motifs. Set it on a serene yet futuristic blue gradient to reflect advanced gameplay."
      },
      {
        src: s3Style("/styles/s516.webp"),
        
        basePrompt:
          "Design a stylized blue gaming logo for ''Text''. Utilize luminous, cyber-blue typography with subtle wave or bubble illusions. Place it against a vibrant, neon-blue background for a captivating, futuristic vibe."
      },
      {
        src: s3Style("/styles/s517.webp"),
        
        basePrompt:
          "Create a vibrant blue-themed gaming logo for ''Text''. Use dynamic, energetic blue fonts with shimmering wave outlines and subtle water sparks. Position it on a bright, immersive blue backdrop for strong visual impact."
      },
      {
        src: s3Style("/styles/s518.webp"),
        
        basePrompt:
          "Design a creative blue gaming logo for ''Text''. Employ streamlined fonts with futuristic blue gradients, integrating wave or bubble highlights. Place it on a radiant blue background to showcase innovative gaming appeal."
      },
      {
        src: s3Style("/styles/s519.webp"),
        
        basePrompt:
          "Create a modern blue-themed gaming logo for ''Text''. Use sleek, high-tech fonts with bold cyan or royal-blue outlines. Incorporate subtle wave or droplet motifs, set against a luminous, tranquil background for a refined, immersive style."
      }
    ],
    "Green": [
    {
      src: s3Style("/styles/s520.webp"),
      
      basePrompt:
        "Design a green-themed gaming logo for ''Text''. Use bold, futuristic fonts with neon-green highlights, referencing forests or toxic slime for an edgy gamer vibe."
    },
    {
      src: s3Style("/styles/s521.webp"),
      
      basePrompt:
        "Create a vibrant green logo for ''Text''. Merge energetic, angular lettering with leaf or vine motifs, set against a fresh, electric color palette."
    },
    {
      src: s3Style("/styles/s522.webp"),
      
      basePrompt:
        "Forge a sleek green gaming logo for ''Text''. Employ sharp typography in lime or emerald hues, enhanced by subtle wave or glow effects to evoke a futuristic style."
    },
    {
      src: s3Style("/styles/s523.webp"),
      
      basePrompt:
        "Develop a modern green design for ''Text''. Combine crisp, edgy lettering with digital circuit lines or leaf silhouettes for a tech-inspired, eco-friendly twist."
    },
    {
      src: s3Style("/styles/s524.webp"),
      
      basePrompt:
        "Craft a neon-green gaming logo for ''Text''. Use intense glow or glitch details, plus dynamic shapes that accentuate a fast-paced, energetic identity."
    },
    {
      src: s3Style("/styles/s525.webp"),
      
      basePrompt:
        "Create a professional green-themed logo for ''Text''. Use smooth, polished fonts with gradient green edges, adding subtle nature or biohazard icons for gamer flair."
    },
    {
      src: s3Style("/styles/s526.webp"),
      
      basePrompt:
        "Design a bold green logo for ''Text''. Pair strong, blocky letters with swirling leaf or dragon-scale motifs, reflecting both nature and power."
    },
    {
      src: s3Style("/styles/s527.webp"),
      
      basePrompt:
        "Generate a stylized green gaming logo for ''Text''. Combine edgy fonts in neon or forest green with swirling patterns, referencing growth or poison elements."
    },
    {
      src: s3Style("/styles/s528.webp"),
      
      basePrompt:
        "Develop a futuristic green logo for ''Text''. Merge angular, Tron-like typography with vivid lime highlights, giving an advanced, sci-fi aura."
    },
    {
      src: s3Style("/styles/s529.webp"),
      
      basePrompt:
        "Produce a creative green-themed design for ''Text''. Use dynamic, geometric lettering in emerald or lime, adding minimal leaf or lightning icons to capture raw, natural energy."
    },
    {
      src: s3Style("/styles/s530.webp"),
      
      basePrompt:
        "Design a green-themed e-sports mascot logo for ''Text''. Feature a toxic beast or leafy creature, neon-lime outlines, and bold, gritty text for a fierce impression."
    },
    {
      src: s3Style("/styles/s531.webp"),
      
      basePrompt:
        "Create a vibrant green gaming logo for ''Text''. Use a venomous snake or radioactive motif, angular fonts, and contrasting dark tones for an edgy style."
    },
    {
      src: s3Style("/styles/s532.webp"),
      
      basePrompt:
        "Forge a sleek green design for ''Text''. Combine electric lettering in emerald or neon-lime with a stylized reptile, alien, or slime creature in bold lines."
    },
    {
      src: s3Style("/styles/s533.webp"),
      
      basePrompt:
        "Develop a modern green e-sports logo for ''Text''. Focus on a warrior or monster sporting green power effects, paired with aggressive blocky fonts."
    },
    {
      src: s3Style("/styles/s534.webp"),
      
      basePrompt:
        "Craft a neon-toxic logo for ''Text''. Feature radioactive, green fumes or slime drips, thick outlines, and edgy uppercase text for a rebellious gamer look."
    },
    {
      src: s3Style("/styles/s535.webp"),
      
      basePrompt:
        "Create a professional green-themed badge for ''Text''. Use a stylized forest spirit or gas-masked figure, metallic highlights, and strong, crisp fonts for e-sports polish."
    },
    {
      src: s3Style("/styles/s536.webp"),
      
      basePrompt:
        "Design a bold green mascot logo for ''Text''. Portray a fierce plant creature or serpent with dynamic shading, combined with heavy, modern type for an epic effect."
    },
    {
      src: s3Style("/styles/s537.webp"),
      
      basePrompt:
        "Generate a stylized green e-sports logo for ''Text''. Combine edgy fonts in neon or forest green with swirling patterns, referencing growth or poison elements."
    },
    {
      src: s3Style("/styles/s538.webp"),
      
      basePrompt:
        "Develop a futuristic green crest for ''Text''. Combine a slick, robotic creature or mech with neon-lime edges, anchored by an authoritative uppercase font."
    },
    {
      src: s3Style("/styles/s539.webp"),
      
      basePrompt:
        "Produce a creative green-themed design for ''Text''. Use dynamic, geometric lettering in emerald or lime, adding minimal leaf or lightning icons to capture raw, natural energy."
    }
  ],
  "Orange": [
    {
      src: s3Style("/styles/s540.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' dominated by a blazing orange lion. The text ''Text'' has fiery highlights, symbolizing power and intensity."
    },
    {
      src: s3Style("/styles/s541.webp"),
      
      basePrompt: "A dynamic e-sports crest for ''Text'' with a bold orange phoenix. The text ''Text'' is sleek and modern, amplifying the emblem’s fiery energy."
    },
    {
      src: s3Style("/styles/s542.webp"),
      
      basePrompt: "An e-sports badge for ''Text'' showcasing an orange dragon head. The text ''Text'' is styled in black and white, making the orange design pop."
    },
    {
      src: s3Style("/styles/s543.webp"),
      
      basePrompt: "A sporty e-sports design for ''Text'' featuring an orange fox. The text ''Text'' is bold and angular, highlighting agility and fierce competition."
    },
    {
      src: s3Style("/styles/s544.webp"),
      
      basePrompt: "An e-sports emblem for ''Text'' with an orange lightning bolt. The text ''Text'' is sharp and energetic, reflecting swift, electrifying gameplay."
    },
    {
      src: s3Style("/styles/s545.webp"),
      
      basePrompt: "A logo for ''Text'' emphasizing bright orange and black contrasts. The text ''Text'' is modern, underlined by a simple yet striking geometric shape."
    },
    {
      src: s3Style("/styles/s546.webp"),
      
      basePrompt: "A logo for ''Text'' with molten orange gradients and metallic accents. The text ''Text'' radiates warmth, giving a powerful, standout impression."
    },
    {
      src: s3Style("/styles/s547.webp"),
      
      basePrompt: "A logo for ''Text'' showcasing an abstract orange swirl. The text ''Text'' is clean and contemporary, suggesting speed and creativity."
    },
    {
      src: s3Style("/styles/s548.webp"),
      
      basePrompt: "A bold logo for ''Text'' with a bright orange shield. The text ''Text'' is thick and crisp, surrounded by subtle flame patterns for a dynamic touch."
    },
    {
      src: s3Style("/styles/s549.webp"),
      
      basePrompt: "A spirited logo for ''Text'' highlighting an orange sunburst. The text ''Text'' is strong and high-contrast, embodying energy and optimism."
    }
  ],
  "Pink": [
        {
          src: s3Style("/styles/s40.webp"),
          
          basePrompt: "An e-sport logo for ''Text'' inspired by a pink color theme. The text ''Text'' is styled in bold, futuristic typography with a glowing pink outline, framed in a sleek circular badge. Featuring sharp geometric shapes and neon pink energy lines, the design is set against a dark, contrasting background, exuding a vibrant, competitive edge."
        },
        {
          src: s3Style("/styles/s41.webp"),
          
          basePrompt: "Design an e-sport logo for ''Text'' based on a pink aesthetic. The text ''Text'' uses sleek, angular fonts with metallic pink accents, centered in a shield-like emblem. Integrated with a stylized pink lightning bolt, it’s set against a subtle gradient backdrop, perfect for a bold gaming team."
        },
        {
          src: s3Style("/styles/s42.webp"),
          
          basePrompt: "Create a pink-themed e-sport logo for ''Text''. The text ''Text'' is in sharp, modern fonts with a glossy pink finish, encased in a geometric crest. Featuring a pink flame motif, the design captures a fierce, competitive spirit with a clean, team-ready look."
        },
        {
          src: s3Style("/styles/s43.webp"),
          
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by pink vibrancy. The text ''Text'' is bold and stylized with a shimmering pink texture, surrounded by pink crystal shards. Framed in an octagonal badge, it’s set against a faint cyberpunk cityscape, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s44.webp"),
          
          basePrompt: "Design ''Text'' as a pink e-sport logo. The text ''Text'' is crafted with elegant, curved fonts and a glowing pink halo, integrated into a hexagonal emblem with pink smoke effects. The design is striking and energetic, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s45.webp"),
          
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on a pink theme. The text ''Text'' features sleek fonts with pink neon edges, paired with a minimalist pink crown icon. Encased in a sharp, angular frame, it’s set against a vibrant, team-focused pink-and-black color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s46.webp"),
          
          basePrompt: "A professional e-sport logo for ''Text'' inspired by pink power. The text ''Text'' is designed with clean lines and bold pink gradients, centered in a streamlined crest. Featuring a pink phoenix silhouette, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s47.webp"),
          
          basePrompt: "Create a pink-themed e-sport design for ''Text''. The text ''Text'' is in bold, modern typography with subtle pink sparkle accents, integrated into a symmetrical badge. Paired with a pink starburst effect, it’s set in a high-energy pink-and-white scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s48.webp"),
          
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by pink intensity. The text ''Text'' uses dynamic fonts with pink-to-purple gradients, framed in a bold, diamond-shaped emblem. Surrounded by pink electric arcs, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s49.webp"),
          
          basePrompt: "Design a creative pink e-sport logo for ''Text''. The text ''Text'' features bold, futuristic fonts with pink holographic overlays, centered in a rugged, team-oriented crest. Integrated with a pink panther head and glowing accents, it’s a striking emblem for e-sport domination."
        },
      ],
  "Purple": [
        {
          src: s3Style("/styles/s691.webp"),
          
          basePrompt: "A fierce cyber wolf mascot with glowing purple neon eyes and sharp details, surrounded by electric purple aura, with bold metallic text 'Text' below."
        },
        {
          src: s3Style("/styles/s692.webp"),
          
          basePrompt: "A purple dragon mascot with glowing wings made of smoke and fire, stylized for a gaming logo, with strong 3D chrome text 'Text' integrated into the design."
        },
        {
          src: s3Style("/styles/s693.webp"),
          
          basePrompt: "A futuristic samurai mascot in dark armor with glowing purple energy lines, holding a katana, with graffiti-style text 'Text' glowing beneath."
        },
        {
          src: s3Style("/styles/s694.webp"),
          
          basePrompt: "A mystical sorcerer mascot casting purple lightning, hood glowing with neon highlights, with epic fantasy text 'Text' in bold rune-style typography."
        },
        {
          src: s3Style("/styles/s695.webp"),
          
          basePrompt: "A roaring lion mascot with a mane made of glowing purple flames, designed for esports, with sharp cyber-font text 'Text' at the bottom."
        },
        {
          src: s3Style("/styles/s696.webp"),
          
          basePrompt: "Design a bold purple shield emblem gaming logo with sharp edges, glowing accents, and futuristic details. Place the text 'Text' across the shield in esports-style font."
        },
        {
          src: s3Style("/styles/s697.webp"),
          
          basePrompt: "Create a purple skull emblem logo with neon highlights, smoke effects, and a menacing aura. Add the team name 'Text' below in cracked, edgy font."
        },
        {
          src: s3Style("/styles/s698.webp"),
          
          basePrompt: "Generate a clean purple esports badge logo with modern gradients, lightning accents, and sleek typography. Place the text 'Text' at the center in bold futuristic style."
        },
        {
          src: s3Style("/styles/s699.webp"),
          
          basePrompt: "Design a strong purple wordmark gaming logo, with glowing edges, metallic effects, and sharp angles. The main focus is the text 'Text', styled to look powerful and competitive."
        },
        {
          src: s3Style("/styles/s700.webp"),
          
          basePrompt: "Create a purple animal emblem logo (eagle, lion, or snake) with glowing neon details, sharp edges, and a competitive gaming vibe. Add the name 'Text' below in bold esports font."
        },
      ]
    // Other colors (Green, Orange, etc.) continue here ...
  },
  "Holidays & Seasonal": {
    "Dia de Muertos": [
      {
        src: s3Style("/styles/s550.webp"),
        
        basePrompt:
          "Design a vibrant Dia de Muertos-themed gaming logo for ''Text''. Use ornate, decorative fonts with colorful sugar skulls and marigolds. Emphasize festive, celebratory energy."
      },
      {
        src: s3Style("/styles/s551.webp"),
        
        basePrompt:
          "Create a Dia de Muertos-inspired logo for ''Text''. The text ''Text'' should use decorative typography with bright sugar skull motifs and floral accents, evoking a fun yet respectful holiday vibe."
      },
      {
        src: s3Style("/styles/s552.webp"),
        
        basePrompt:
          "Forge a gaming logo for ''Text'' themed around Dia de Muertos. Combine ornate, lively fonts with sugar skull designs and marigold highlights for a culturally rich, festive look."
      },
      {
        src: s3Style("/styles/s553.webp"),
        
        basePrompt:
          "Develop a dynamic Dia de Muertos logo for ''Text''. Use intricate, colorful fonts adorned with skulls and floral patterns. Add bold, celebratory color pops for holiday flair."
      },
      {
        src: s3Style("/styles/s554.webp"),
        
        basePrompt:
          "Craft a Dia de Muertos-inspired gaming logo for ''Text''. Integrate ornate, decorative typography with sugar skull icons, vibrant flowers, and playful patterns, reflecting festive traditions."
      },
      /*{
        src: s3Style("/styles/s555.webp"),
        
        basePrompt:
          "Design a professional Dia de Muertos game logo for ''Text''. Display **only** the text ''Text'' in the design. Use intricate fonts with colorful sugar skulls and marigolds on a bold, celebratory background, ensuring that ''Text'' is clearly visible and no additional text is present."
      },*/
      {
        src: s3Style("/styles/s556.webp"),
        
        basePrompt:
          "Create a stylized Dia de Muertos gaming logo for ''Text''. Combine ornate, folk-art-style lettering with colorful skeletal motifs and floral flourishes, capturing vibrant cultural energy."
      },
      {
        src: s3Style("/styles/s557.webp"),
        
        basePrompt:
          "Generate a vivid Dia de Muertos logo for ''Text''. Use decorative, candy-colored fonts, sugar skull themes, and bright marigold accents for a joyous, culturally rich design."
      },
      /*{
        src: s3Style("/styles/s558.webp"),
        
        basePrompt:
          "Develop a creative Dia de Muertos logo for ''Text''. The design must include **only** the text ''Text'' in ornate fonts, paired with bold sugar skull motifs and lively florals. Use bright color patterns that honor the holiday while keeping ''Text'' visible as the sole text element."
      },*/
      {
        src: s3Style("/styles/s559.webp"),
        
        basePrompt:
          "Design a modern Dia de Muertos-themed logo for ''Text''. Use stylized lettering and colorful skull graphics, accented by marigolds. Aim for a fun, festive, and respectful holiday touch."
      }
    ],
    "Easter": [
      {
        src: s3Style("/styles/s560.webp"),
        
        basePrompt:
          "Design a cheerful Easter-themed gaming logo for ''Text''. Use playful, pastel-toned fonts, bunny silhouettes, and decorated eggs, evoking a lighthearted, spring celebration."
      },
      {
        src: s3Style("/styles/s561.webp"),
        
        basePrompt:
          "Create an Easter-inspired logo for ''Text''. Employ soft, pastel lettering with integrated bunnies, eggs, or flower motifs. Showcase a joyful, vibrant holiday spirit."
      },
      {
        src: s3Style("/styles/s562.webp"),
        
        basePrompt:
          "Forge a gaming logo for ''Text'' with an Easter theme. Use fun, pastel-colored fonts, bunny ears, and egg designs, set against a bright, celebratory background."
      },
      {
        src: s3Style("/styles/s563.webp"),
        
        basePrompt:
          "Develop a dynamic Easter logo for ''Text''. Combine playful, bubble-like text in pastel hues with bunny or egg icons, capturing a lively, family-friendly vibe."
      },
      {
        src: s3Style("/styles/s564.webp"),
        
        basePrompt:
          "Craft an Easter-themed gaming logo for ''Text''. Use pastel, whimsical fonts, integrated rabbits and eggs, and bright floral accents, reflecting the renewal of spring."
      },
      /*{
        src: s3Style("/styles/s565.webp"),
        
        basePrompt:
          "Design a polished Easter logo for ''Text''. The text ''Text'' should merge soft pastel typography with bunny silhouettes or egg patterns, set on a bright, happy color palette for festive appeal."
      },*/
      {
        src: s3Style("/styles/s566.webp"),
        
        basePrompt:
          "Create a stylized Easter gaming logo for ''Text''. Feature bubbly, pastel fonts, integrated Easter icons, and playful springtime hues to evoke holiday excitement."
      },
      {
        src: s3Style("/styles/s567.webp"),
        
        basePrompt:
          "Generate a vibrant Easter-themed logo for ''Text''. Combine pastel, cartoon-like lettering, bunny motifs, and decorated egg shapes, capturing a cheerful, celebratory tone."
      },
      /*{
        src: s3Style("/styles/s568.webp"),
        
        basePrompt:
          "Develop a creative Easter logo for ''Text''. The text ''Text'' should use playful, pastel fonts, bright bunny ears, and spring flowers or eggs, evoking a sense of joy and holiday fun."
      },*/
      {
        src: s3Style("/styles/s569.webp"),
        
        basePrompt:
          "Design a modern Easter-themed gaming logo for ''Text''. Employ light, pastel-toned typography with subtle rabbit or egg icons, highlighting a fresh, lively spring ambiance."
      }
    ],
    "Halloween": [
      {
        src: s3Style("/styles/s570.webp"),
        
        basePrompt:
          "Design a spooky Halloween-themed gaming logo for ''Text''. Use jagged, eerie fonts with orange accents, integrating bats, pumpkins, or spiderwebs on a dark, haunted backdrop."
      },
      {
        src: s3Style("/styles/s571.webp"),
        
        basePrompt:
          "Create a Halloween-inspired logo for ''Text''. Employ gothic, horror-style lettering, jack-o'-lanterns, bats, or spiderweb motifs. Set it against a chilling, ominous backdrop."
      },
      {
        src: s3Style("/styles/s572.webp"),
        
        basePrompt:
          "Forge a high-impact Halloween gaming logo for ''Text''. Use sharp, haunted fonts with orange and black contrasts, referencing pumpkins or ghoulish silhouettes."
      },
      {
        src: s3Style("/styles/s573.webp"),
        
        basePrompt:
          "Develop a dynamic Halloween logo for ''Text''. Combine bold, spooky text, jack-o'-lantern graphics, and dramatic color flares for a menacing yet festive vibe."
      },
      {
        src: s3Style("/styles/s574.webp"),
        
        basePrompt:
          "Craft a Halloween-themed gaming logo for ''Text''. Use jagged, eerie fonts, spiderweb overlays, and bright orange highlights to convey a fun yet frightening feel."
      },
      {
        src: s3Style("/styles/s575.webp"),
        
        basePrompt:
          "Design a professional Halloween logo for ''Text''. Integrate haunting, stylized fonts, pumpkin or bat motifs, and subtle neon glows, reflecting a darkly festive aesthetic."
      },
      {
        src: s3Style("/styles/s576.webp"),
        
        basePrompt:
          "Create a stylized Halloween logo for ''Text''. Use eerie, jagged text with ghostly or skeletal motifs, layered on a foggy, neon-lit background for supernatural flair."
      },
      {
        src: s3Style("/styles/s577.webp"),
        
        basePrompt:
          "Generate a vibrant Halloween-themed logo for ''Text''. Combine spooky, angular fonts, candy-bright oranges, and iconic items like pumpkins or bats for a playful horror vibe."
      },
      {
        src: s3Style("/styles/s578.webp"),
        
        basePrompt:
          "Develop a creative Halloween logo for ''Text''. Merge bold, spooky fonts, grinning pumpkins, and creeping vines or webs. Aim for a spirited, haunted celebration feel."
      },
      {
        src: s3Style("/styles/s579.webp"),
        
        basePrompt:
          "Design a modern Halloween-themed gaming logo for ''Text''. Use jagged, cryptic lettering with subtle neon highlights, plus bat or spiderweb motifs, channeling an eerie festive aura."
      }
    ],
    "Holiday": [
    {
      src: s3Style("/styles/s580.webp"),
      
      basePrompt:
        "Design a joyful holiday-themed gaming logo for ''Text''. Use festive fonts, playful snowflake or ornament details, and bright, celebratory colors."
    },
    {
      src: s3Style("/styles/s581.webp"),
      
      basePrompt:
        "Create a festive holiday logo for ''Text''. Merge cheerful lettering, candy cane stripes or gift box elements, and a warm, glowing backdrop for a cozy gaming vibe."
    },
    {
      src: s3Style("/styles/s582.webp"),
      
      basePrompt:
        "Forge a winter wonderland holiday logo for ''Text''. Combine frosty, playful typography, ice crystal effects, and subtle gaming icons with a bright holiday palette."
    },
    {
      src: s3Style("/styles/s583.webp"),
      
      basePrompt:
        "Develop a dynamic holiday-themed design for ''Text''. Use bold, celebratory fonts, snow-laced edges, and stylized ornaments or bells for a merry gaming style."
    },
    {
      src: s3Style("/styles/s584.webp"),
      
      basePrompt:
        "Craft a modern holiday gaming logo for ''Text''. Integrate crisp, edgy lettering with sleek snowflake or star motifs, using neon reds and greens for an eSports-friendly twist."
    },
    /*{
      src: s3Style("/styles/s585.webp"),
      
      basePrompt:
        "Create a magical holiday logo for ''Text''. Combine whimsical fonts with sparkling lights, reindeer silhouettes, or festive wreaths for a cozy, gift-worthy feel."
    },*/
    {
      src: s3Style("/styles/s586.webp"),
      
      basePrompt:
        "Design a celebratory holiday logo for ''Text''. Merge bright, energetic lettering, scattered confetti, and minimal gaming references, capturing a year-end party vibe."
    },
    {
      src: s3Style("/styles/s587.webp"),
      
      basePrompt:
        "Generate a stylized holiday-themed logo for ''Text''. Use frosted, fun fonts, string lights or candy icons, and vibrant colors for a warm, festive gaming approach."
    },
    {
      src: s3Style("/styles/s588.webp"),
      
      basePrompt:
        "Develop a cheerful holiday gaming logo for ''Text''. Blend playful typography, small gift box or mistletoe details, and a bold, jolly color scheme."
    },
    {
      src: s3Style("/styles/s589.webp"),
      
      basePrompt:
        "Produce a sleek holiday logo for ''Text''. Utilize modern, minimal fonts with subtle holiday icons (like bells or ribbons) and a refined color palette for a classy seasonal feel."
    },
    {
      src: s3Style("/styles/s590.webp"),
      
      basePrompt:
        "Design a joyful holiday mascot logo for ''Text''. Use a fun character like a snowman or elf with thick outlines, bright reds and greens, and playful e-sports text."
    },
    {
      src: s3Style("/styles/s591.webp"),
      
      basePrompt:
        "Create a festive holiday logo for ''Text''. Combine a cheerful reindeer or ornament mascot, candy-cane patterns, and bold, cartoony lettering for a merry vibe."
    },
    {
      src: s3Style("/styles/s592.webp"),
      
      basePrompt:
        "Forge a winter wonderland e-sports logo for ''Text''. Combine frosty, playful typography, ice crystal effects, and subtle gaming icons with a bright holiday palette."
    },
    {
      src: s3Style("/styles/s593.webp"),
      
      basePrompt:
        "Develop a dynamic holiday-themed design for ''Text''. Show a bell- or toy-inspired mascot with neon edges, plus strong uppercase fonts for a party-like feel."
    },
    {
      src: s3Style("/styles/s594.webp"),
      
      basePrompt:
        "Craft a modern holiday gaming logo for ''Text''. Combine a stylized sleigh or candy motif, bright contrasting colors, and thick lines for a cheerful e-sports style."
    },
    /*{
      src: s3Style("/styles/s595.webp"),
      
      basePrompt:
        "Create a magical holiday design for ''Text''. Use a whimsical elf or gift box character, bold glows, and cartoon-like text for a cozy, gift-worthy impression."
    },*/
    {
      src: s3Style("/styles/s596.webp"),
      
      basePrompt:
        "Design a celebratory holiday logo for ''Text''. Merge fireworks or confetti with a jolly mascot (like a gingerbread man), plus dynamic e-sports fonts for year-end excitement."
    },
    {
      src: s3Style("/styles/s597.webp"),
      
      basePrompt:
        "Generate a stylized holiday-themed mascot for ''Text''. Use frosted, fun fonts, string lights or candy icons, and vibrant colors for a warm, festive gaming approach."
    },
    {
      src: s3Style("/styles/s598.webp"),
      
      basePrompt:
        "Develop a cheerful holiday gaming logo for ''Text''. Incorporate a comedic holiday figure (reindeer or snow monster) with big eyes, neon highlights, and thick text lines."
    },
    {
      src: s3Style("/styles/s599.webp"),
      
      basePrompt:
        "Produce a sleek festive logo for ''Text''. Fuse modern, minimal fonts with subtle holiday icons (bells or ribbons) and a classy color palette for a refined seasonal approach."
    }
  ],
  "Valentine's Day": [
    {
      src: s3Style("/styles/s630.webp"),
      
      basePrompt: "An e-sports mascot logo for ''Text'' with a heart-shaped creature. The text ''Text'' is playful and pink, symbolizing romance in a competitive arena."
    },
    {
      src: s3Style("/styles/s631.webp"),
      
      basePrompt: "An e-sports crest for ''Text'' featuring cupid arrows and a glowing heart. The text ''Text'' is outlined by soft reds and whites for a sweet yet bold look."
    },
    {
      src: s3Style("/styles/s632.webp"),
      
      basePrompt: "A Valentine's e-sports badge for ''Text'' with a cartoon cherub. The text ''Text'' is in a candy pink font, adorned with sparkly hearts and bows."
    },
    {
      src: s3Style("/styles/s633.webp"),
      
      basePrompt: "A romantic e-sports emblem for ''Text'' starring a winged heart wearing headphones. The text ''Text'' is dynamic and fun, set against a rosy halo."
    },
    {
      src: s3Style("/styles/s634.webp"),
      
      basePrompt: "A playful e-sports logo for ''Text'' with a sweet cupid bear. The text ''Text'' is curved, framed by mini hearts and swirling pastel ribbons."
    },
    {
      src: s3Style("/styles/s635.webp"),
      
      basePrompt: "A logo for ''Text'' focused on a warm Valentine's vibe. The text ''Text'' is elegantly scripted, accented by a large heart motif and subtle roses."
    },
    {
      src: s3Style("/styles/s636.webp"),
      
      basePrompt: "A logo for ''Text'' with interwoven hearts in a gentle pink palette. The text ''Text'' is neat and modern, signifying a sweet, romantic tone."
    },
    {
      src: s3Style("/styles/s637.webp"),
      
      basePrompt: "A logo for ''Text'' featuring a stylized rose wreath. The text ''Text'' stands out in a bold red hue, surrounded by delicate blossoms and soft sparkles."
    },
    {
      src: s3Style("/styles/s638.webp"),
      
      basePrompt: "A logo for ''Text'' with heart-shaped balloons and a subtle glitter effect. The text ''Text'' is round and playful, capturing cheerful Valentine's vibes."
    },
    {
      src: s3Style("/styles/s639.webp"),
      
      basePrompt: "A logo for ''Text'' merging a heart lock and key design. The text ''Text'' is romantic yet sleek, symbolizing love, trust, and unity."
    }
  ],
  "St Patrick's Day": [
        {
          src: s3Style("/styles/s50.webp"),
          basePrompt: "An e-sport logo for ''Text'' inspired by St. Patrick’s Day. The text ''Text'' is styled in bold, Celtic-inspired typography with a glowing green outline, framed in a sleek circular badge. Featuring a shamrock with golden accents, the design is set against a faint emerald forest texture, exuding luck and competitive spirit."
        },
        {
          src: s3Style("/styles/s51.webp"),
          basePrompt: "Design an e-sport logo for ''Text'' based on St. Patrick’s Day motifs. The text ''Text'' uses sleek, angular fonts with metallic green edges, centered in a shield-like emblem. Integrated with a leprechaun’s hat and a pot of gold, it’s set against a subtle Irish countryside outline, perfect for a pro gaming team."
        },
        {
          src: s3Style("/styles/s52.webp"),
          basePrompt: "Create a St. Patrick’s Day-themed e-sport logo for ''Text''. The text ''Text'' is in sharp, modern fonts with a glossy green finish, encased in a geometric crest. Featuring a Celtic knot and a four-leaf clover, the design captures a festive, competitive edge with a clean, team-ready look."
        },
        {
          src: s3Style("/styles/s53.webp"),
          basePrompt: "A dynamic e-sport logo for ''Text'' inspired by St. Patrick’s Day. The text ''Text'' is bold and stylized with a shimmering green texture, surrounded by swirling shamrock vines. Framed in an octagonal badge, it’s set against a faint rainbow backdrop, built for e-sport branding."
        },
        {
          src: s3Style("/styles/s54.webp"),
          basePrompt: "Design ''Text'' as a St. Patrick’s Day e-sport logo. The text ''Text'' is crafted with elegant, runic fonts and a glowing green halo, integrated into a hexagonal emblem with golden coins and clover motifs. The design is vibrant and fierce, ideal for a competitive gaming squad."
        },
        {
          src: s3Style("/styles/s55.webp"),
          basePrompt: "Create a stylized e-sport logo for ''Text'' based on St. Patrick’s Day elements. The text ''Text'' features Celtic fonts with green neon edges, paired with a minimalist leprechaun silhouette. Encased in a sharp, angular frame, it’s set against a vibrant, team-focused green-and-gold color scheme, perfect for e-sport jerseys."
        },
        {
          src: s3Style("/styles/s56.webp"),
          basePrompt: "A professional e-sport logo for ''Text'' inspired by St. Patrick’s Day luck. The text ''Text'' is designed with clean lines and bold green gradients, centered in a streamlined crest. Featuring a harp with shamrock accents, it’s built for a polished, competitive team identity."
        },
        {
          src: s3Style("/styles/s57.webp"),
          basePrompt: "Create a St. Patrick’s Day-themed e-sport design for ''Text''. The text ''Text'' is in bold, modern typography with subtle clover accents, integrated into a symmetrical badge. Paired with a golden horseshoe and green mist, it’s set in a high-energy green-and-black scheme, tailored for e-sport tournaments."
        },
        {
          src: s3Style("/styles/s58.webp"),
          basePrompt: "A vibrant e-sport logo for ''Text'' inspired by St. Patrick’s Day festivity. The text ''Text'' uses dynamic fonts with green-to-gold gradients, framed in a bold, diamond-shaped emblem. Surrounded by a dancing leprechaun and shamrock bursts, it’s designed to stand out in competitive gaming scenes."
        },
        {
          src: s3Style("/styles/s59.webp"),
          basePrompt: "Design a creative St. Patrick’s Day e-sport logo for ''Text''. The text ''Text'' features bold, Celtic fonts with vibrant green overlays, centered in a rugged, team-oriented crest. Integrated with a rainbow arch and a pot of gold, it’s a striking emblem for e-sport domination."
        },
      ]
    // You can add more holidays like St. Patrick’s Day, etc., following a similar style.
  },
  "Real‐World / Cultural": {
    "Brazil": [
      {
        src: s3Style("/styles/s600.webp"),
        
        basePrompt:
          "Design a vibrant Brazil-themed gaming logo for ''Text''. Use bold, colorful fonts with Brazilian flag elements, tropical leaves, and samba-inspired patterns, evoking a lively, cultural flair."
      },
      {
        src: s3Style("/styles/s601.webp"),
        
        basePrompt:
          "Create a Brazil-inspired logo for ''Text''. Incorporate bright, festive lettering, tropical flora, and lively colors. Include subtle references to Brazilian spirit or carnival motifs."
      },
      {
        src: s3Style("/styles/s602.webp"),
        
        basePrompt:
          "Forge a gaming logo for ''Text'' based on Brazilian culture. Utilize bold, tropical fonts with samba vibes, Brazilian flag accents, and lush leaf silhouettes against an energetic background."
      },
      {
        src: s3Style("/styles/s603.webp"),
        
        basePrompt:
          "Develop a dynamic Brazil-themed logo for ''Text''. Merge bright, stylized typography, carnival-infused designs, and tropical icons, reflecting the country's upbeat, rhythmic energy."
      },
      {
        src: s3Style("/styles/s604.webp"),
        
        basePrompt:
          "Craft a culturally rich Brazil logo for ''Text''. Combine bold, colorful fonts, the Brazilian flag, and tropical references like palm leaves, culminating in a vivid, celebratory aura."
      },
      {
        src: s3Style("/styles/s605.webp"),
        
        basePrompt:
          "Design a polished Brazil-inspired gaming logo for ''Text''. Use strong, vibrant lettering with samba or carnival motifs, accentuating the country's dynamic spirit and festive color palette."
      },
      /*{
        src: s3Style("/styles/s606.webp"),
        
        basePrompt:
          "Create a stylized Brazil logo for ''Text''. The text ''Text'' should integrate bold, tropical fonts, elements of the Brazilian flag, and carnival flourishes, aiming for a lively, culturally immersive feel."
      },*/
      {
        src: s3Style("/styles/s607.webp"),
        
        basePrompt:
          "Generate a vibrant Brazil-themed gaming logo for ''Text''. Employ bold, festive letters with bright color contrasts and tropical or samba-inspired icons, channeling energetic carnival vibes."
      },
      /*{
        src: s3Style("/styles/s608.webp"),
        
        basePrompt:
          "Develop a creative Brazil logo for ''Text''. The text ''Text'' should incorporate dynamic, tropical typography with references to the Brazilian flag, samba motifs, and lush foliage for a spirited, cultural design."
      },*/
      {
        src: s3Style("/styles/s609.webp"),
        
        basePrompt:
          "Design a modern Brazil-inspired gaming logo for ''Text''. Use bold, colorful fonts, carnival shapes, and subtle flag details. Exude vibrant excitement and cultural pride."
      }
    ],
    "Patriotic": [
      {
        src: s3Style("/styles/s620.webp"),
        
        basePrompt:
          "Design a bold patriotic gaming logo for ''Text''. Use national symbols like flags or eagles, integrated into strong, national-colored fonts. Convey pride and unity."
      },
      {
        src: s3Style("/styles/s621.webp"),
        
        basePrompt:
          "Create a patriotic-themed logo for ''Text''. Employ robust, national-hued lettering, referencing iconic emblems or stars. Set against a proud, celebratory backdrop."
      },
      {
        src: s3Style("/styles/s622.webp"),
        
        basePrompt:
          "Forge a patriotic gaming logo for ''Text''. Use bold, dynamic fonts in national colors, plus symbolic flags or eagles, evoking a spirit of unity and competitive pride."
      },
      {
        src: s3Style("/styles/s623.webp"),
        
        basePrompt:
          "Develop a striking patriotic logo for ''Text''. Combine stylized, national-colored text with strong imagery like flags or badges for a steadfast, inspiring look."
      },
      {
        src: s3Style("/styles/s624.webp"),
        
        basePrompt:
          "Craft a patriotic-themed emblem for ''Text''. Integrate flags, stars, or eagles with bold, national-hued fonts. Convey determination and unity in a competitive arena."
      },
      {
        src: s3Style("/styles/s625.webp"),
        
        basePrompt:
          "Design a professional patriotic gaming logo for ''Text''. Use angular, national-colored lettering with iconic symbols (e.g., eagle heads, star shields) for a proud, determined tone."
      },
      {
        src: s3Style("/styles/s626.webp"),
        
        basePrompt:
          "Create a stylized patriotic logo for ''Text''. The text ''Text'' should merge bold typography with flag patterns or eagles in motion, channeling a rallying spirit of heroism and victory."
      },
      {
        src: s3Style("/styles/s627.webp"),
        
        basePrompt:
          "Generate a vibrant patriotic-themed logo for ''Text''. Use strong, energetic fonts with national flags or badges, set against a dynamic background that celebrates identity and pride."
      },
      {
        src: s3Style("/styles/s628.webp"),
        
        basePrompt:
          "Develop a creative patriotic logo for ''Text''. Incorporate eye-catching, national-hued fonts, stars, or eagle silhouettes, radiating unity and competitiveness."
      },
      {
        src: s3Style("/styles/s629.webp"),
        
        basePrompt:
          "Design a modern patriotic-inspired gaming logo for ''Text''. Use bold, national-colored typography, integrated flag or eagle icons, and subtle metallic finishes to signify strength and loyalty."
      }
    ]
    // Additional cultural subcategories like LGBT, etc., can be added similarly.
  }
};