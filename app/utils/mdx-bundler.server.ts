import { bundleMDX } from "mdx-bundler";

export async function parseMdx(mdx: string) {
  const { frontmatter, code } = await bundleMDX({
    source: mdx,
    /*remark-rehype — Markdown to HTML
rehype-remark — HTML to Markdown*/
    //     remark — Markdown
    // rehype — HTML
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? [])];
      options.rehypePlugins = [...(options.rehypePlugins ?? [])];

      return options;
    },
  });

  return {
    frontmatter,
    code,
    body: code,
  };
}
