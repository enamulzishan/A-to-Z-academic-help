import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-navy mb-4 font-heading tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center bg-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-gold/90 transition-colors shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
