import { Link } from "@remix-run/react";
import type { Frontmatter } from "~/content/posts.server";

type Props = Pick<Frontmatter, "title" | "slug" | "formattedDate" | "tags">;

export const Card = ({ title, slug, formattedDate, tags }: Props) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className="flex mt-4 w-full justify-between items-center border-b-2 pb-2"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
        <span className="text-base font-semibold ">{title}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag: string) => (
          <span className="text-sm text-muted-foreground">{tag}</span>
        ))}
      </div>
    </Link>
  );
};
