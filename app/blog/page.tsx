import { sanityFetch } from "@/sanity/lib/fetch";
import { categorizedPostsQuery } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import Posts from "./components/posts";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  posts: SanityDocument[];
}

export default async function Home() {
    const { categories } = await sanityFetch<{ categories: Category[] }>({ query: categorizedPostsQuery });
    return (
        <main className="min-h-screen mx-auto max-w-4xl px-4 py-8">
            {categories.map((category) => (
                <section key={category.name} className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{category.name}</h2>
                        <Link href={`/blog/${category.slug}`} className="text-blue-500 hover:text-blue-600 hover:underline flex items-center font-bold transition-colors duration-200">
                            Vedi tutti
                        </Link>
                    </div>
                    <Posts posts={category.posts} category={category.slug} />
                </section>
            ))}
        </main>
    );
}