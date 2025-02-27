"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import {
  checkAuthorizationByClient,
  redirectToLoginUrl,
  isCheckLogin
} from "@/lib/auth";

let redirectUrl = "";
const RedirectCmp = () => {
  useEffect(() => {
    if (isCheckLogin) {
      const isOk = checkAuthorizationByClient();
      if (!isOk) {
        redirectUrl = redirectToLoginUrl(location.origin);
        console.log("url:", redirectUrl);
        if (redirectUrl) {
          redirect(redirectUrl);
        }
        // } else {
        //   console.log("isOkisOkisOkisOk", isOk);
      }
    }
  }, []);
  return <div></div>;
};

export default RedirectCmp;
