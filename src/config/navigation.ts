import { LayoutDashboard, Users, CreditCard, ClipboardList, UserCheck, UserCircle, Settings, type LucideIcon } from "lucide-react"

export type UserRole = "admin" | "staff"
export type MenuCategory = "Ringkasan" | "Manajemen" | "Sistem"

export interface NavItem {
  title: string
  path?: string
  icon?: LucideIcon
  roles: UserRole[]
  children?: NavItem[]
  category?: MenuCategory
}

export interface LandingNavItem {
  title: string
  href: string
}

export interface FooterNavItem {
  title: string
  href?: string
  to?: string
}

export const navigationMenu: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
    category: "Ringkasan"
  },
  {
    title: "User Management",
    icon: Users,
    roles: ["admin", "staff"],
    category: "Manajemen",
    children: [
      {
        title: "Member Data",
        path: "/dashboard/members",
        roles: ["admin", "staff"]
      },
      {
        title: "Staff Data",
        path: "/dashboard/staffs",
        roles: ["admin"]
      }
    ]
  },
  {
    title: "Membership",
    path: "/dashboard/membership",
    icon: CreditCard,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Transactions",
    path: "/dashboard/transactions",
    icon: ClipboardList,
    roles: ["admin"],
    category: "Manajemen"
  },
  {
    title: "Attendance",
    path: "/dashboard/attendance",
    icon: UserCheck,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Trainer Data",
    path: "/dashboard/trainers",
    icon: UserCircle,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Account Settings",
    path: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "staff"],
    category: "Sistem"
  }
]

export const landingNavigationMenu: LandingNavItem[] = [
  {
    title: "Home",
    href: "#beranda"
  },
  {
    title: "About Us",
    href: "#fitur"
  },
  {
    title: "Registration Flow",
    href: "#alur-pendaftaran"
  },
  {
    title: "Membership",
    href: "#paket"
  },
  {
    title: "Trainers",
    href: "#trainer"
  },
  {
    title: "FAQ",
    href: "#faq"
  }
]

export const footerEcosystemMenu: FooterNavItem[] = [
  { title: "Member App", href: "#alur-pendaftaran" },
  { title: "Staff & Admin Portal", to: "/auth/login" },
  { title: "Membership Packages", href: "#paket" },
  { title: "Professional Trainers", href: "#trainer" },
  { title: "FAQ & Help", href: "#faq" }
]
