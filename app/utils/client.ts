import createClient from "openapi-fetch";
import type { paths } from "@/app/types/schema";

const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL });

export default client;