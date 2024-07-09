import { ForYouHouse } from "@/components/for-you-house";
import { HomeSection } from "@/components/home-section";
import { ImagesSliderDemo } from "@/components/image-slider";

export default function Home() {
  return (
    <main className="flex flex-col">
      <ImagesSliderDemo />
      <div className="h-[82rem] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex flex-col gap-8 pt-8 px-2">
          <ForYouHouse />
          <HomeSection />
      </div>
    </main>
  );
}
