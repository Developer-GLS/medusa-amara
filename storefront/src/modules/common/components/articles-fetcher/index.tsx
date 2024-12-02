import React from "react";
import qs from "qs";
import ArticleCard from "../article-card";


type ArticleCategory = "news" | "activities" | "blog" | "*";

type TransformedDataItem = {
  Title: string;
  Slug: string;
  Category: string;
  Summary: string | null;
  ThumbnailUrl?: string;
  Content?: any[];
  Id?: string;
};

type TransformedJson = {
  data: TransformedDataItem[];
};

function transformData(json: any): TransformedJson {
  return {
    data: json.data.map((item: any) => {
      const attributes = item.attributes;
      const ThumbnailUrl = attributes.Thumbnail?.data?.attributes?.formats?.small?.url;

      const Content = attributes.Content?.map((contentItem: any) => {
        const Component = contentItem["__component"].split(".")[1];
        return { ...contentItem, Component };
      });

      return {
        Title: attributes.Title,
        Slug: attributes.Slug,
        Category: attributes.Category,
        Summary: attributes.Summary,
        ThumbnailUrl,
        Content,
        Id: item.id,
      };
    }),
  };
}

async function getArticles(category: ArticleCategory = "*",  limit?: number) {
  const baseUrl = process.env.AMARA_STRAPI_URL ?? "http://localhost:1337";
  const path = "/api/articles";

  const url = new URL(path, baseUrl);
  const query: Record<string, any> = {
    populate: {
      Thumbnail: { fields: ["formats"] },
      Content: { fields: "*" },
    },
    pagination: {},
  };

  if (category !== "*") {
    query.filters = { Category: category };
  }

  if (limit) {
    query.pagination.limit = limit;
  }

  url.search = qs.stringify(query);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await res.json();
  return transformData(data);
}

async function getArticleById(
  articleId: string,
  category: ArticleCategory = "*"
) {
  const baseUrl = process.env.AMARA_STRAPI_URL ?? "http://localhost:1337";
  const path = `/api/articles/${articleId}`;
  const url = new URL(path, baseUrl);

  const query: Record<string, any> = {};

  if (category !== "*") {
    query.filters = { Category: category };
  }

  url.search = qs.stringify(query);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch article with ID: ${articleId}`);
  }

  const data = await res.json();
  return transformData(data);
}

interface ArticleFetcherProps {
  articleCategory?: ArticleCategory;
  limit?: number;
  articleId?: string;
}

export default async function ArticleFetcher({
  articleCategory = "*",
  limit
}: ArticleFetcherProps) {
  let articles;


    articles = await getArticles(articleCategory, limit);
  


    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mb-48 mx-12 pb-12">
        {articles.data.map((article) => (
          <ArticleCard
            key={article.Slug}
            title={article.Title}
            caption={article.Summary ?? ''}
            thumbnailUrl={article.ThumbnailUrl}
            slug={article.Slug}
            type={article.Category}
            id={article.Id ?? ''}
          />
        ))}
      </div>
    );

}