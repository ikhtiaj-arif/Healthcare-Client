"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Mail } from "lucide-react";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Doctors", href: "/doctors" },
      { label: "Available today", href: "/doctors/available-today" },
      { label: "Dashboards", href: "/login" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help", href: "/help" },
      { label: "Trust & safety", href: "/trust" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

function SocialIcon({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href="/contact"
      aria-label={label}
      className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.add({
      title: "The list is not open",
      description: "We do not store this address. Use Contact to reach the desk.",
      type: "info",
    });
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Logo />
                HealthCare Service
              </p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                A booking desk for clinics that already know their doctors.
                Patients book a published slot and pay with bKash.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <label
                htmlFor="footer-newsletter"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Newsletter
              </label>
              <Input
                id="footer-newsletter"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email address"
              />
              <Button type="submit" className="self-start">
                Notify me
              </Button>
            </form>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold tracking-widest uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HealthCare Service. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <SocialIcon label="Email the desk">
              <Mail className="size-4" aria-hidden />
            </SocialIcon>
            <SocialIcon label="Contact, Facebook">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
                <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Contact, X">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
                <path d="M14.7 4h2.6l-5.7 6.5L18.8 20h-4.6l-3.6-4.7L6.4 20H3.8l6.1-7L3.5 4h4.7l3.2 4.3L14.7 4zm-.9 14.4h1.4L8.3 5.5H6.8l7 12.9z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Contact, LinkedIn">
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
                <path d="M6.5 9H4V20h2.5V9zM5.2 4C4.3 4 3.6 4.7 3.6 5.6S4.3 7.2 5.2 7.2 6.8 6.5 6.8 5.6 6.1 4 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H11V9h2.4v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
