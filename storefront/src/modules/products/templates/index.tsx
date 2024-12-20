import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import ArticlePostFetcher from "../components/related-post-fetcher"
import CTABlock from "@modules/common/components/blocks/cta-block"

const isEcom = process.env.AMARA_ECOM_ACTIVATED;

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  if (product.subtitle) {
    try {
      const parsedSubtitle = JSON.parse(product.subtitle),
        tags = Object.values(parsedSubtitle),
        tagArr = [];

      tags.forEach(e => {
        if (typeof (e) === "string") {
          tagArr.push(e)
        } else if (Array.isArray(e)) {
          tagArr.push(...e); // Push di tutti gli elementi dell'array
        }
      });
    } catch {

    }
  }

  const getTagArr = (product: HttpTypes.StoreProduct): string[] | undefined => {
    if (product.subtitle) {
      try {
        const parsedSubtitle = JSON.parse(product.subtitle) as Record<string, unknown>;
        const tags = Object.values(parsedSubtitle);
        const tagArr: string[] = []; // Tipizza tagArr come array di stringhe

        tags.forEach(e => {
          if (typeof e === "string") {
            tagArr.push(e);
          } else if (Array.isArray(e)) {
            tagArr.push(...(e as string[])); // Assumi che l'array contenga stringhe
          }
        });

        return tagArr;
      } catch {
        console.error("Failed to parse product.subtitle");
      }
    }
    return undefined; // In caso non ci sia un sottotitolo o si verifichi un errore
  };

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 mt-8 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:py-0 small:max-w-[300px] w-full py-8 gap-y-6 order-4 md:order-2">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative order-3">
          <ImageGallery images={product?.images || []} />
        </div>

        {isEcom && (

          <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        )}
      </div>
      {!isEcom && (
        <div
          className="content-container"
        >
          <div className="product-page-description">
            <div className="flex flex-col items-center text-center mb-16">
              <p className="text-ui-fg-base text-justify text-2xl max-w-6xl">
                {product.description}
              </p>
            </div>
          </div>
          <ArticlePostFetcher articleTags={getTagArr(product)} limit={5} />
        </div>
      )}
      <div
        className="content-container my-16"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>

      <div className="content-container my-16 small:my-32" data-testid="cta-block-container">
      <CTABlock
            className="min-h-[400px] lg:mx-12 lg:my-8 bg-bottom"
            wrapperCss=""
            direction="dx"
            title="Discover how we brew"
            titleSize="h3"
            titleCss="text-4xl mb-16 lg:mg-0 text-koiOrange"
            paragraph={'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum voluptas itaque neque laboriosam consequatur consectetur distinctio quidem provident asperiores tempore architecto ea, voluptatibus in tempora nulla voluptates impedit aut, veniam repellendus eum molestiae. Quos iste, assumenda ex autem facilis tenetur dignissimos vero distinctio impedit, cupiditate eaque asperiores eveniet. Dignissimos, vero.'}
            parCss="text-justify px-4 text-ui-fg-base"
            backgroundImgUrl={""}
            haveButton={true}
            buttonLink="/brewery"
            buttonText="Discover more"
            buttonCss="block text-center mt-8 bg-koiRed text-ui-fg-base"
          />
      </div>
    </>
  )
}

export default ProductTemplate
