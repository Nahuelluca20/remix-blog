import * as postA from "../content/firt-blogpost.mdx";
import { formatDate } from "~/utils/date";

export interface Frontmatter {
  title: string;
  summary: string;
  slug: string;
  date: string;
  tags: string[];
  formattedDate: string;
  images: string[];
}

export const POSTS = [postA];

export const getPostsSortedByDate = () => {
  return POSTS.map(postFromModule).sort((a, b) => (a.date > b.date ? -1 : 1));
};

export const filterPostsByTitle = (query: string) => {
  return POSTS.map(postFromModule).filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
};

function postFromModule(mod: { attributes: Frontmatter; filename: string }) {
  return {
    ...mod.attributes,
    slug: mod.filename.replace(/\.mdx?$/, ""),
    formattedDate: formatDate(mod.attributes.date),
  };
}
