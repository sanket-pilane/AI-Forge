export interface Prompt {
  id: string;
  title: string;
  model: string;
  type: string;
  category: string;
  image_url: string;
  prompt_text: string;
  negative_prompt: string | null;
  parameters: Record<string, string>;
  likes: number;
  author: string;
}

export const prompts: Prompt[] = [
  {
    id: "1",
    title: "Neon Noir Cyberpunk Detective",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Photography",
    image_url: "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Cinematic shot, medium close-up of a rugged cybernetic detective standing in rain-slicked neon streets of Neo-Tokyo, glowing holographic advertisements reflecting in puddles, atmospheric fog, moody lighting, cyan and magenta color palette, 8k resolution, photorealistic texture.",
    negative_prompt: "cartoon, anime, 3d render, low quality, blurry, deformed text, bad anatomy, extra fingers",
    parameters: {
      ar: "16:9",
      stylize: "250",
      chaos: "20"
    },
    likes: 342,
    author: "NeonDreamer"
  },
  {
    id: "2",
    title: "Professional LinkedIn Bio Generator",
    model: "ChatGPT-4",
    type: "Text",
    category: "Writing",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Act as a professional copywriter and personal branding expert. Write a compelling LinkedIn 'About' section for a [Job Title] with [Number] years of experience in [Industry]. Highlights include: [Key Achievement 1], [Key Achievement 2], and [Key Skill]. The tone should be professional yet approachable, using active voice and bullet points for readability. Include a call to action at the end.",
    negative_prompt: null,
    parameters: {
      tone: "Professional",
      length: "Medium"
    },
    likes: 890,
    author: "CareerCoachAI"
  },
  {
    id: "3",
    title: "Minimalist Vector Logo: Coffee Shop",
    model: "DALL-E 3",
    type: "Image",
    category: "Logo Design",
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A minimalist vector logo design for a coffee shop named 'Luna Brew'. The icon should combine a crescent moon and a coffee bean. Flat design, solid black lines on a white background, no shading, clean geometry, paul rand style.",
    negative_prompt: "photorealistic, complex details, shading, gradients, text, 3d",
    parameters: {
      size: "1024x1024",
      style: "natural"
    },
    likes: 156,
    author: "DesignBot"
  },
  {
    id: "4",
    title: "Hyper-Realistic Food Photography",
    model: "Flux.1",
    type: "Image",
    category: "Photography",
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Top-down view of a gourmet artisanal pizza with fresh basil, buffalo mozzarella, and blistered crust on a rustic wooden table. Natural sunlight streaming from the side creating hard shadows, 85mm lens, f/1.8, food photography magazine quality, vibrant colors, steam rising.",
    negative_prompt: "plastic, fake, oversaturated, blurry, noise, illustration",
    parameters: {
      guidance_scale: "3.5",
      steps: "25"
    },
    likes: 520,
    author: "GourmetLens"
  },
  {
    id: "5",
    title: "Cinematic Drone Shot: Icelandic Highlands",
    model: "Runway Gen-2",
    type: "Video",
    category: "Cinematography",
    image_url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Low angle drone shot flying fast over moss-covered volcanic rocks and a glacial river in Iceland, moody overcast sky, cinematic motion blur, 4k, high production value.",
    negative_prompt: "static, shaky camera, warped landscape, artifacts",
    parameters: {
      motion_score: "8",
      camera_zoom: "out"
    },
    likes: 210,
    author: "SkyWalker"
  },
  {
    id: "6",
    title: "Isometric 3D Room Design",
    model: "Midjourney v6.0",
    type: "Image",
    category: "3D Art",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Isometric view of a cozy gamer bedroom, soft pastel color palette, floating objects, blender 3d style, clay render, high detail, warm lighting, potted plants, pc setup with multiple monitors.",
    negative_prompt: "photorealistic, gritty, dark, messy",
    parameters: {
      ar: "1:1",
      stylize: "100"
    },
    likes: 675,
    author: "PolyMaster"
  },
  {
    id: "7",
    title: "Python Script: Data Visualization",
    model: "Claude 3.5 Sonnet",
    type: "Text",
    category: "Coding",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Write a Python script using pandas and matplotlib to create a dual-axis chart. The left axis should plot 'Revenue' as a bar chart, and the right axis should plot 'Profit Margin' as a line chart. Use a dark theme for the plot styling. Include comments explaining the code.",
    negative_prompt: null,
    parameters: {
      language: "Python",
      frameworks: "Matplotlib, Pandas"
    },
    likes: 405,
    author: "DevAssist"
  },
  {
    id: "8",
    title: "Studio Ghibli Style Landscape",
    model: "Niji Journey v6",
    type: "Image",
    category: "Anime",
    image_url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A rolling green meadow with fluffy white clouds in a bright blue sky, a small cottage in the distance, wind blowing through tall grass, Studio Ghibli art style, hand-painted texture, vibrant greens and blues, summer vibes.",
    negative_prompt: "3d, photorealistic, dark, ominous, low resolution",
    parameters: {
      ar: "16:9",
      niji: "true"
    },
    likes: 899,
    author: "AnimeFan01"
  },
  {
    id: "9",
    title: "Oil Painting: Renaissance Portrait",
    model: "Stable Diffusion XL",
    type: "Image",
    category: "Fine Art",
    image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A hyper-detailed oil painting of a woman in Renaissance attire, Vermeer lighting, chiaroscuro, high contrast, smooth blending, painted on canvas, high resolution.",
    negative_prompt: "modern, digital art, blurry, cartoon, signature, text, ugly",
    parameters: {
      cfg: "7",
      sampler: "dpm++ 2m karras"
    },
    likes: 580,
    author: "ArtGenius"
  },
  {
    id: "10",
    title: "Marketing Email Subject Line A/B Test",
    model: "Gemini 2.5 Flash",
    type: "Text",
    category: "Marketing",
    image_url: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Generate 5 subject lines for an A/B test campaign announcing a 20% off flash sale on all software licenses. Subject lines must use urgency and curiosity. Example: [Software Name] Flash Sale: 20% Off!",
    negative_prompt: null,
    parameters: {
      industry: "SaaS",
      focus: "Urgency"
    },
    likes: 712,
    author: "MarketMind"
  },
  {
    id: "11",
    title: "Futuristic City Blueprint",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Architecture",
    image_url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Detailed 3D architectural blueprint rendering of a sustainable, vertical futuristic city, high angle, blueprint lines on vellum paper, isometric, clean and precise, in the style of Syd Mead.",
    negative_prompt: "photorealistic, messy, wires, dirt, low quality, color",
    parameters: {
      ar: "3:2",
      stylize: "150"
    },
    likes: 640,
    author: "ArchVizAI"
  },
  {
    id: "12",
    title: "Animated Hand-Drawn Sketch to Life",
    model: "Pika Labs",
    type: "Video",
    category: "Animation",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A loose, charcoal sketch of a lonely lighthouse on a rocky coast transitioning into a fully animated scene with rough waves and a storm. Hand-drawn animation style, subtle movement.",
    negative_prompt: "perfect lines, 3D, CGI, stable camera, high detail",
    parameters: {
      fps: "12",
      style: "sketch"
    },
    likes: 495,
    author: "PencilMover"
  },
  {
    id: "13",
    title: "Complex Legal Document Summary",
    model: "Claude 3 Opus",
    type: "Text",
    category: "Business",
    image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Summarize the following 10,000-word Term Sheet into 5 key bullet points for a non-legal audience. Focus only on financial obligations and termination clauses, maintaining objective tone.",
    negative_prompt: null,
    parameters: {
      length: "Concise",
      tone: "Formal"
    },
    likes: 310,
    author: "LegalBot"
  },
  {
    id: "14",
    title: "Whimsical Children's Book Illustration",
    model: "DALL-E 3",
    type: "Image",
    category: "Illustration",
    image_url: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A cheerful red fox wearing spectacles reading a book under a giant glowing mushroom, watercolor illustration style, soft colors, high detail, happy, perfect for a children's book.",
    negative_prompt: "dark, scary, photorealistic, blurry, text, borders",
    parameters: {
      size: "1792x1024",
      style: "vivid"
    },
    likes: 933,
    author: "FairyTaleGen"
  },
  {
    id: "15",
    title: "Minimalist Desktop Wallpaper (Geometric)",
    model: "Stable Diffusion XL",
    type: "Image",
    category: "Wallpaper",
    image_url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Abstract geometric pattern wallpaper, subtle gradient of navy blue to deep violet, matte finish, minimalist, 4k desktop resolution, seamless pattern.",
    negative_prompt: "busy, complex, objects, texture, photography, noise",
    parameters: {
      cfg: "8",
      steps: "30"
    },
    likes: 477,
    author: "WallCraft"
  },
  {
    id: "16",
    title: "Creative Story Prompt Generator",
    model: "ChatGPT-4",
    type: "Text",
    category: "Creative Writing",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Generate a detailed, three-part story premise for a Science Fiction novella. The premise must include a flawed protagonist, a unique future technology, and a major moral dilemma, in the style of Philip K. Dick.",
    negative_prompt: null,
    parameters: {
      genre: "Sci-Fi",
      length: "Detailed"
    },
    likes: 512,
    author: "IdeaForge"
  },
  {
    id: "17",
    title: "Macro Photography of Liquid Metal",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Abstract",
    image_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Extreme macro shot of liquid mercury reflecting rainbow light on a polished black surface, shallow depth of field, high-speed photography, highly detailed, vibrant colors, close-up.",
    negative_prompt: "realistic objects, low contrast, dull colors, human figures, text",
    parameters: {
      ar: "1:1",
      stylize: "500"
    },
    likes: 765,
    author: "AbstractPro"
  },
  {
    id: "18",
    title: "Code Review Feedback Template",
    model: "Gemini 2.5 Flash",
    type: "Text",
    category: "Coding",
    image_url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Create a template for giving constructive code review feedback. The template should include sections for 'High-Priority Issues', 'Minor Suggestions (Style)', and 'Positive Feedback'. Use markdown formatting.",
    negative_prompt: null,
    parameters: {
      language: "General",
      tone: "Supportive"
    },
    likes: 299,
    author: "DevAssist"
  },
  {
    id: "19",
    title: "Time-Lapse of Mountain Formation",
    model: "Runway Gen-2",
    type: "Video",
    category: "Science",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A dramatic, accelerated time-lapse of a massive mountain range rising out of the earth's crust, cinematic camera movement, geological scale, rough textures, earth tones, high detail.",
    negative_prompt: "animals, structures, cartoon, slow motion, blurry",
    parameters: {
      motion_score: "6",
      texture: "realistic"
    },
    likes: 550,
    author: "GeoViz"
  },
  {
    id: "20",
    title: "Vintage Travel Poster (Mars)",
    model: "DALL-E 3",
    type: "Image",
    category: "Design",
    image_url: "https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A vintage 1950s travel poster advertising a trip to Mars. Bold typography, stark red and orange color palette, stylized rocket ship landing near a dome city. Retro art style, silkscreen effect.",
    negative_prompt: "modern graphics, high-res photography, blurry, text errors, low detail",
    parameters: {
      size: "1792x1024",
      style: "nostalgic"
    },
    likes: 780,
    author: "RetroFuture"
  },
  {
    id: "21",
    title: "Low-Poly Game Asset (Treasure Chest)",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Game Art",
    image_url: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A detailed low-poly 3D model of an ornate wooden treasure chest filled with gold coins, rendered in a bright studio light, sharp edges, game asset quality, stylized.",
    negative_prompt: "photorealistic, high-poly, blurry, complex textures, messy",
    parameters: {
      ar: "4:3",
      quality: "2"
    },
    likes: 815,
    author: "PolyMaster"
  },
  {
    id: "22",
    title: "SEO Blog Post Outline",
    model: "ChatGPT-4",
    type: "Text",
    category: "Marketing",
    image_url: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Generate a comprehensive, 15-point outline for a blog post titled 'The Ultimate Guide to Remote Work Productivity'. Include a strong introduction, three main sections, and a conclusion with a call to action. Target keyword: 'Remote Productivity Hacks'.",
    negative_prompt: null,
    parameters: {
      tone: "Informative",
      detail: "High"
    },
    likes: 688,
    author: "ContentKing"
  },
  {
    id: "23",
    title: "Sci-Fi Spaceship Concept Art",
    model: "Stable Diffusion XL",
    type: "Image",
    category: "Concept Art",
    image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Industrial spaceship concept art, asymmetrical design, heavy weathering, dark metal plating, in orbit above a gas giant, dramatic lighting, high detail, rule of thirds composition, wide shot.",
    negative_prompt: "multiple ships, colorful, cartoon, blurry, low texture, text",
    parameters: {
      cfg: "9",
      sampler: "Euler A"
    },
    likes: 950,
    author: "SpaceDraft"
  },
  {
    id: "24",
    title: "Meeting Agenda Generator",
    model: "Claude 3.5 Sonnet",
    type: "Text",
    category: "Productivity",
    image_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    prompt_text: "Create a 60-minute meeting agenda for a project kickoff meeting. Participants include Engineering, Design, and Product Management. Include time slots for introductions, project scope, success metrics, and next steps, with estimated time for each segment.",
    negative_prompt: null,
    parameters: {
      duration: "60 min",
      attendees: "Mixed"
    },
    likes: 450,
    author: "AgendaPro"
  },
  {
    id: "25",
    title: "Watercolor Botanical Illustration",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Illustration",
    image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    prompt_text: "A delicate watercolor illustration of a single lavender sprig, loose brushstrokes, soft green and purple tones, white background, vintage botanical illustration style, highly detailed.",
    negative_prompt: "oil painting, photorealistic, digital art, text, messy, dark",
    parameters: {
      ar: "2:3",
      style: "art"
    },
    likes: 1020,
    author: "NatureDraws"
  }
];