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
  BeakerIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    color: "text-blue-500",
  },
  {
    name: "Layers",
    href: "/layers",
    icon: BuildingOfficeIcon,
    color: "text-amber-500",
  },
  {
    name: "Catfish",
    href: "/catfish",
    icon: BeakerIcon,
    color: "text-cyan-500",
  },
  {
    name: "Egg Production",
    href: "/egg-production",
    icon: TagIcon,
    color: "text-yellow-500",
  },
  {
    name: "Harvest",
    href: "/harvest",
    icon: CurrencyDollarIcon,
    color: "text-green-500",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartBarIcon,
    color: "text-purple-500",
  },
];

const settings = [
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    color: "text-gray-500",
  },
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
    "flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
    mobile
      ? "fixed inset-y-0 left-0 z-50 w-64 h-full shadow-xl"
      : "relative min-h-screen",
    !mobile && !sidebarOpen && "w-16",
  );

  return (
    <div className={sidebarClasses}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-muted/30">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <BeakerIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="ml-2 text-xl font-bold text-foreground">
              FarmERP
            </span>
          )}
        </div>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigation}
                className={clsx(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon
                  className={clsx(
                    "h-5 w-5 flex-shrink-0",
                    sidebarOpen ? "mr-3" : "mx-auto",
                    isActive ? "text-primary-foreground" : item.color,
                  )}
                />
                {sidebarOpen && (
                  <span
                    className={clsx("truncate", isActive && "font-semibold")}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings section */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-1">
            {settings.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavigation}
                  className={clsx(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon
                    className={clsx(
                      "h-5 w-5 flex-shrink-0",
                      sidebarOpen ? "mr-3" : "mx-auto",
                      isActive ? "text-primary-foreground" : item.color,
                    )}
                  />
                  {sidebarOpen && (
                    <span
                      className={clsx("truncate", isActive && "font-semibold")}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Toggle button (desktop only) */}
      {!mobile && (
        <div className="p-3 border-t border-border">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
