"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { useLogout } from "./useLogout";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleLogout } = useLogout();

  const handleLogoutWithMenuClose = () => {
    handleLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full h-16 md:h-20 relative border-b border-black bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center text-black text-2xl md:text-4xl font-bold font-['Comic_Neue']"
        >
          Medi
        </Link>

        {/* 데스크톱 메뉴 */}
        <DesktopMenu onLogout={handleLogoutWithMenuClose} />

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="메뉴"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogoutWithMenuClose}
      />
    </header>
  );
}

