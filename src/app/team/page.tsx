import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeamListClient } from "@/components/ui/TeamListClient";
import { getTeamMembers } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Our Academic Team | A to Z Academic Help",
  description: "Meet our network of highly qualified academic consultants, subject specialists, and editors.",
};

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Our Academic Team</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Meet our network of highly qualified academic consultants, subject specialists, and editors.
          </p>
        </div>
      </div>

      {/* Main Content with dynamic Supabase members */}
      <TeamListClient initialMembers={members} />
    </div>
  );
}
