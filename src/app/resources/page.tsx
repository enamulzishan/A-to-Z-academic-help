import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPublishedBlogPosts } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Academic Resources & Guides | A to Z Academic Help",
  description: "Academic insights, research methodology guides, and writing tips from our doctoral consultants.",
};

export default async function ResourcesPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Academic Resources</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Guides, insights, and expert advice to help you navigate your academic journey.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
            >
              {/* Optional Cover Image */}
              {post.cover_image_url && (
                <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-8 flex flex-col h-full flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">{post.readTime}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-navy mb-3 group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-navy flex items-center justify-between">
                  <span>Read Article →</span>
                  <span className="text-xs text-gray-400 font-mono">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200">
            No published articles found. Check back soon for new guides!
          </div>
        )}
      </div>
    </div>
  );
}
