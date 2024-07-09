"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slide";
import SearchInput from "./search-input";

export function ImagesSliderDemo() {
    const images = [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1661659990515-9a47eff5d9a4?q=80&w=2731&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1668383196824-e6d010e02711?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];
    return (
        <ImagesSlider className="h-[19rem] md:h-[26rem]" images={images}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: -80,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className="z-50 flex flex-col justify-center items-center"
            >
                <motion.p className="font-bold text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4 mb-8">
                    La tua prossima casa <br /> A portata di click.
                </motion.p>
                <SearchInput />
            </motion.div>
        </ImagesSlider>
    );
}
