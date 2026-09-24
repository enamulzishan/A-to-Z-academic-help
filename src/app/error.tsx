"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-3">Something went wrong!</h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-navy/90 transition-colors shadow-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full bg-gray-50 text-navy font-bold py-3 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
