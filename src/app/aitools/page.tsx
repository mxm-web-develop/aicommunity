import { readJSONFile } from "@/lib/getdata";
import { Star } from 'lucide-react';
import Fuse from 'fuse.js';
import Search from "./Search";

export default async function Aitools({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const tools = await readJSONFile('web/aitools.json');

  // Await searchParams
  const { q, category } = await searchParams;

  const searchTerm = typeof q === 'string' ? q : '';
  const selectedCategory = typeof category === 'string' ? category : '';

  const fuse = new Fuse(tools, {
    keys: ['name', 'description', 'categories'],
    threshold: 0.4,
  });

  let filteredTools = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : tools;

  if (selectedCategory) {
    filteredTools = filteredTools.filter((tool: any) => tool.categories === selectedCategory);
  }

  // Group filtered tools by categories
  const categories = filteredTools.reduce((acc: { [key: string]: any[] }, tool: any) => {
    if (!acc[tool.categories]) {
      acc[tool.categories] = [];
    }
    acc[tool.categories].push(tool);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#121212', color: 'white' }}>
      <div className="flex-none p-4">
        <div className="flex items-center justify-center mb-4">
          <h1 className="font-fancy text-4xl py-20">AI TOOLS</h1>
        </div>
        <Search
          initialSearchTerm={searchTerm}
          initialCategory={selectedCategory}
          categories={Array.from(new Set(tools.map((tool: any) => tool.categories)))}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 400px)' }}>
        {filteredTools.length === 0 ? (
          <p className="text-center mt-8">没有找到匹配的工具。</p>
        ) : (
          Object.entries(categories).map(([category, categoryTools]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg py-5  bg-[#121212] z-10">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(categoryTools as any[]).map((tool: any) => (
                  <div key={tool._id} className="border rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105" style={{ backgroundColor: '#333', borderColor: '#444' }}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl">{tool.name}</h4>
                    </div>
                    <div className="flex gap-2 py-2">
                      {tool.local && (
                        <span className="px-2 py-0.5 text-[8px] lg:text-xs rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          本地部署
                        </span>
                      )}
                      {tool.opensource && (
                        <span className="px-2 py-0.5 text-[8px] lg:text-xs rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          开源
                        </span>
                      )}
                    </div>
                    <p className="text-sm line-clamp-3 py-1 text-gray-400">{tool.description}</p>
                    <div className="flex py-3">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          size={14}
                          fill={index < tool.rate ? '#ffc107' : '#e4e5e9'}
                          key={index}
                          color={index < tool.rate ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={tool.url} className="text-blue-500  text-right hover:underline">去使用</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

