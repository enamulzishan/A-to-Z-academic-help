"use client";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareLinks = [
    { icon: <span className="text-xs font-bold">X</span>, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, label: "Twitter" },
    { icon: <span className="text-xs font-bold">IN</span>, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, label: "LinkedIn" },
    { icon: <span className="text-xs font-bold">FB</span>, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, label: "Facebook" },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-gray-100">
      <span className="text-sm font-semibold text-navy mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-navy hover:text-white transition-colors"
          aria-label={`Share on ${link.label}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-navy hover:text-white transition-colors"
        aria-label="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  );
}
