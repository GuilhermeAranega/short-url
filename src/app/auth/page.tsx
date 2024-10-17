"use client";

import Link from "next/link";

export default function Auth() {
  return (
    <div className="flex flex-col min-h-[100dvh] justify-center">
      <h1 className="font-bold text-xl text-center text-red-600">
        Login failed
      </h1>
      <p className="text-red-600">You must have a auth link</p>
      <Link href="/" className="text-center mt-4">
        Go back to homepage
      </Link>
    </div>
  );
}
