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
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx("lg:block", mobileMenuOpen ? "block" : "hidden")}>
        <Sidebar mobile={true} onClose={handleMobileMenuClose} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={clsx(
          "lg:pl-0 transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        )}
      >
        <Header onMobileMenuToggle={handleMobileMenuToggle} />

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
