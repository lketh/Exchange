import React from "react";
import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.link}
        href="https://github.com/lketh/Exchange"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github Repo
      </a>
    </footer>
  );
}
