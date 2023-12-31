import { bundleMDX as bundleMdx } from "mdx-bundler";
import remarkMdxImages from "remark-mdx-images";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { dirname, resolve } from "./fs.server";
import calculateReadingTime from "reading-time";
import { singleton } from "./singleton.server";
import PQueue from "p-queue";
import { cachified } from "@epic-web/cachified";
import { lruCache } from "./cache.server";
import { fileURLToPath } from "url";
import rehypeHighlight from "rehype-highlight";
import rehypePrettyCode from "rehype-pretty-code";

const filename = fileURLToPath(import.meta.url);
const dirnameConst = dirname(filename);

const root = resolve(dirnameConst, "../");
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
        rehypePrettyCode,
        [rehypeHighlight],
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

  const readingTime = calculateReadingTime(source);

  return {
    code,
    frontmatter,
    readingTime,
  };
};

const queue = singleton(
  "compile-mdx-queue",
  () =>
    new PQueue({
      concurrency: 1,
      throwOnTimeout: true,
      timeout: 1000 * 30,
    })
);

export const compileMdxQueued = async (
  ...args: Parameters<typeof compileMdx>
) => await queue.add(() => compileMdx(...args), { throwOnTimeout: true });

export const compileMdxCached = ({
  slug,
  source,
  files,
}: { slug: string } & BundleMdx) => {
  const key = `${slug}:compiled`;
  const compileMdx = cachified({
    key,
    cache: lruCache,
    getFreshValue: () => compileMdxQueued({ source, files }),
  });

  return compileMdx;
};
