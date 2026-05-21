import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main style={{ padding: "20px" }}>
      <h1>Latest News</h1>

      {posts.map((post: any) => (
        <article key={post.id} style={{ marginBottom: "24px" }}>
          <h2>
            <Link href={`/post/${post.slug}`}>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Link>
          </h2>
        </article>
      ))}
    </main>
  );
}