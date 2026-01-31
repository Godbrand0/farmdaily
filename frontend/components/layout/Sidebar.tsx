"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { toggleSidebar } from "@/lib/slices/uiSlice";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  FishIcon,
  EggIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Layers", href: "/layers", icon: BuildingOfficeIcon },
  { name: "Catfish", href: "/catfish", icon: FishIcon },
  { name: "Egg Production", href: "/egg-production", icon: EggIcon },
  { name: "Harvest", href: "/harvest", icon: CurrencyDollarIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobile = false,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const pathname = usePathname();

  const handleNavigation = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  const sidebarClasses = clsx(
    "flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out",
    mobile ? "fixed inset-y-0 left-0 z-50 w-64" : "relative w-64 min-h-screen",
    !mobile && !sidebarOpen && "w-16",
  );

  return (
    <div className={sidebarClasses}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        <div className="flex items-center">
          <FishIcon className="h-8 w-8 text-blue-400" />
          {sidebarOpen && (
            <span className="ml-2 text-xl font-semibold">FarmERP</span>
          )}
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavigation}
              className={clsx(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <item.icon
                className={clsx("h-5 w-5", sidebarOpen ? "mr-3" : "mx-auto")}
              />
              {sidebarOpen && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button (desktop only) */}
      {!mobile && (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="w-full flex items-center justify-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
