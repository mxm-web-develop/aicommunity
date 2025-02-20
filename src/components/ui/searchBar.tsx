"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // 暂时不跳转
    // startTransition(() => {
    //   router.push(`?${params.toString()}`)
    // })
  };

  return (
    <div className="relative w-full max-w-[500px]">
      <input
        type="text"
        defaultValue={searchParams.get("name") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 
                 dark:border-gray-700 bg-background focus:outline-none 
                 focus:ring-[1px] focus:ring-secondary"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 h-4 w-4"
      />
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
