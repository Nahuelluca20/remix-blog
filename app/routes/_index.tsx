import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// import { getPostsSortedByDate } from "~/utils/posts.server";
import ListItem from "~/components/list-item";
import { getBlogPostsMeta } from "~/utils/blog.server";
import type { HeadersFunction, MetaFunction } from "@remix-run/node";

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
  return (
    <main className="w-full">
      <div className="border-b-2 pb-2 flex items-center justify-between text-sm text-muted-foreground font-semibold">
        <div className="flex items-center gap-4">
          <span>date</span>
          <span>title</span>
        </div>
        <span>tags</span>
      </div>
      <div className="w-full">
        {posts?.blogPosts?.map((post) => (
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
