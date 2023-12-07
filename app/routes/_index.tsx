import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import ListItem from "~/components/list-item";
import { getBlogPostsMeta } from "~/utils/blog.server";
import type { HeadersFunction } from "@remix-run/node";

export const loader = async () => {
  const blogPosts = await getBlogPostsMeta();

  return json(
    { blogPosts },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        Vary: "Cookie",
      },
    }
  );
};

export const headers: HeadersFunction = () => ({
  "Cache-Control": "private, max-age=3600",
  Vary: "Cookie",
});

export default function Index() {
  const posts = useLoaderData<typeof loader>();

  const sortedPosts = posts?.blogPosts?.sort((a, b) => {
    if (!a.date || !b.date) {
    }

    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
    }

    return dateB.getTime() - dateA.getTime();
  });

  return (
    <main className="w-full">
      <div className="border-b-2 pb-2 flex items-center justify-between text-sm text-muted-foreground font-semibold">
        <div className="flex items-center gap-4">
          <span className="w-[48px]">date</span>
          <span>title</span>
        </div>
        <span>tags</span>
      </div>
      <div className="w-full">
        {sortedPosts?.map((post) => (
          <ListItem
            key={post.slug}
            date={post?.date}
            slug={post.slug}
            tags={post?.tags}
            title={post.title}
          />
        ))}
      </div>
    </main>
  );
}
