import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <img
      src="../../tour-guide.png" // Replace with your actual logo path
      alt="Tourism Website Logo"
      className={`h-10 w-auto ${className}`}
    />
  );
};

export default Logo;
