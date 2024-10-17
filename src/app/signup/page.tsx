"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { toast, Toaster } from "sonner";
import { setCookie } from "cookies-next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  async function handleShortUrl(event: React.FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();

    if (!email && !name) {
      setError("all");
      return;
    }
    if (!email) {
      setError("email");
      return;
    }
    if (!name) {
      setError("name");
      return;
    }

    fetch("http://localhost:3333/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode) {
          setError("email");
          toast.error("User already exists with the provided email");
          return;
        }
        console.log(data);
        setCookie("token", data.token, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          secure: true,
        });
        setCookie("user", data.userId, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          secure: true,
        });
        toast.success("User created successfully");
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setError("all");
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
                  {error == "name" || error == "all" ? (
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      className="max-w-lg bg-zinc-200 border-red-600 w-80 text-black"
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      className="max-w-lg bg-zinc-200 border-zinc-500 w-80 text-black"
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}

                  {error == "email" || error == "all" ? (
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="max-w-lg bg-zinc-200 border-red-600 w-80 text-black"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="max-w-lg bg-zinc-200 border-zinc-500 w-80 text-black"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                  <Button
                    type="submit"
                    className="bg-zinc-950  hover:bg-zinc-800"
                    disabled={isLoggedIn}
                  >
                    {isLoggedIn ? "You're already logged in" : "Create User"}
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
