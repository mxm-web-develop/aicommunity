import { cookies } from "next/headers";
import AuthPage from "@/components/ui/auth-page";
import { checkAuthorization, isCheckLogin } from "@/lib/auth";

export default async function Auth() {
  const cookieStore = await cookies();
  const isOk = await checkAuthorization(cookieStore);
  console.log("auth-isOk:", isOk);
  return <AuthPage isOk={isCheckLogin ? isOk : true} />;
}
