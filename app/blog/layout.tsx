import { BlogHeader } from "./components/menu";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BlogHeader />
            {children}
        </>
    );
}