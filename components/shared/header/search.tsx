"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Search = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Close and collapse if someone clicks outside the search area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  };

  const handleIconClick = () => {
    if (open && query.trim()) {
      // If it's already open and has text, clicking the icon submits
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    } else {
      setOpen(true);
    }
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="flex items-center"
    >
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search our store"
        className={cn(
          "md:h-15 bg-transparent outline-none text-sm placeholder:text-muted-foreground border-b border-transparent transition-all duration-300 ease-in-out",
          open ? "w-48 md:w-64 px-2 border-border" : "w-0 px-0",
        )}
      />
      <button
        type="button"
        onClick={handleIconClick}
        className="text-foreground hover:text-accent shrink-0"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

export default Search;
