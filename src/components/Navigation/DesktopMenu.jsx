"use client";

import MenuItems from "./MenuItems";
import NavigationLinks from "./NavigationLinks";

export default function DesktopMenu({ onLogout }) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <NavigationLinks variant="desktop" />
      <MenuItems onLogout={onLogout} variant="desktop" />
    </div>
  );
}

