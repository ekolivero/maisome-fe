"use server"

import { generateObject } from 'ai';
import {  openai } from "@ai-sdk/openai";
import dedent from "dedent"
import { redirect } from 'next/navigation';
import z from "zod";
import client from '@/app/utils/client';

interface Params {
  price_min: number | null;
  price_max: number | null;
  surface_min: number | null;
  surface_max: number | null;
  rooms: string[] | null;
  bathrooms: string[] | null;
  furniture: string | null;
  category: string | null;
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


export async function generateSmartFilters(prompt: string, locationId: string) {

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      prompt: dedent`
        Sei un agente immobiliare esperto. Con conoscenza su tutto il territorio italiano. 
        Il cliente ti ha chiesto di aiutarlo a trovare la casa che necessita, sulla base delle informazioni che ti ha fornito
        cerca di capire che filtri applicare alla pagina di ricerca.
  
        Queste sono le informazioni sulle case che hai a disposizione:
        <info>${prompt}</info>

        Sulla base di queste informazioni il tuo obiettivo è creare un filtro che ti permetta di trovare la casa che il cliente necessita.
        
        Rispondi solamente se sei sicuro di ciò che dici, altrimenti rispondi no.
      `,
      schema: z.object({
        filters: z.array(
          z.object({
            price_min: z.number().nullable(),
            price_max: z.number().nullable(),
            surface_min: z.number().nullable(),
            surface_max: z.number().nullable(),
            rooms: z
              .array(z.string())
              .nullable()
              .describe("When more than 5 rooms return 5+"),
            bathrooms: z.array(z.string()).nullable(),
            category: z
              .enum([
                "Rustico",
                "Mansarda",
                "Appartamento",
                "Villa unifamiliare",
                "Villa bifamiliare",
              ])
              .nullable(),
            // condition: z.enum([
            //   "Nuovo / In costruzione",
            //   "Ottimo / Ristrutturato",
            //   "Buono / Abitabile",
            //   "Da ristrutturare",
            // ]).nullable(),
            furniture: z.enum(["Arredato", "Parzialmente arredato", "Non arredato"]).nullable(),
          })
        ),
      }),
      temperature: 0,
    });


    const urlParams = createUrlParams(object.filters)
    redirect(`?${urlParams}`);
}
