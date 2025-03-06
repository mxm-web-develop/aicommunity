import Image from "next/image";
import Logo from "@/static/img/logo.png";

import { ThemeToggle } from "@/components/ToggleTheme";
import { UserAvatar } from "@/components/client/UserAvatar";
import Navbar from "@/components/server/Navbar";
import { readJSONFile } from "@/lib/getdata";
import Link from "next/link";

export default async function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appInfo = await readJSONFile("src/static/json/app_info.json");

  return (
<div className="flex min-h-screen flex-col">
<header className="relative w-full bg-background z-10">
<div className="flex justify-between py-3 items-center h-[56px] box-border w-full px-[10px]">
<div className="left">
<Link href="/" className="text-primary cursor-pointer">
<Image
src={Logo}
alt="Home background"
className="w-[180px]"
priority
/>
</Link>
</div>
<div className="right gap-x-2 flex items-center justify-end">
</div>
</div>
</header>
<main className="min-h-[95vh] w-full bg-[#f8faff]" style={{
  backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f2f6fb 55%, #d9e6f7 100%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%"

}}>
{children}
</main>
<footer className="relative w-full bg-background">
<div className="flex justify-center py-3 items-center w-full px-20">
<span className="text-xs text-gray-500">{appInfo.footer.right}</span>
</div>
</footer>
</div>
  );
}
