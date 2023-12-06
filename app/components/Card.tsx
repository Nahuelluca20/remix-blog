import { Link } from "@remix-run/react";
import type { Frontmatter } from "~/content/posts.server";
import { Badge } from "~/components/ui/badge";

type Props = Pick<Frontmatter, "title" | "slug" | "formattedDate" | "tags">;

export const Card = ({ title, slug, formattedDate, tags }: Props) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className="flex mt-4 w-full justify-between items-center border-b-2 pb-3"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
        <span className="text-base font-semibold ">{title}</span>
      </div>
      <div className="flex flex-wrap justify-end items-center gap-2">
        {tags.map((tag: string) => (
          <Badge className="text-sm font-semibold">{tag}</Badge>
        ))}
      </div>
    </Link>
  );
};
