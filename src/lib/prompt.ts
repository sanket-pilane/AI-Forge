export const prompts = [
  {
    id: "1",
    title: "Neon Noir Cyberpunk Detective",
    model: "Midjourney v6.0",
    type: "Image",
    category: "Photography",
    image_url: "https://images.unsplash.com/photo-1625121404113-1f3c70f8038f?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1611944212129-2999025e1259?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1555579774-4b5c77742186?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1629814696090-67df48079c09?q=80&w=600&auto=format&fit=crop",
    prompt_text: "A rolling green meadow with fluffy white clouds in a bright blue sky, a small cottage in the distance, wind blowing through tall grass, Studio Ghibli art style, hand-painted texture, vibrant greens and blues, summer vibes.",
    negative_prompt: "3d, photorealistic, dark, ominous, low resolution",
    parameters: {
      ar: "16:9",
      niji: "true"
    },
    likes: 899,
    author: "AnimeFan01"
  }
];