"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";

/** Syncs the <html lang> attribute with the current locale from the store */
export default function LangHtmlAttr() {
  const locale = useAppStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  }, [locale]);
  return null;
}
