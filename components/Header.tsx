"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Browse APIs" },
    { href: "/about", label: "About" },
    { href: "/api-doc", label: "Our API" },
    { href: "/add-api", label: "Add API" },
    { href: "https://blog.apis.guru/", label: "Blog", external: true },
    {
      href: "https://apis.guru/awesome-openapi3/",
      label: "OpenAPI Tools",
      external: true,
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
          {/* Logo and Text */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/svg/logo.svg"
              alt="APIS.GURU Logo"
              width={120} // Adjust width as needed
              height={40} // Adjust height as needed
              priority // Preload the logo for faster rendering
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-800">APIS.GURU</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-amber-500" />
              </Button>
            </SheetTrigger>

            {/* Mobile Menu Content */}
            <SheetContent side="left" className="w-[255px] p-0">
              <nav className="flex flex-col pt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-3 px-6 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-gray-800 px-4 py-2 text-sm font-medium",
                  "hover:text-amber-500",
                  // Show underline if active
                  !item.external &&
                  (pathname === item.href ||
                    (item.href === "/" && pathname.startsWith("/apis/")))
                    ? 'after:block after:content-[""] after:h-0.5 after:bg-amber-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:scale-x-100'
                    : 'hover:after:scale-x-100 after:block after:content-[""] after:h-0.5 after:bg-amber-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:transform after:scale-x-0 after:transition-transform after:duration-200'
                )}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-14"></div>
    </>
  );
}
