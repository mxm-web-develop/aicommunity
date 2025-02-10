'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'  // 添加这行导入

export default function Search({ initialSearchTerm, initialCategory, categories }: {
  initialSearchTerm: string,
  initialCategory: string,
  categories: string[]
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [category, setCategory] = useState(initialCategory)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    if (searchTerm) searchParams.set('q', searchTerm)
    if (category) searchParams.set('category', category)
    router.push(`/aitools?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-row justify-center items-center gap-1 mb-4 max-w-2xl mx-auto px-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
        className="flex-1 h-10 px-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-24 h-10 px-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">全部</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button
        type="submit"
        className="h-10 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
      >
        <span className="hidden sm:inline">搜索</span>
        <SearchIcon className="w-4 h-4 sm:hidden" />
      </button>
    </form>
  )
}

