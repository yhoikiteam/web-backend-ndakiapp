"use client";

import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

export default function CallbackPage() {
  useEffect(() => {
    const handle = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("SESSION:", data);
    };

    handle();
  }, []);

  return <div>Logging in...</div>;
}