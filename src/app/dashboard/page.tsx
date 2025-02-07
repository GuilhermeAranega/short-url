"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";
import { useCallback, useEffect, useState } from "react";
import { CookieValueTypes, getCookie } from "cookies-next";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Table } from "@/components/table/table";
import { TableHeader } from "@/components/table/table-header";
import { TableCell } from "@/components/table/table-cell";
import { TableRoll } from "@/components/table/table-roll";
import { IconButton } from "@/components/table/icon-button";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Link {
  id: string;
  title: string;
  url: string;
  shortedUrl: string;
}

export default function LinksList() {
  const [currentPage, setCurrentPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [links, setLinks] = useState<Link[]>([]);
  const [loggedIn, setLoggedIn] = useState<CookieValueTypes>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [longURL, setLongURL] = useState("");
  const [slug, setSlug] = useState("");
  const [shortenedURL, setShortenedURL] = useState("");
  const [urlId, setUrlId] = useState("");
  const [linkId, setLinkId] = useState("");
  const [loading, setLoading] = useState(true);

  const handleRefreshTable = useCallback(async () => {
    const fetchUrl = new URL("http://localhost:3333/links");

    fetchUrl.searchParams.set("pageIndex", String(currentPage - 1));

    await fetch(fetchUrl, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setLinks(data.links);
        setTotal(data.total);
      });
  }, [currentPage]);

  useEffect(() => {
    setLoggedIn(getCookie("token"));
    const url = new URL(window.location.toString());

    if (url.searchParams.has("page")) {
      setCurrentPageState(Number(url.searchParams.get("page")));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleRefreshTable();
  }, [handleRefreshTable]);

  const isLoggedIn = loggedIn ? true : false;

  function handleEditLink(id: string) {
    fetch(`http://localhost:3333/links/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.link.title);
        setLongURL(data.link.url);
        setSlug(data.link.slug);
        setShortenedURL(data.link.shortedUrl);
        setUrlId(data.link.id);
        setIsEditDialogOpen(true);
      });
  }

  function handleOpenDeleteLink(id: string) {
    setLinkId(id);
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteLink() {
    fetch(`http://localhost:3333/links/${linkId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.status === 204) {
        handleRefreshTable();
        setIsDeleteDialogOpen(false);
        toast.success("Link deleted");
      }
    });
  }

  async function handleEditURL(data: FormData) {
    const title = data.get("title");
    const url = data.get("longURL");
    const slug = data.get("slug");
    const userId = getCookie("user");

    await fetch(`http://localhost:3333/links/${urlId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url, slug, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Shorted url updated") {
          handleRefreshTable();
          toast.success("Shorted URL updated");
          setIsEditDialogOpen(false);
        }
      });
  }

  function handleSlugChange(slug: string) {
    setSlug(slug);
    setShortenedURL(`http://localhost:3333/${slug}`);
  }

  async function setCurrentPage(_page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set("page", String(_page));

    window.history.pushState({}, "", url);

    setCurrentPageState(_page);
  }

  function goToNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function goToPreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  const totalPages = Math.ceil(total / 10);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn) {
    return <h1>403, forbidden</h1>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Links</h1>
      </div>
      <Dialog open={isEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="flex items-center justify-center absolute top-4 right-4"
            >
              <Cross2Icon className="h-4 w-4 text-black" />
              <span className="sr-only">Close</span>
            </button>
            <DialogTitle>Edit a link</DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-3" action={handleEditURL}>
                <p className="mt-4">Title</p>
                <Input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p>Long URL</p>
                <Input
                  type="text"
                  name="longURL"
                  placeholder="Long URL"
                  className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                  defaultValue={longURL}
                  onChange={(e) => setLongURL(e.target.value)}
                />
                <p>Slug</p>
                <Input
                  type="text"
                  name="slug"
                  placeholder="Slug"
                  className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                  defaultValue={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                />
                <p>Shortened URL</p>
                <Input
                  type="url"
                  name="shortenedURL"
                  placeholder="Shortened URL"
                  className="max-w-lg bg-zinc-200 border-zinc-600 text-zinc-900"
                  value={shortenedURL}
                  disabled
                />
                <Button type="submit">Edit URL</Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Table>
        <thead>
          <TableRoll className="border-b border-white/10">
            <TableHeader>Title</TableHeader>
            <TableHeader>Long URL</TableHeader>
            <TableHeader>Short URL</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRoll>
        </thead>
        <tbody>
          {links.length == 0 ? (
            <h1 className="text-red-500 text-center py-4">
              You don&apos;t have any shorted links
            </h1>
          ) : (
            <h1></h1>
          )}
          {links.map((link) => {
            return (
              <TableRoll key={link.id} className="">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {link.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <a href={link.url}>{link.url}</a>
                </TableCell>
                <TableCell>
                  <a href={link.shortedUrl}>{link.shortedUrl}</a>
                </TableCell>
                <TableCell>
                  <div className="gap-x-1">
                    <IconButton onClick={() => handleEditLink(link.id)}>
                      <Pencil className="size-4" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteLink(link.id)}>
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRoll>
            );
          })}
        </tbody>
        <tfoot>
          <TableRoll>
            <TableCell className="py-3 px-4 text-sm text-zinc-300" colSpan={3}>
              Showing {links.length} of {total} items
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRoll>
        </tfoot>
      </Table>
      <Toaster />

      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex items-center justify-center absolute top-4 right-4"
            >
              <Cross2Icon className="h-4 w-4 text-black" />
              <span className="sr-only">Close</span>
            </button>
            <AlertDialogTitle className="text-black">
              Delete link
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this link?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <button onClick={() => setIsDeleteDialogOpen(false)}>
              <AlertDialogCancel className="bg-slate-900 text-white hover:bg-slate-700 hover:text-white">
                Cancel
              </AlertDialogCancel>
            </button>
            <button onClick={() => handleDeleteLink()}>
              <AlertDialogAction className="bg-red-700 hover:bg-red-900 hover:text-white">
                Delete
              </AlertDialogAction>
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
