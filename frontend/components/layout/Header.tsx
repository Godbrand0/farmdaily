"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { toggleSidebar } from "@/lib/slices/uiSlice";
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors sm:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 h-9 w-9"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <Button variant="outline" size="sm" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-foreground">
                  John Doe
                </div>
                <div className="text-xs text-muted-foreground">
                  Farm Manager
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium shadow-sm">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
