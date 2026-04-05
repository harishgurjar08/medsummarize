"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/",            label: "Home"            },
  { href: "/how-it-works", label: "How It Works?"  },
  { href: "/about",       label: "About Developer" },
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#00d68f,#00b8d9)" }}>
            <Activity size={15} className="text-black" strokeWidth={3} />
          </div>
          <span style={{ fontFamily: "'Cabinet Grotesk',serif", fontWeight:800, fontSize:"1.1rem", color:"var(--text-1)" }}>
            Med<span style={{ color:"var(--green)" }}>Simplify</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color:      active ? "var(--green)"  : "var(--text-2)",
                  background: active ? "var(--green-dim)" : "transparent",
                }}>{label}</Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg" style={{ color:"var(--text-2)" }}
          onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 space-y-1" style={{ borderTop:"1px solid var(--border)" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm"
              style={{ color:"var(--text-2)" }}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
