"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function NavigationLinks({ onClose, variant = "desktop" }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = variant === "mobile";
  
  const links = [
    { href: "#products", label: "제품소개" },
    { href: "#about", label: "회사소개" },
    { href: "#pricing", label: "요금제" },
  ];

  const handleClick = (e, href) => {
    if (onClose) {
      onClose();
    }

    // 메인 페이지가 아닌 경우 메인 페이지로 이동 후 스크롤
    if (pathname !== "/") {
      e.preventDefault();
      router.push("/");
      // 페이지 이동 후 스크롤을 위해 약간의 지연
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    // 메인 페이지인 경우 바로 스크롤
    else {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (isMobile) {
    return (
      <>
        {links.map((link) => (
          <button
            key={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="block w-full text-left px-4 py-3 text-black text-base font-bold font-['Inter'] hover:bg-gray-50 rounded-lg transition-colors"
          >
            {link.label}
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map((link) => (
        <button
          key={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className="text-black text-base font-bold font-['Inter'] hover:text-gray-600 transition-colors"
        >
          {link.label}
        </button>
      ))}
    </>
  );
}

