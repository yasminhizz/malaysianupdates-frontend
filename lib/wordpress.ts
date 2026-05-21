const API_URL = "https://cms.malaysianupdates.com/wp-json/wp/v2";

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts?_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();
  return data[0];
}

export async function getPostsByCategory(categoryId: number) {
  const res = await fetch(`${API_URL}/posts?categories=${categoryId}&_embed`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category posts");
  }

  return res.json();
}

export async function getCategories() {
  const res = await fetch(`https://cms.malaysianupdates.com/wp-json/wp/v2/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}