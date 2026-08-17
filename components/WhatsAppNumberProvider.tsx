"use client";

import { createContext, useContext } from "react";

const WhatsappNumberContext = createContext<string>("");

export function WhatsAppNumberProvider({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <WhatsappNumberContext.Provider value={number}>{children}</WhatsappNumberContext.Provider>
  );
}

export function useWhatsappNumber() {
  return useContext(WhatsappNumberContext);
}
