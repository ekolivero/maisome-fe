import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import dedent from "dedent";
import client from "@/app/utils/client";
import { redirect } from "next/navigation";


export async function getFilters({
  q,
}: {
  q: string;
}) {
  const { object: result } = await generateObject({
    model: openai("gpt-4-turbo"),
    prompt: dedent`
      Il tuo obiettivo è quello di creare i filtri necessari per raffinare la ricerca della casa perfetta da parte dell'utente.
      Questo è lo schema:
      L'utente ha cercato: ${q}
    `,
    schema: z.object({
        location: z.string().describe("La località della ricerca"),
        price_min: z
          .number()
          .describe("Il prezzo minimo di ricerca"),
        price_max: z
          .number()
          .describe("Il prezzo massimo di ricerca"),
      })
  });

  const { data } = await client.GET("/locations/suggest/", {
    params: {
      query: {
        query: result.location,
      },
    },
  });

  const location = data?.suggestions[0]

  redirect(`/vendita-case/${location?.page}`)

}