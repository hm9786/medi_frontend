"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col items-center justify-center min-h-[600px]">

            <Link href="/signup/step0" className="w-full flex justify-center">
              <Button className="w-full sm:w-56 h-12 sm:h-14 bg-red-600 hover:bg-red-700 rounded-lg shadow-md text-white text-lg sm:text-xl lg:text-2xl font-bold font-['Inter'] transition-all">
                무료로 시작하기
              </Button>
            </Link>
          
        </div>
      </main>
    </div>
  );
}