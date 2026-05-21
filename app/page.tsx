import Link from "next/link";
import "./home.css";

async function getPosts() {
  try {
    const res = await fetch(
      "https://cms.malaysianupdates.com/wp-json/wp/v2/posts?_embed=author,wp:featuredmedia&per_page=12",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Homepage API failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Homepage fetch failed:", error);
    return [];
  }
}

function getImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/600x400?text=MalaysianUpdates"
  );
}

function getAuthor(post: any) {
  return post?._embedded?.author?.[0]?.name || "Unknown Author";
}

function getDate(post: any) {
  if (!post?.date) return "";

  return new Date(post.date).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function cleanText(html: string) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

function PostMeta({ post }: { post: any }) {
  return (
    <p className="meta">
      <span className="profile-icon">👤</span>
      <span>{getAuthor(post)}</span>
      <span>•</span>
      <span>{getDate(post)}</span>
    </p>
  );
}

export default async function Home() {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <main className="home-page">
        <section className="empty-state">
          <p>Kandungan tidak tersedia buat sementara waktu. Sila cuba lagi sebentar nanti.</p>
        </section>
      </main>
    );
  }

  const mainPost = posts[0];
  const editorsPicks = posts.slice(1, 4);
  const trending = posts.slice(4, 7);
  const gridPosts = posts.slice(1, 7);
  const missedPosts = posts.slice(0, 4);

  return (
    <main className="home-page">
      <section className="top-layout main-only-layout">
        <div className="main-news">
          <h3>Siaran Utama</h3>

          {mainPost && (
            <Link href={`/post/${mainPost.slug}`} className="hero-card">
              <img
                src={getImage(mainPost)}
                alt={cleanText(mainPost?.title?.rendered)}
              />

              <div className="hero-overlay">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: mainPost?.title?.rendered || "Untitled",
                  }}
                />
              </div>
            </Link>
          )}
        </div>
      </section>

      {gridPosts.length > 0 && (
        <section className="post-grid">
          {gridPosts.map((post: any) => (
            <article className="post-card" key={post.id}>
              <Link href={`/post/${post.slug}`}>
                <img
                  src={getImage(post)}
                  alt={cleanText(post?.title?.rendered)}
                />
              </Link>

              <h2>
                <Link
                  href={`/post/${post.slug}`}
                  dangerouslySetInnerHTML={{
                    __html: post?.title?.rendered || "Untitled",
                  }}
                />
              </h2>

              <PostMeta post={post} />

              <p className="excerpt">
                {cleanText(post?.excerpt?.rendered).slice(0, 120)}...
              </p>

              <Link href={`/post/${post.slug}`} className="read-more">
                Baca Lanjut
              </Link>
            </article>
          ))}
        </section>
      )}

      {(editorsPicks.length > 0 || trending.length > 0) && (
        <section className="bottom-layout">
          {editorsPicks.length > 0 && (
            <div className="side-box">
              <h3>Pilihan Editor</h3>

              {editorsPicks.map((post: any) => (
                <Link
                  href={`/post/${post.slug}`}
                  className="small-post"
                  key={post.id}
                >
                  <img
                    src={getImage(post)}
                    alt={cleanText(post?.title?.rendered)}
                  />
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post?.title?.rendered || "Untitled",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {trending.length > 0 && (
            <div className="side-box">
              <h3>Trending Hari Ini</h3>

              {trending.map((post: any) => (
                <Link
                  href={`/post/${post.slug}`}
                  className="small-post"
                  key={post.id}
                >
                  <img
                    src={getImage(post)}
                    alt={cleanText(post?.title?.rendered)}
                  />
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post?.title?.rendered || "Untitled",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {missedPosts.length > 0 && (
        <section className="missed-section">
          <h3>Sorotan Semasa</h3>

          <div className="missed-grid">
            {missedPosts.map((post: any) => (
              <article key={post.id}>
                <Link href={`/post/${post.slug}`}>
                  <img
                    src={getImage(post)}
                    alt={cleanText(post?.title?.rendered)}
                  />
                </Link>

                <h4>
                  <Link
                    href={`/post/${post.slug}`}
                    dangerouslySetInnerHTML={{
                      __html: post?.title?.rendered || "Untitled",
                    }}
                  />
                </h4>

                <PostMeta post={post} />
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}