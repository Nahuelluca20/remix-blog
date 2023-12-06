import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPostsSortedByDate } from "~/content/posts.server";
import { Card } from "~/components/Card";

export function headers() {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

export const loader = async () => {
  const posts = getPostsSortedByDate();

  return json({
    posts: posts,
  });
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main className="w-full">
      <div className="mt-10 border-b-2 pb-2 flex items-center justify-between text-sm text-gray-500 font-semibold">
        <div className="flex items-center gap-4">
          <span>date</span>
          <span>title</span>
        </div>
        <span>tags</span>
      </div>
      <div className="w-full">
        {posts?.posts?.map((post) => (
          <Card {...post} key={post.slug} />
        ))}
      </div>
    </main>
  );
}
