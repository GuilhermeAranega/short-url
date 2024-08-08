"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";
import { useEffect, useState } from "react";
import { CookieValueTypes, getCookie } from "cookies-next";
import { toast, Toaster } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

export default function Home() {
  const [link, setLink] = useState("");
  const [error, setError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState<CookieValueTypes>("");

  useEffect(() => {
    setLoggedIn(getCookie("token"));
  }, []);

  const isLoggedIn = loggedIn ? true : false;

  function handleOpenDialog(event: React.FormEvent<HTMLFormElement>) {
    setError(false);
    event.preventDefault();

    if (!link) {
      setError(true);
      return;
    }

    if (!loggedIn) {
      toast.error("You need to login to shorten a URL");
      return;
    }

    setIsDialogOpen(true);
  }

  async function handleShortUrl(data: FormData) {
    const title = data.get("title")?.toString();
    const slug = data.get("slug")?.toString();
    const url = data.get("url")?.toString();
    const userId = getCookie("user");

    await fetch("http://localhost:3333/links", {
      credentials: "include",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, slug, url, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Shorted url created") {
          toast.success("Shorted URL created and copied to clipboard");
          navigator.clipboard.writeText(data.shortedUrl);
          setIsDialogOpen(false);
        } else {
          toast.error("Error creating shorted URL");
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Dialog open={isDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <button
                          onClick={() => setIsDialogOpen(false)}
                          className="flex items-center justify-center absolute top-4 right-4"
                        >
                          <Cross2Icon className="h-4 w-4 text-black" />
                          <span className="sr-only">Close</span>
                        </button>
                        <DialogTitle>Create a shorted link</DialogTitle>
                        <DialogDescription>
                          <form
                            className="flex flex-col gap-4"
                            action={handleShortUrl}
                          >
                            <Input
                              type="text"
                              name="title"
                              placeholder="Title"
                              className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                            />
                            <Input
                              type="text"
                              name="slug"
                              placeholder="Slug"
                              className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                            />
                            <Input
                              type="url"
                              name="url"
                              placeholder="URL"
                              className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                              defaultValue={link}
                            />
                            <Button type="submit">Shorten URL</Button>
                          </form>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Shorten Your Links
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Just as simple as making a cup of coffee
                  </p>
                </div>
                <form className="flex gap-2" onSubmit={handleOpenDialog}>
                  {error ? (
                    <Input
                      type="url"
                      placeholder="Enter your URL"
                      className="max-w-lg bg-zinc-950 border-red-600"
                      onChange={(e) => setLink(e.target.value)}
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder="Enter your URL"
                      className="max-w-lg bg-zinc-950 border-zinc-500"
                      onChange={(e) => setLink(e.target.value)}
                    />
                  )}
                  <Button
                    type="submit"
                    className="bg-zinc-200 text-black hover:bg-zinc-400"
                  >
                    Shorten URL
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
