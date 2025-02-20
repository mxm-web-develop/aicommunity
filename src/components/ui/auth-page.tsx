"use client";
import { useRouter } from "next/navigation";

interface IAuthPage {
  isOk: boolean;
}

export default function AuthPage(props: IAuthPage) {
  const route = useRouter();
  const { isOk } = props;
  if (isOk) {
    route.push("/");
  }
  return null;
}
