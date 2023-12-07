import { config } from "@netlify/remix-adapter";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === "production" ? config : undefined),
  tailwind: true,
  postcss: true,
  // serverDependenciesToBundle: [/^mdx-bundler/],
  // mdx: async (filename) => {
  //   const [rehypeHighlight, rehypeExternalLinks] = await Promise.all([
  //     import("rehype-highlight").then((mod) => mod.default),
  //     import("rehype-external-links").then((mod) => mod.default),
  //   ]);

  //   return {
  //     rehypePlugins: [
  //       rehypeHighlight,
  //       (params) =>
  //         rehypeExternalLinks({
  //           ...params,
  //           rel: ["noopener", "noreferrer"],
  //           target: "_blank",
  //         }),
  //     ],
  //     remarkPlugins: [],
  //   };
  // },
};
