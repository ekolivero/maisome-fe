import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import Posts from "./components/posts";
import Menu from "./components/menu";

export default async function Home() {
    const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery });

    return (
        <main className="max-w-7xl min-h-screen mx-auto px-4">
            <Menu />
            <Posts posts={posts} />
        </main>
    );
}