import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { getBlogPostBySlug, getPublishedBlogPosts, getAllBlogSlugs } from "@/lib/data";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | A to Z Academic Help`,
    description: post.excerpt,
  };
}

// Custom components to pass to MDX / Markdown
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold text-navy mt-12 mb-6" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-bold text-navy mt-8 mb-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-600 leading-relaxed mb-6 text-lg" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 text-lg" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-navy" {...props} />
  ),
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="bg-gray-50 pt-16 pb-12 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumbs />

            <div className="flex items-center space-x-4 mt-8 mb-6">
              <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.date}</span>
              <span className="text-gray-500 text-sm hidden md:inline">•</span>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight">{post.title}</h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="container mx-auto px-4 max-w-6xl mt-12">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            {/* Sidebar (TOC) */}
            <div className="hidden lg:block lg:w-1/4">
              <TableOfContents />
            </div>

            {/* Article Content */}
            <div className="w-full lg:w-3/4 max-w-3xl">
              <Link
                href="/resources"
                className="inline-flex items-center text-sm font-medium text-navy hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all resources
              </Link>

              {/* Cover Image if available */}
              {post.cover_image_url && (
                <div className="w-full h-80 relative rounded-2xl overflow-hidden mb-10 shadow-md">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <article className="prose prose-lg max-w-none">
                <MDXRemote source={post.content} components={mdxComponents} />
              </article>

              <ShareButtons title={post.title} />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-12 border-t border-gray-100">
                  <h3 className="text-2xl font-bold text-navy mb-8">Related Articles</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/resources/${related.slug}`}
                        className="p-6 bg-gray-50 rounded-xl hover:bg-navy hover:text-white transition-colors group"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider mb-2 block text-gold">
                          {related.category}
                        </span>
                        <h4 className="font-bold text-lg mb-2 group-hover:text-white text-navy">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
