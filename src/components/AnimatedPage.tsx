"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatedPage({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen"
        >
            {children}
        </motion.main>
    );
}