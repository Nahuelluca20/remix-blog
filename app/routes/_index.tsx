import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// import { getPostsSortedByDate } from "~/utils/posts.server";
import ListItem from "~/components/list-item";
import { getBlogPosts } from "~/utils/posts.server";

export function headers() {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

export const loader = async () => {
  const posts = getBlogPosts();

  return json({
    posts: posts,
  });
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  console.log(posts);
  return (
    <main className="w-full">
      <div className="mt-10 border-b-2 pb-2 flex items-center justify-between text-sm text-muted-foreground font-semibold">
        <div className="flex items-center gap-4">
          <span>date</span>
          <span>title</span>
        </div>
        <span>tags</span>
      </div>
      <div className="w-full">
        {posts?.posts?.map((post) => (
          <ListItem
            key={post.slug}
            date={post.metadata?.date}
            slug={post.slug}
            tags={post.metadata?.tags || ""}
            title={post.metadata.title}
          />
        ))}
      </div>
    </main>
  );
}
