"use client";

import { useEffect } from "react";
import { consumePendingHomeScrollRestore } from "@/lib/homeScrollMemory";

export default function HomeScrollRestore() {
  useEffect(() => {
    consumePendingHomeScrollRestore();
  }, []);

  return null;
}
