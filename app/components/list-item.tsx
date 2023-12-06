import { Link } from "@remix-run/react";
import { Badge } from "./ui/badge";

export default function ListItem({
  slug,
  title,
  date,
  tags,
}: {
  slug: string;
  title: string;
  date: string;
  tags: string;
}) {
  const getArray = JSON.parse(tags);

  return (
    <Link
      prefetch="intent"
      className="flex mt-4 w-full justify-between items-center border-b-2 pb-3"
      to={`/blog/${slug}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
        <span className="text-base font-semibold ">{title}</span>
      </div>
      <div className="flex flex-wrap justify-end items-center gap-2">
        {getArray?.map((tag: string) => (
          <Badge key={`tag-${tag}`} className="text-sm font-semibold">
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
