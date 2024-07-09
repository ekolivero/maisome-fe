import React from "react";
import { CardDemo } from "./description-card";

export function HomeSection() {
    return (
        <div className="flex flex-col">
            <p className="text-4xl sm:text-5xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-500 py-8 px-8">
                Un unico posto, tante case
            </p>
            <CardDemo />
        </div>
    );
}