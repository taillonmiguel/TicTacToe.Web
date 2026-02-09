"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import styles from "./CadernoLayout.module.css";

export function CadernoLayout(props: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/game/");

  return (
    <div className={styles.wrap}>
      {hideHeader ? null : <header className={styles.header}></header>}
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
