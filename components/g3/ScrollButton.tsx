"use client";

import React from "react";

interface ScrollButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string;
}

/**
 * In-page link to a section, with smooth scrolling. An <a href="#id"> rather
 * than a button: it navigates, so it works without JavaScript, can be opened
 * or copied like any link, and is announced as a link.
 */
export default function ScrollButton({ targetId, children, onClick, ...props }: ScrollButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
