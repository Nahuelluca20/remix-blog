import { bundleMDX as bundleMdx } from "mdx-bundler";
import remarkMdxImages from "remark-mdx-images";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { dirname, resolve } from "./fs.server";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname, "../");
const publicDir = resolve(root, "./public");

export interface BundleMdx {
  source: string;
  files: Record<string, string | Buffer>;
}

export const compileMdx = async ({ source, files }: BundleMdx) => {
  const { code, frontmatter } = await bundleMdx({
    source,
    // ! some files are Buffers, it works but the type disallow it. ignore for now.
    // @ts-ignore
    files,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkMdxImages,
      ];

      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ];

      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".webp": "file",
        ".png": "file",
        ".jpg": "file",
        ".jpeg": "file",
        ".gif": "file",
      };
      options.outdir = resolve(publicDir, "./generated/assets");
      options.publicPath = "/generated/assets";
      options.write = true;

      return options;
    },
  });

  return {
    code,
    frontmatter,
  };
};

// export const compileMdxCached = ({
//   slug,
//   source,
//   files,
// }: { slug: string } & BundleMdx) => {
//   const key = `${slug}:compiled`;
//   const compileMdx = cachified({
//     key,
//     cache: lruCache,
//     getFreshValue: () => compileMdxQueued({ source, files }),
//   });

//   return compileMdx;
// };