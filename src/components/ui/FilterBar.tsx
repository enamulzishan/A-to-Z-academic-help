"use client";

interface FilterBarProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat.id
              ? "bg-navy text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-navy hover:text-navy"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
