"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { toast, Toaster } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  async function handleShortUrl(event: React.FormEvent<HTMLFormElement>) {
    setError(false);
    event.preventDefault();

    if (!email) {
      setError(true);
      return;
    }

    fetch("http://localhost:3333/auth/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }

  return (
    <div className="flex flex-col min-h-[100dvh] ">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex flex-1 justify-center items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center items-center">
                <form
                  className="flex flex-col gap-2 bg-slate-200 justify-center p-4 rounded-lg"
                  onSubmit={handleShortUrl}
                >
                  {error ? (
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      className="max-w-lg bg-zinc-200 border-red-600 w-80 text-black"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      className="max-w-lg bg-zinc-200 border-zinc-500 w-80 text-black"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                  <Button
                    type="submit"
                    className="bg-zinc-950  hover:bg-zinc-800"
                  >
                    Send link to login
                  </Button>
                </form>
                <Toaster />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
