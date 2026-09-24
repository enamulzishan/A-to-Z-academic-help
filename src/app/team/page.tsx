"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilterBar } from "@/components/ui/FilterBar";
import { TeamCard } from "@/components/ui/TeamCard";
import { team } from "@/data/team";

const categories = [
  { id: "all", label: "All Team Members" },
  { id: "academic-consultant", label: "Academic Consultants" },
  { id: "research-consultant", label: "Research Consultants" },
  { id: "subject-specialist", label: "Subject Specialists" },
  { id: "academic-editor", label: "Academic Editors" }
];

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTeam = activeCategory === "all" 
    ? team 
    : team.filter(member => member.category === activeCategory);

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

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 inline-block">
          <FilterBar 
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeam.map(member => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
        
        {filteredTeam.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No team members found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
