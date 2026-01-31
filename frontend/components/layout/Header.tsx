"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { toggleSidebar } from "@/lib/slices/uiSlice";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="outline" size="sm" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  John Doe
                </div>
                <div className="text-xs text-gray-500">Farm Manager</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
