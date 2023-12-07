import type {
  LoaderFunctionArgs,
  MetaFunction,
  HeadersFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMdxComponent } from "../utils/mdx";

import * as React from "react";

import { compileMdx } from "~/utils/compile-mdx.server";
import { getBlogPost } from "~/utils/blog.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined");
  }

  console.log(params.slug);

  const slug = params.slug;
  const { source, files } = await getBlogPost(slug);
  // let post = files && (await compileMdx(files));
  // let title = files?.metadata.title;
  const bundledBlog = compileMdx({ source, files });

  if (!bundledBlog) {
    throw json(
      {},
      {
        status: 404,
        headers: {},
      }
    );
  }

  return json(
    { bundledBlog },
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
  const { bundledBlog } = useLoaderData<typeof loader>();
  console.log(bundledBlog);
  const Component = useMdxComponent(bundledBlog?.code);
  return (
    <article>
      {/* <h1>{title} </h1> */}
      <Component />
    </article>
  );
}
