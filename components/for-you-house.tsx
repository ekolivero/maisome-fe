"use client";
import React from "react";
import Image from "next/image";
import { CarouselDemo } from "./carousel-houses";

export function ForYouHouse() {
    return (
        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                   Case che potrebbero interessarti
                </h2>
                <p className="text-sm text-muted-foreground">
                    Basato sui tuoi interessi
                </p>
            </div>
        </div>
        <CarouselDemo />
        </div>
    );
}
