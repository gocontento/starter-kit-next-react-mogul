import Link from "next/link";
import { ContentData } from "@gocontento/client";

export default function CategoryPill({ category }: { category: ContentData }) {
  return (
    category && (
      <Link
        href={`/blog/category/${category.slug}`}
        className="w-max rounded-3xl bg-black px-4 py-2 flex items-center hover:opacity-80"
      >
        <span className="text-xs font-semibold uppercase text-white">
          {category.name}
        </span>
      </Link>
    )
  );
}
