import { bundleMDX } from "mdx-bundler";
import remarkMdxImages from "remark-mdx-images";

export async function parseMdx(mdx: string) {
  // const { default: rehypeAutolinkHeadings } = await import(
  //   "rehype-autolink-headings"
  // );

  // const { default: rehypeSlug } = await import("rehype-slug");
  // const {default: rehypePrism} = await import('rehype-prism-plus');
  // const {default: rehypeCodeTitles} = await import('rehype-code-titles');
  // const {default: remarkGfm} = await import('remark-gfm');
  // const {default: remarkToc} = await import('remark-toc');
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { frontmatter, code } = await bundleMDX({
    source: mdx,

    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        // remarkGfm,
        // remarkToc,
      ];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        // rehypeCodeTitles,
        // rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ];
      return options;
    },
  });

  return {
    frontmatter,
    code,
    body: code,
  };
}
