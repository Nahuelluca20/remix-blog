import Header from "~/components/header";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import * as postA from "../content/firt-blogpost.mdx";
import { getPostsSortedByDate } from "~/content/posts.server";
import { Card } from "~/components/Card";

export function headers() {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

function postFromModule(mod: any) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ""),
    title: mod.attributes.meta.find((meta: any) => meta.title)?.title || "",
    description:
      mod.attributes.meta.find((meta: any) => meta.name === "description")
        ?.content || "",
  };
}

export const loader = async () => {
  const posts = getPostsSortedByDate().slice(0, 4);

  return json({
    posts: posts,
  });
};

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main>
      <Header />
      <ul>
        {posts.posts?.map((post: any) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            {post.description ? <p>{post.description}</p> : null}
          </li>
        ))}
      </ul>
      {posts?.posts?.map((post, index) => (
        <div key={post.slug} className="sm:w-1/2 mb-12">
          <div className={index % 2 === 0 ? "sm:mr-6" : "sm:ml-6"}>
            <Card {...post} />
            gola
          </div>
        </div>
      ))}
    </main>
  );
}
