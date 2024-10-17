"use client";

import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import Link from "next/link";

export default function Logout() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      setError(true);
      setLoading(false);
    } else {
      deleteCookie("token");
      deleteCookie("user");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] justify-center">
      {error ? (
        <div>
          <h1 className="font-bold text-xl text-center text-red-600">
            Logout failed
          </h1>
          <p className="text-red-600">You must be logged in to logout</p>
        </div>
      ) : (
        <h1 className="font-bold text-xl text-center">Logout succeed</h1>
      )}
      <Link href="/" className="text-center mt-4">
        Go back to homepage
      </Link>
    </div>
  );
}
