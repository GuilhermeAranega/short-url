import { LinkIcon } from "lucide-react";
import Link from "next/link";

export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <LinkIcon className="h-6 w-6" />
        <span className="sr-only">URL Shortener</span>
      </Link>
      {!isLoggedIn ? (
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Link
            href="signup"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Create Account
          </Link>
        </nav>
      ) : (
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="dashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Dashboard
          </Link>
        </nav>
      )}
    </header>
  );
}
