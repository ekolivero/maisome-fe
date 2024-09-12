import { ImagesSliderDemo } from "@/components/image-slider";
import SeoRegionAndProvince from "@/components/seo-region-and-province";
import { FooterComponent } from "@/components/footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <ImagesSliderDemo />
      <div className="h-max w-full relative flex flex-col gap-8 pt-8 px-2">
          <SeoRegionAndProvince />
      </div>
      <FooterComponent />
    </main>
  );
}
