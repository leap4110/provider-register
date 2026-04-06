import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <SearchX className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="mt-6 text-xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/search"
            className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Search providers
          </Link>
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-lg border px-4 text-sm hover:bg-gray-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
