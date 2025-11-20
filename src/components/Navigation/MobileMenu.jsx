"use client";

import MenuItems from "./MenuItems";
import NavigationLinks from "./NavigationLinks";

export default function MobileMenu({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black shadow-lg">
      <div className="px-4 py-4 space-y-3">
        <NavigationLinks onClose={onClose} variant="mobile" />
        <div className="border-t border-gray-200 pt-3 mt-3">
          <MenuItems onLogout={onLogout} onClose={onClose} variant="mobile" />
        </div>
      </div>
    </div>
  );
}

