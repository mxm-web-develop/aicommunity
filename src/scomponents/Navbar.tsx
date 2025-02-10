import { readJSONFile } from "@/lib/getdata";
import Link from "next/link";

interface NavItem {
  key: string;
  name: string;
  status: string;
  path: string;
}

async function Navbar() {
  // 读取导航数据
  const navItems: NavItem[] = await readJSONFile("/src/static/json/app_navigation.json");

  return (
    <nav className="bg-background text-foreground shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              item.status === "enabled" && (
                <Link
                  key={item.key}
                  href={item.path}
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-600"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
