// components/Navbar.js
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-800">Jira AI</Link>
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
