import React from "react";
import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className="text-right">
      <a
        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        href="https://github.com/lketh/Exchange"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github Repo
      </a>
    </footer>
  );
}
