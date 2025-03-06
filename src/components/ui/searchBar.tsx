"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useCallback } from "react";
import debounce from "lodash/debounce";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");

  // 使用防抖处理搜索，延迟500ms
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        if (term.trim()) {
          params.set("name", term);
        } else {
          params.delete("name");
        }
        router.push(`?${params.toString()}`);
      });
    }, 500),
    [searchParams, router]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 
                 dark:border-gray-700 bg-background focus:outline-none 
                 focus:ring-[1px] focus:ring-secondary"
      />
      {!isPending && (
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    text-gray-400 h-4 w-4"
        />
      )}
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div
            className="animate-spin h-4 w-4 border-2 border-primary 
                      border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
}
