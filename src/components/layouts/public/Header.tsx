import Link from "next/link";
import React from "react";

const Header = () => {
  const routes = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <header className="w-full h-16 flex items-center justify-center gap-4 border-b">
      {routes.map((route) => (
        <Link href={route.path} key={route.path}>
          {route.name}
        </Link>
      ))}
    </header>
  );
};

export default Header;
