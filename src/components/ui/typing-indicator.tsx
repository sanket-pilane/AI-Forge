"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
    return (
        <div className="flex items-center space-x-1 p-4 bg-muted/50 rounded-2xl w-fit">
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            />
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
        </div>
    );
}
