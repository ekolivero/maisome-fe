"use client";
import React from "react";
import SearchInput from "./search-input";
import Image from "next/image";

export function ImagesSliderDemo() {
    return (
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
            <Image
                alt="Background image of a room with people and plants"
                src="https://plus.unsplash.com/premium_photo-1687960116741-d3a1468fdec1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                fill
                style={{objectFit: 'cover'}}
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
                {/* Add logo */}
                <div className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2">
                    <Image
                        src="/no_bg.png"
                        alt="Logo"
                        width={150}
                        height={50}
                        priority
                    />
                </div>
                <h1 className="mb-4 text-3xl text-white sm:text-4xl md:text-5xl max-w-screen-sm font-[900] tracking-tight">
                Trova oggi la tua casa dei sogni
                </h1>
                <div className="w-full max-w-md mt-8">
                <SearchInput />
                </div>
            </div>
        </div>
    );
}
