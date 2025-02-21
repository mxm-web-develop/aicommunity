// 使用 dynamic = 'force-static' 来启用静态生成，但首次访问时生成
export const dynamic = 'force-dynamic'
// 设置 revalidate
//export const revalidate = 43200  // 12小时缓存

import Image from "next/image";
import homeBg from "@/static/img/home_bg.png";
import AppCard from "@/scomponents/AppCard";
import { fetchApi } from "@/lib/fetchapi";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkAuthorization,
  redirectToLoginUrl,
  isCheckLogin
} from "@/lib/auth";
import { headers } from "next/headers";


export default async function Home() {
  let redirectUrl = "";
  if (isCheckLogin) {
    // console.log("isCheckLogin", isCheckLogin);
    const cookieStore = await cookies();
    const isOk = await checkAuthorization(cookieStore);
    if (!isOk) {
      // console.log("checkAuthorization", 1);
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
    } else {
      // console.log("checkAuthorization", isOk, redirectUrl);
    }
  }

  const { success, data: AIapplications } = await fetchApi(
    "/api/applications/ai?limit=8"
  );
  const { success: success2, data: AIapplications2 } = await fetchApi(
    "/api/applications/aiplus?limit=8"
  );
  if (!success) {
    console.error("Failed to fetch applications");
    return null;
  }
  // console.log(AIapplications);
  // console.log(applications);
  return (
    <div className="relative w-full h-full mb-12">
      <div className="banner relative h-[420px] w-full">
        <div className="absolute top-[140px] left-[80px] z-10 text-black">
          <div className="flex flex-col text-foreground items-start justify-center h-full">
            <div className="text-4xl font-bold">源启AI+</div>
            <div className="text-xl">智能引领未来，AI为您赋能</div>
          </div>
        </div>
        <Image
          src={homeBg}
          alt="Home background"
          fill
          className="object-cover " // 使用 brightness 或其他滤镜
          priority
        />
      </div>
      <div className="container">
        {/* <div className="hot-applications py-5 ">
          <div className="hot-applications-title text-2xl font-bold text-center">
            热门应用
          </div>
          <div>热门应用轮播组件</div>
        </div> */}
        <div className="application-displayer py-5 ">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI产品与服务
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            源启AI技术能力矩阵
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AIapplications.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/applications">
              <button className="px-6 py-2 text-sm bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                查看更多
              </button>
            </Link>
          </div>
        </div>
        <div className="application-displayer py-5 ">
          <div className="application-displayer-title text-2xl font-bold text-center">
            AI+产品与服务
          </div>
          <div className="text-sm pt-[8px] pb-[32px] text-gray-500 text-center">
            源启+应用"智能化矩阵
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AIapplications2.map((application: any) => (
              <AppCard key={application._id} data={application} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link href="/applications">
              <button className="px-6 py-2 text-sm bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                查看更多
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
