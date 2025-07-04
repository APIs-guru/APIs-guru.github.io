import React from "react";
import DefaultLayout from "./DefaultLayout";
import DisqusThread from "../DisqusThread";
import BlogBanner from "../BlogBanner";

interface PostLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  author?: string;
  slug?: string;
  tags?: string[];
}

export default function PostLayout({
  children,
  title,
  description,
  image,
  date,
  author = "APIs.guru Team",
  slug,
  tags,
}: PostLayoutProps) {
  return (
    <DefaultLayout title={title} description={description} image={image}>
      <article className="prose lg:prose-xl mx-auto py-8">
        <BlogBanner />
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {date && (
            <time dateTime={date} className="text-gray-600">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {author && <p className="text-gray-600">By {author}</p>}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-content">{children}</div>

        {slug && (
          <footer className="mt-12">
            <DisqusThread
              url={`https://apis.guru/blog/${slug}`}
              identifier={slug}
            />
          </footer>
        )}
      </article>
    </DefaultLayout>
  );
}
