import Link from "next/link";
import "../home.css";

async function searchPosts(query: string) {
  if (!query) return [];

  try {
    const res = await fetch(
      `https://cms.malaysianupdates.com/wp-json/wp/v2/posts?search=${encodeURIComponent(
        query
      )}&_embed=author,wp:featuredmedia&per_page=12`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Search API failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Search fetch failed:", error);
    return [];
  }
}

function cleanText(html: string) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

function getImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/600x400?text=MalaysianUpdates"
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  const posts = await searchPosts(query);

  return (
  <main className="search-page">

    {query && (
      <p className="search-result-text">
        Search results for: <strong>{query}</strong>
      </p>
    )}

    {!query && (
      <p className="search-result-text">
        Enter a keyword to search stories.
      </p>
    )}

    {posts.length > 0 ? (
      <section className="search-grid">
        {posts.map((post: any) => (
          <article className="search-card" key={post.id}>
            <Link href={`/post/${post.slug}`}>
              <img
                src={getImage(post)}
                alt={cleanText(post.title.rendered)}
              />
            </Link>

            <h2>
              <Link
                href={`/post/${post.slug}`}
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </h2>

            <p>{cleanText(post.excerpt.rendered).slice(0, 120)}...</p>

            <Link href={`/post/${post.slug}`} className="read-more">
              Baca Lanjut
            </Link>
          </article>
        ))}
      </section>
    ) : (
      query && (
        <p className="no-results">
          Tiada cerita dijumpai, atau carian sedang tidak tersedia buat sementara waktu.
          Cuba gunakan kata kunci lain.
        </p>
      )
    )}
  </main>
);
}