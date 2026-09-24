"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 py-4" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-navy transition-colors">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const label = path.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-navy font-medium" aria-current="page">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-navy transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
