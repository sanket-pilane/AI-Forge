"use client";

import Typewriter from "typewriter-effect";

export function TypewriterEffect() {
    return (
        <Typewriter
            options={{
                strings: [
                    "Generate chat.",
                    "Generate code.",
                    "Generate images.",
                    "Generate Videos.",
                    "Your personal workshop for creation.",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 50,
            }}
        />
    );
}