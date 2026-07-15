import {
  LayoutDashboard,
  Sparkles,
  History,
  Columns2,
  FileBarChart2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/upload", icon: Sparkles },
  { label: "History", href: "/history", icon: History },
  { label: "Compare", href: "/compare", icon: Columns2 },
  { label: "Reports", href: "/reports", icon: FileBarChart2 },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
];
