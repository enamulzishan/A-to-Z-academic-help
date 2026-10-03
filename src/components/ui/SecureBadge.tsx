import { ShieldCheck } from "lucide-react";

export function SecureBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 inline-flex ${className}`}>
      <ShieldCheck className="w-4 h-4 text-green-600" />
      <span className="text-xs font-medium">100% Secure & Confidential</span>
    </div>
  );
}
