"use client";

import StoreProvider from "@/components/StoreProvider";
import AuthInitializer from "@/components/AuthInitializer";

export default function ClientWrapper({ children }) {
  return (
    <StoreProvider>
      <AuthInitializer />
      {children}
    </StoreProvider>
  );
}

