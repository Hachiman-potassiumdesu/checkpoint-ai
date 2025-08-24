"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAppPage = pathname.startsWith("/app");

    if (isAppPage && (!user || isLoading)) {
      router.push("/");
    }
  }, [user, isLoading, pathname]);

  return <>{children}</>;
};
