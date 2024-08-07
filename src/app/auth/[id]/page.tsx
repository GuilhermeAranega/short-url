"use client";

import { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import Link from "next/link";

export default function Home({ params }: { params: { id: string } }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenId = params.id;

    fetch(`http://localhost:3333/auth/${tokenId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          setError(false);
          setCookie("token", data.token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            secure: true,
          });
          setCookie("user", data.userId, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            secure: true,
          });
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] justify-center">
      {error ? (
        <div>
          <h1 className="font-bold text-xl text-center text-red-600">
            Login failed
          </h1>
          <p className="text-red-600">You must have a valid auth link</p>
        </div>
      ) : (
        <h1 className="font-bold text-xl text-center">Login succeed</h1>
      )}
      <Link href="/" className="text-center mt-4">
        Go back to homepage
      </Link>
    </div>
  );
}
