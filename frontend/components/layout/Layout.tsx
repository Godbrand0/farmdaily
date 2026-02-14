"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { clsx } from "clsx";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen max-w-full flex bg-background">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar mobile={true} onClose={handleMobileMenuClose} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={clsx(
          "transition-all duration-300 w-full ease-in-out",
          sidebarOpen ? "lg:ml-1" : "lg:ml-16",
        )}
      >
        <Header onMobileMenuToggle={handleMobileMenuToggle} />

        <main className="">
          <div className="py-6 animate-slide-up">
            <div className=" mx-auto px-4 w-full sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
