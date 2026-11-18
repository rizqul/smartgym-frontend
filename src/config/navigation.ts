import { LayoutDashboard, Users, CreditCard, ClipboardList, UserCheck, UserCircle, Settings, type LucideIcon } from "lucide-react"

export type UserRole = "admin" | "staff"
export type MenuCategory = "Overview" | "Management" | "System"

export interface NavItem {
  title: string
  path?: string
  icon?: LucideIcon
  roles: UserRole[]
  children?: NavItem[]
  category?: MenuCategory
}

export const navigationMenu: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
    category: "Overview"
  },
  {
    title: "Manajemen User",
    icon: Users,
    roles: ["admin", "staff"],
    category: "Management",
    children: [
      {
        title: "Manajemen Member",
        path: "/dashboard/members",
        roles: ["admin", "staff"]
      },
      {
        title: "Manajemen Staff",
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
    category: "Management"
  },
  {
    title: "Transaksi",
    path: "/dashboard/transactions",
    icon: ClipboardList,
    roles: ["admin"],
    category: "Management"
  },
  {
    title: "Kehadiran",
    path: "/dashboard/attendance",
    icon: UserCheck,
    roles: ["admin", "staff"],
    category: "Management"
  },
  {
    title: "Data Trainer",
    path: "/dashboard/trainers",
    icon: UserCircle,
    roles: ["admin", "staff"],
    category: "Management"
  },
  {
    title: "Pengaturan Akun",
    path: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "staff"],
    category: "System"
  }
]
