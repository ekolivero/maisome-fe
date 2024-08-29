import type { SanityDocument } from "@sanity/client";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconCalendar } from "@tabler/icons-react";

const Posts = ({ posts = [], category }: { posts: SanityDocument[], category: string }) => {
    const convertDate = (date: string) => {
        return new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })
    }

    return (
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
            {posts.map((post, i) => (
                <BentoGridItem
                    key={post._id}
                    title={post.title}
                    header={
                        <Image
                            src={post.imageURL}
                            alt={"an house"}
                            width={400}
                            height={300}
                            className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl"
                        />
                    }
                    description={convertDate(post.publishedAt)}
                    icon={<IconCalendar className="h-4 w-4 text-neutral-500" />}
                    className={i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"}
                    href={`/blog/${encodeURI(category)}/${post.slug.current}`}
                >
                </BentoGridItem>
            ))}
        </BentoGrid>
    )
}

export default Posts