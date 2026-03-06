"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ToastProvider>{children}</ToastProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}

