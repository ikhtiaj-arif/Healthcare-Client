import Logo from "@/assets/svg/Logo";
import Link from "next/link";
import React from "react";

const Header = () => {
  const routes = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <header className="w-full h-16  border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-full ">
        <h1 className="text-lg flex items-center  font-bold">
        <Logo />
        HealthCare Service
      </h1>
      <div className="flex gap-4 items-center justify-center">
        {routes.map((route) => (
          <Link href={route.path} key={route.path}>
            {route.name}
          </Link>
        ))}
      </div>
      <div>
        <Link href="/login">Login</Link>
      </div>
      </div>
    </header>
  );
};

export default Header;
