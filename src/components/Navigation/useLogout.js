"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/slices/authSlice";

export function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const isGoogleUser = user?.provider === "GOOGLE";
      
      const logoutUrl = isGoogleUser 
        ? "http://localhost:8080/api/auth/oauth2/logout"
        : "http://localhost:8080/api/auth/logout";
      
      const response = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.warn(`로그아웃 API 오류: ${response.status}`);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      dispatch(logout());
      router.push("/");
    }
  };

  return { handleLogout };
}

