"use client";
import { useRouter } from "next/navigation";

interface IRedirectPage {
  redirectUrl?: string;
}

export default function RedirectPage(props: IRedirectPage) {
  const route = useRouter();
  const { redirectUrl = "" } = props;
  if (redirectUrl) {
    route.push(redirectUrl);
  }
  return null;
}
