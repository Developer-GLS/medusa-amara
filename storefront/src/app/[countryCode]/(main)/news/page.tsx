import { Metadata } from "next";
import ArticlesList from "@modules/common/components/articles-fetcher";
import CTABlock from "@modules/common/components/blocks/cta-block";
export const metadata: Metadata = {
  title: "News and Insights",
  description: "Stay updated with the latest news and articles covering a wide range of topics.",
}


export default function NewsPage() {
  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="news-container"
    >
      <div className="w-full">
        <div className="mb-8 small:mx-12">
          <h1 className="mb-8 font-extrabold text-4xl text-center text-koiRed small:text-8xl small:text-start" data-testid="news-page-title">News</h1>
          <div className="text-justify mb-16">
            <p className="text-koiYellow text-xl">Delve into the heart of our brewery&apos;s evolution through a curated collection of compelling updates and stories. This is where innovation meets tradition, unveiling the creative pulse behind every initiative, collaboration, and milestone. From unveiling pioneering brews to sharing the narratives that shape our vision, this space offers an insider&apos;s perspective on our journey. Explore the dynamic interplay of culture, craftsmanship, and community that defines our identity, and immerse yourself in the stories that make our brewery a living, evolving canvas of ideas.</p>
          </div>
        </div>
        <ArticlesList articleCategory="news" />

        <div className="small:mx-12">
          <CTABlock
            className="min-h-[400px] lg:mx-12 lg:my-8 bg-bottom"
            wrapperCss=""
            direction="dx"
            title="Read more about us"
            titleSize="h3"
            titleCss="text-6xl text-ui-fg-base mb-16 lg:mg-0"
            paragraph={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit suscipit obcaecati amet quas optio minus eius laboriosam maiores in quia itaque, veritatis alias officia molestias necessitatibus odio cum atque ullam. Natus alias distinctio porro voluptatibus! Quibusdam natus earum fugiat facere exercitationem tempore reiciendis quia molestias deleniti! Similique laborum blanditiis officia."}
            parCss="text-justify text-ui-fg-base px-4"
            backgroundImgUrl={""}
            haveButton={true}
            buttonLink="/brewery"
            buttonText="Discover now"
            buttonCss="block text-center mt-8"
          />
        </div>
      </div>
    </div>
  );
}