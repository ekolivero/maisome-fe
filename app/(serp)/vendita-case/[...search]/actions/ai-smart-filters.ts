"use server"

import { generateObject } from 'ai';
import {  openai } from "@ai-sdk/openai";
import dedent from "dedent"
import { redirect } from 'next/navigation';
import z from "zod";

interface Params {
  price_min: number | null;
  price_max: number | null;
  surface_min: number | null;
  surface_max: number | null;
  rooms: string[] | null;
  bathrooms: string[] | null;
  furniture: boolean | null;
}

function createUrlParams(paramsArray: Params[]): string {
  const urlParams = new URLSearchParams();

  paramsArray.forEach((params: Params) => {
    Object.entries(params).forEach(([key, value]: [string, any]) => {
      if (value !== null) {
        if (value instanceof Array) {
            value.forEach((val) => {
                urlParams.append(key, val);
            });
            return;
        }
        // Encode the value to handle special characters
        const encodedValue = encodeURIComponent(value.toString());
        urlParams.append(key, encodedValue);
      }
    });
  });

  return urlParams.toString();
}


export async function generateSmartFilters(prompt: string) {

    const { object,  } = await generateObject({
      model: openai("gpt-4o"),
      prompt: dedent`
        You are tasked to generate filters for the given prompt "${prompt}".
      `,
      schema: z.object({
        filters: z.array(
          z.object({
            price_min: z.number().nullable(),
            price_max: z.number().nullable(),
            surface_min: z.number().nullable(),
            surface_max: z.number().nullable(),
            rooms: z.array(z.string()).nullable().describe("When more than 5 rooms return 5+"),
            bathrooms: z.array(z.string()).nullable(),
            furniture: z.boolean().nullable(),
          })
        ),
      }),
      temperature: 0,
    });


    const urlParams = createUrlParams(object.filters)
    redirect(`?${urlParams}`);
}
