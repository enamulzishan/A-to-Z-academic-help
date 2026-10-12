"use client";

import { useState } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { TeamCard } from "@/components/ui/TeamCard";
import { TeamMemberItem } from "@/lib/data";

const categories = [
  { id: "all", label: "All Team Members" },
  { id: "academic-consultant", label: "Academic Consultants" },
  { id: "research-consultant", label: "Research Consultants" },
  { id: "subject-specialist", label: "Subject Specialists" },
  { id: "academic-editor", label: "Academic Editors" },
];

export function TeamListClient({ initialMembers }: { initialMembers: TeamMemberItem[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTeam =
    activeCategory === "all"
      ? initialMembers
      : initialMembers.filter((member) => member.category === activeCategory);

  return (
    <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 inline-block">
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeam.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No team members found for this category.
        </div>
      )}
    </div>
  );
}
