import { Suspense } from "react";

export default function ApplicationLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
    {children}
  </Suspense>
  );
}
