import type {
  LoaderFunctionArgs,
  MetaFunction,
  HeadersFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import { getMDXComponent } from "mdx-bundler/client";
// import * as mdxBundler from "mdx-bundler/client/index.js";
import { useMdxComponent } from "../utils/mdx";
// import invariant from "tiny-invariant";
// import { getContent } from "~/utils/blog.server";
// import { CacheControl } from "~/utils/cache-control.server";
import * as React from "react";
// import { getSeoMeta, getSeoLinks } from "~/seo";
// import { Fence, Callout } from "~/components/Markdown";
// import type { MdxComponent } from "~/types";
import { parseMdx } from "~/utils/mdx-bundler.server";
import { getBlogPosts } from "~/utils/posts.server";
// import {
//   FootnotesProvider,
//   FootnoteRef,
//   Footnotes,
// } from "react-a11y-footnotes";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let path = params["*"];

  // invariant(path, "BlogPost: path is required");

  if (!path) return redirect("/blog");
  if (!path) {
    throw new Error("path is not defined");
  }

  // const files = await getContent(`posts/${path}`);

  const files = getBlogPosts().find((post) => post.slug === path);
  let post = files && (await parseMdx(files.content));
  let title = files?.metadata.title;
  if (!post) {
    throw json(
      {},
      {
        status: 404,
        headers: {},
      }
    );
  }

  return json(
    { post, title },
    {
      headers: {
        "Cache-Control": "public,  max-age=120",
      },
    }
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control")!,
  };
};

// export const meta: MetaFunction = ({ data }) => {
//   if (!data) return {};
//   let { post } = data as SerializeFrom<typeof loader>;

//   let seoMeta = getSeoMeta({
//     title: post.frontmatter.meta.title,
//     description: post.frontmatter.meta.description,
//   });
//   return {
//     ...seoMeta,
//   };
// };

// export const links = () => {
//   let seoLinks = getSeoLinks();
//   return [...seoLinks];
// };

export default function BlogPost() {
  const { post, title } = useLoaderData<typeof loader>();
  const { code } = post;
  const Component = useMdxComponent(code);
  return (
    <article className="scroll-pt-100 prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:text-white dark:prose-strong:text-pink-500 lg:prose-lg">
      {/* <FootnotesProvider> */}
      <h1>{title} </h1>
      <Component />
      {/* </FootnotesProvider> */}
    </article>
  );
}
