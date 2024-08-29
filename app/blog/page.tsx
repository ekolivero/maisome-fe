import { sanityFetch } from "@/sanity/lib/fetch";
import { categorizedPostsQuery } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import Posts from "./components/posts";
import { SiteHeader } from "./components/menu";
interface Category {
  name: string;
  posts: SanityDocument[];
}

export default async function Home() {
    const { categories } = await sanityFetch<{ categories: Category[] }>({ query: categorizedPostsQuery });
    return (
        <main className="min-h-screen mx-auto px-4">
            <SiteHeader />
            {categories.map((category) => (
                <section key={category.name}>
                    <h2>{category.name}</h2>
                    <Posts posts={category.posts} />
                </section>
            ))}
        </main>
    );
}