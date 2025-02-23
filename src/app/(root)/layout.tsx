import Image from "next/image";
import homeBg from "@/static/img/logo.png";

import { ThemeToggle } from "@/components/ToggleTheme";
import { UserAvatar } from "@/components/UserAvatar";
import Navbar from "@/components/server/Navbar";
import { readJSONFile } from "@/lib/getdata";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { checkAuthorization, redirectToLoginUrl, isCheckLogin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appInfo = await readJSONFile("src/static/json/app_info.json");
  let redirectUrl = "";
  if (isCheckLogin) {
    const cookieStore = cookies();
    const isOk = await checkAuthorization(cookieStore);
    if (!isOk) {
      const headersList = await headers();
      const host = headersList.get("host");
      const protocol = headersList.get("x-forwarded-proto") || "https";
      const fullUrl = `${protocol}://${host}`;
      console.log("redirectToLoginUrl:", fullUrl);
      redirectUrl = await redirectToLoginUrl(fullUrl);
      console.log("url:", redirectUrl);
      if (redirectUrl) {
        redirect(redirectUrl);
      }
    }
  }
 
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative w-full bg-background ">
        <div className="flex justify-between py-3 items-center h-[56px] box-border w-full px-[10px]">
          <div className="left">
            <Link href="/" className="text-primary cursor-pointer">
              <Image
                src={homeBg}
                alt="Home background"
                className="h-[28px] w-[180px]" // 使用 brightness 或其他滤镜
                priority
              />
            </Link>
          </div>
          <div className="right gap-x-2 flex items-center justify-end">
            {/* <Navbar /> 
        <ThemeToggle />
        <UserAvatar /> */}
          </div>
        </div>
      </header>
      <main className=" min-h-[95vh] w-full bg-secondary">{children}</main>
      <footer className="relative w-full bg-background">
        <div className="flex justify-center py-3 items-center w-full px-20">
          <span className="text-xs text-gray-500">
            {appInfo.footer.right}
          </span>
        </div>
      </footer>
    </div>
  );
}
