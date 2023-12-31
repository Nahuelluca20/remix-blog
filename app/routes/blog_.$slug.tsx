import { json } from "@remix-run/node";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBlogPost } from "../utils/blog.server";
import { useMdxComponent } from "../utils/mdx";
import { compileMdxCached } from "../utils/compile-mdx.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Blog | Sider Dev" },
    {
      name: "description",
      content: "Sider Dev! Nahuel! Nahuel Luca! Website! Blogs!",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    throw new Error("params.slug is not defined");
  }

  const slug = params.slug;

  const { source, files } = await getBlogPost(slug);
  const bundledBlog = await compileMdxCached({
    slug,
    source,
    files,
  });

  if (!bundledBlog) {
    throw new Response(null, { status: 404 });
  }

  return json(
    { bundledBlog },
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

export default function BlogPost() {
  const { bundledBlog } = useLoaderData<typeof loader>();
  const Component = useMdxComponent(bundledBlog.code);

  return (
    <section className="container flex justify-center py-3">
      <article className="prose prose-sm dark:prose-invert sm:prose-base lg:prose-lg">
        <p>{bundledBlog.readingTime.text}</p>
        <Component />
      </article>
    </section>
  );
}
