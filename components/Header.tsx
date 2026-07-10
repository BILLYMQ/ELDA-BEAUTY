"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/messagerie", label: "Messagerie" },
  { href: "/panier-reservation", label: "Panier & Réservation" },
  { href: "/videos", label: "Vidéos" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-elda-gold/20 bg-elda-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo.png"
            alt="ELDA BEAUTY"
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover shadow-elda-gold sm:h-12 sm:w-12"
            priority
          />
          <span className="font-display text-lg font-bold tracking-wide text-elda-purple sm:text-xl">
            ELDA <span className="text-elda-gold-dark">BEAUTY</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium tracking-wide transition-colors hover:text-elda-gold-dark ${
                pathname === link.href ? "text-elda-gold-dark" : "text-elda-purple-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/panier-reservation"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-elda-gold/40 text-elda-purple transition-colors hover:bg-elda-purple hover:text-elda-cream"
            aria-label="Panier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-1.2 4.8A1 1 0 007.75 19H17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="21" r="1.4" fill="currentColor" />
              <circle cx="17" cy="21" r="1.4" fill="currentColor" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-elda-gold text-[11px] font-bold text-elda-black shadow">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-elda-gold/40 text-elda-purple lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-elda-gold/20 bg-elda-cream px-4 pb-4 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-3 py-2.5 font-body text-sm font-medium ${
                pathname === link.href
                  ? "bg-elda-purple/10 text-elda-gold-dark"
                  : "text-elda-purple-dark hover:bg-elda-purple/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
