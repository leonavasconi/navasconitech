"use client";

import { useEffect, useState } from "react";

export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY >= 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#home" className={`nv-scrollup${visible ? " nv-show-scroll" : ""}`}>
      <i className="uil uil-arrow-up nv-scrollup__icon"></i>
    </a>
  );
}
