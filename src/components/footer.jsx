import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-white text-center py-4"
      style={{
        background: "linear-gradient(180deg, #06042c, black)",
        position: "relative", // Ensures proper stacking
        width: "100%", // Stretches the footer across the viewport
        bottom: 0, // Sticks to the bottom if the content is short
      }}
    >
      <p className="text-sm">© {new Date().getFullYear()} All rights Reserved to Team SETHU</p>
    </footer>
  );
};

export default Footer;
