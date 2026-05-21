import "../../home.css";
import CategoryPostsClient from "./CategoryPostsClient";

const categoryMap: Record<string, { wpSlug: string; label: string }> = {
  hiburan: {
    wpSlug: "hiburan",
    label: "Hiburan",
  },
  teknologi: {
    wpSlug: "teknologi",
    label: "Teknologi",
  },
  bisnes: {
    wpSlug: "bisnes",
    label: "Bisnes",
  },
  "gaya-hidup": {
    wpSlug: "gaya-hidup",
    label: "Gaya Hidup",
  },
};


async function getCategory(slug: string) {
  const mappedCategory = categoryMap[slug];

  if (!mappedCategory) return null;

  const res = await fetch(
    `https://cms.malaysianupdates.com/wp-json/wp/v2/categories?slug=${mappedCategory.wpSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch category");

  const categories = await res.json();

  if (!categories[0]) return null;

  return {
    ...categories[0],
    displayName: mappedCategory.label,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return (
      <main className="home-page">
        <h1>Category not found</h1>
      </main>
    );
  }

  return (
    <main className="home-page">
      <section className="category-header">
        <h1>
          {category.displayName}
          <span className="story-count">
            [ {category.count} cerita dijumpai ]
          </span>
        </h1>
      </section>

      <CategoryPostsClient categoryId={category.id} />
    </main>
  );
}