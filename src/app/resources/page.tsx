import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Resources & Blog",
  description: "Academic insights, research guides, and writing tips from our consultants.",
};

export default function ResourcesPage() {
  const posts = getAllPosts();

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
          {posts.map(post => (
            <Link 
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">{post.readTime}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-navy">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
