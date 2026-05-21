"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type CategoryPostsClientProps = {
  categoryId: number;
};

function getImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/600x400?text=TehTarikTimes"
  );
}

function getAuthor(post: any) {
  return post?._embedded?.author?.[0]?.name || "Unknown Author";
}

function getDate(post: any) {
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

export default function CategoryPostsClient({
  categoryId,
}: CategoryPostsClientProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadPosts() {
    if (loading || !hasMorePosts) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://cms.malaysianupdates.com/wp-json/wp/v2/posts?_embed=author,wp:featuredmedia&categories=${categoryId}&per_page=12&page=${page}`
      );

      if (!res.ok) {
        setHasMorePosts(false);
        return;
      }

      const newPosts = await res.json();

      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id));

          const filteredPosts = newPosts.filter(
            (post: any) => !existingIds.has(post.id)
          );

          return [...prevPosts, ...filteredPosts];
        });

        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
      setHasMorePosts(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [page, loading, hasMorePosts]);

  return (
    <>
      <section className="post-grid">
        {posts.map((post: any) => (
          <article className="post-card" key={post.id}>
            <Link href={`/post/${post.slug}`}>
              <img src={getImage(post)} alt={cleanText(post.title.rendered)} />
            </Link>

            <h2>
              <Link
                href={`/post/${post.slug}`}
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </h2>

            <PostMeta post={post} />

            <p className="excerpt">
              {cleanText(post.excerpt.rendered).slice(0, 120)}...
            </p>

            <Link href={`/post/${post.slug}`} className="read-more">
              Baca Lanjut
            </Link>
          </article>
        ))}
      </section>

      <div ref={loaderRef} style={{ textAlign: "center", padding: "30px" }}>
        {loading && <p>Kandungan sedang dimuatkan...</p>}
        {!hasMorePosts && posts.length > 0 && <p>Tiada lagi cerita.</p>}
        {!loading && posts.length === 0 && <p>Tiada cerita dijumpai.</p>}
      </div>
    </>
  );
}