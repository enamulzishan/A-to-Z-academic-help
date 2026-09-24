import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
      <p className="text-navy font-semibold animate-pulse">Loading content...</p>
    </div>
  );
}
