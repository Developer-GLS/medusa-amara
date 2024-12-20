import qs from "qs";
import componentMapping from "@modules/common/components/article/componentMapping";
import BackLink from "@modules/common/components/back-link";
import { Metadata } from 'next';

//Parte che serve a mappare i nomi delle immagini nei componenti
const componentImageMap = {
    hero: 'HeroBgImg',
    paragraph: 'ParagraphImg',
    cta: 'CtaBgImg'
};

type ComponentType = keyof typeof componentImageMap;

function isComponentType(value: any): value is ComponentType {
    return value in componentImageMap;
}

type TransformedDataItem = {
    Id: string
    Title: string;
    Slug: string;
    Category: string;
    Summary: string | null;
    ThumbnailUrl?: string;
    Content?: any[];
};

function transformData(json: any): TransformedDataItem {
    const item = json.data;
    
    const attributes = item.attributes;
    const Content = attributes.Content?.map((contentItem: any) => {
        const contentComponentItem = { ...contentItem };
        const ComponentRaw = contentItem["__component"].split(".")[1];
        let Component: ComponentType | string = ComponentRaw;

        if (isComponentType(ComponentRaw)) {
            const imageName = componentImageMap[ComponentRaw],
                componentImg = contentItem[imageName]?.data?.attributes?.formats?.medium?.url;

            contentComponentItem[imageName] = typeof (componentImg) === 'string' ? componentImg : ""
        }
        return { ...contentComponentItem, Component };
    });


    return {
        Title: attributes.Title,
        Slug: attributes.Slug,
        Category: attributes.Category,
        Summary: attributes.Summary,
        Content,
        Id: item.id,
    };
}

async function getArticleById(articleId: string) {
    const baseUrl = process.env.AMARA_STRAPI_URL ?? "http://localhost:1337";
    const path = `/api/articles/${articleId}`;
    const url = new URL(path, baseUrl);
    const query: Record<string, any> = {};

    query.populate = {
        Content:
        {
            populate: {
                HeroBgImg: {
                    fields: ["url", "formats"],
                },
                ParagraphImg: {
                    fields: ["url", "formats"],
                },
                CtaBgImg: {
                    fields: ["url", "formats"],
                },
            }

        }
    };

    url.search = qs.stringify(query);
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to fetch article with ID: ${articleId}`);
    }

    const data = await res.json();
    return transformData(data);
}

interface BlogPageProps {
    searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
    const id = searchParams.id ?? '';
    let article: TransformedDataItem | null = null;

    try {
        if (id) {
            article = await getArticleById(id);
        }
    } catch (error) {
        console.error("Error fetching article for metadata:", error);
    }

    return {
        title: article ? "Blog and Stories - " + article.Title : 'Blog and Stories',
        description: article?.Summary || 'Dive into our blog to uncover stories from our brewery in Siem Reap, Cambodia. Explore craft beer culture, sustainable brewing practices, and reflections on community and local traditions.',
    };
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
    const id = searchParams.id ?? "";
    let article: any = null;

    try {
        if (id) {
            article = await getArticleById(id);
        }
    } catch (error) {
        console.error("Error fetching article:", error);
    }

    return (
        <div
            className="flex flex-col small:flex-row small:items-start py-6 content-container"
            data-testid="news-container"
        >
            <div className="w-full">
                <div className="mb-16 small:mx-12">
                    <div className="mb-8">
                        <BackLink href={`/${article.Category}`} label={`Back to ${article.Category}`} className="text-ui-fg-base hover:text-koiOrange transition duration-500" />
                    </div>

                    {article ? (
                        <section>
                            {article.Content &&
                                article.Content.map((contentItem: any, index: number) => {
                                    const Component = componentMapping[contentItem.Component];
                                    if (!Component) {
                                        return (
                                            <pre key={index}>
                                                {JSON.stringify(contentItem, null, 2)}
                                            </pre>
                                        );
                                    }
                                    return (
                            
                                            <Component key={index} {...contentItem} />
                                       
                                    );
                                })}
                        </section>
                    ) : (
                        <p>No article found or missing ID.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
