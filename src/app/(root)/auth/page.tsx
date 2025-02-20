import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuthorization, isCheckLogin } from "@/lib/auth";

export default async function Auth() {
  const cookieStore = await cookies();
  const isOk = await checkAuthorization(cookieStore);
  console.log("auth-isOk:", isOk);
  if (isOk) {
    redirect("/");
  }
  return null;
}
