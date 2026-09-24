"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("article h2, article h3"));
    const headingData = elements.map((elem) => {
      if (!elem.id) {
        elem.id = elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";
      }
      return {
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.charAt(1)),
      };
    });

    setHeadings(headingData);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 p-6 bg-gray-50 rounded-xl">
      <h3 className="font-bold text-navy mb-4">Table of Contents</h3>
      <ul className="space-y-3 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block transition-colors hover:text-navy ${
                activeId === heading.id ? "text-navy font-semibold" : "text-gray-500"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
