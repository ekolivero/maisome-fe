import type { SanityDocument } from "@sanity/client";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconCalendar } from "@tabler/icons-react";

const Posts = ({ posts = [] }: { posts: SanityDocument[] }) => {
    const convertDate = (date: string) => {
        return new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })
    }

    return (
        <div className="py-5 mx-auto">
            <BentoGrid className="max-w-4xl mx-auto">
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
                                className="object-cover w-full h-full"
                            />
                        }
                        description={convertDate(post.publishedAt)}
                        icon={<IconCalendar className="h-4 w-4 text-neutral-500" />}
                        className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                    >
                    </BentoGridItem>
                ))}
            </BentoGrid>
        </div>
    )
}

export default Posts