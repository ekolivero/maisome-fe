"use client"

import { SanityDocument } from "@sanity/client";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

const builder = imageUrlBuilder(client);

const Post = ({ post }: { post: SanityDocument }) => {
    return (
        <main className="container mx-auto prose prose-md px-4 py-16">
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            {post?.mainImage ? (
                <Image
                    src={builder.image(post.mainImage).url()}
                    alt={post?.mainImage?.alt}
                    width={1920}
                    height={1080}
                    className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    unoptimized
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
            ) : null}
            {post?.body ? <PortableText value={post.body} /> : null}
        </main>
    )
}

export default Post