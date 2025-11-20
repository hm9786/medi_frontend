"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

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

      <main>
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-8 md:pb-16">
          {/* 배경 이미지 */}
          <Image
            src="/img/background.jpg"
            alt=""
            fill
            className="object-cover opacity-25"
            priority
          />
          
          {/* contents */}
          <div className="relative z-10 min-h-[300px] md:min-h-[600px] py-6 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center h-full">

              {/* left contents */}
              <div className="flex flex-col gap-6 md:gap-8">
                {/* main text */}
                <h1 className={`text-2xl md:text-5xl font-bold font-['Roboto'] text-black text-left max-w-3xl ${styles.textWordBreak}`}>
                  MEDI가 당신의 채널 댓글창을<br />24시간 지켜드립니다
                </h1>

                {/* sub text */}
                <h2 className={`text-base md:text-2xl font-medium font-['Roboto'] text-black text-left max-w-3xl ${styles.textWordBreak}`}>
                  유튜브 크리에이터를 위한 댓글관리 솔루션<br /> MEDI를 만나보세요
                </h2>

                {/* free trial button */}
                <div className="flex justify-center">
                  <Link href="/signup/step0" className="inline-block">
                    <Button className="w-full md:w-56 h-12 md:h-14 bg-red-600 hover:bg-red-700 rounded-lg shadow-md text-white text-lg md:text-2xl font-bold font-['Inter'] transition-all">
                      무료로 시작하기
                    </Button>
                  </Link>
                </div>
              </div>

              {/* right contents */}
              <div className="hidden md:flex justify-center md:justify-start">
                <div className={`relative w-full max-w-md ${styles.phoneAnimation} ${styles.phonePosition}`}>
                  {/* phone - youtube image */}
                  <div className={`${styles.phoneContainer} ${styles.phoneWrapper}`}>
                    <Image
                      src="/mockup-phone-1.png"
                      alt="phone image1"
                      width={500}
                      height={600}
                      className={`w-full h-auto ${styles.phoneFrame} ${styles.phoneLeft}`}
                    />

                    <Image
                      src="/mockup-phone-2.png"
                      alt="phone image2"
                      width={500}
                      height={600}
                      className={`w-full h-auto ${styles.phoneFrame} ${styles.phoneRight}`}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>





        {/* 제품소개 섹션 */}
        <section id="products" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-['Roboto'] text-black text-center mb-8 md:mb-12">
              제품소개
            </h2>
            <div className="text-center text-base md:text-lg text-gray-600">
              {/* 제품소개 내용을 여기에 추가하세요 */}
            </div>
          </div>
        </section>

        {/* 회사소개 섹션 */}
        <section id="about" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-['Roboto'] text-black text-center mb-8 md:mb-12">
              회사소개
            </h2>
            <div className="text-center text-base md:text-lg text-gray-600">
              {/* 회사소개 내용을 여기에 추가하세요 */}
            </div>
          </div>
        </section>

        {/* 요금제 섹션 */}
        <section id="pricing" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold font-['Roboto'] text-black text-center mb-8 md:mb-12">
              요금제
            </h2>
            <div className="text-center text-base md:text-lg text-gray-600">
              {/* 요금제 내용을 여기에 추가하세요 */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}