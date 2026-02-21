"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/Authcontext";

export default function Home() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user, loading } = auth;

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/Dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return null;
}