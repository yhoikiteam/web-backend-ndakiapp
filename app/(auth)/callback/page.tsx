"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login?verified=true");
  }, []);

  return (
    <div>
      Verifying email...
    </div>
  );
}