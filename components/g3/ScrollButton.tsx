"use client";

import React from "react";

interface ScrollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  targetId: string;
}

export default function ScrollButton({ targetId, children, onClick, ...props }: ScrollButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
