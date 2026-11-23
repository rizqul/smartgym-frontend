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
    title: "Dasbor",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
    category: "Ringkasan"
  },
  {
    title: "Manajemen Pengguna",
    icon: Users,
    roles: ["admin", "staff"],
    category: "Manajemen",
    children: [
      {
        title: "Data Anggota",
        path: "/dashboard/members",
        roles: ["admin", "staff"]
      },
      {
        title: "Data Staf",
        path: "/dashboard/staffs",
        roles: ["admin"]
      }
    ]
  },
  {
    title: "Keanggotaan",
    path: "/dashboard/membership",
    icon: CreditCard,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Transaksi",
    path: "/dashboard/transactions",
    icon: ClipboardList,
    roles: ["admin"],
    category: "Manajemen"
  },
  {
    title: "Kehadiran",
    path: "/dashboard/attendance",
    icon: UserCheck,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Data Pelatih",
    path: "/dashboard/trainers",
    icon: UserCircle,
    roles: ["admin", "staff"],
    category: "Manajemen"
  },
  {
    title: "Pengaturan Akun",
    path: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "staff"],
    category: "Sistem"
  }
]

export const landingNavigationMenu: LandingNavItem[] = [
  {
    title: "Beranda",
    href: "#beranda"
  },
  {
    title: "Tentang Kami",
    href: "#fitur"
  },
  {
    title: "Alur Daftar",
    href: "#alur-pendaftaran"
  },
  {
    title: "Keanggotaan",
    href: "#paket"
  },
  {
    title: "Pelatih",
    href: "#trainer"
  },
  {
    title: "FAQ",
    href: "#faq"
  }
]

export const footerEcosystemMenu: FooterNavItem[] = [
  { title: "Aplikasi Anggota", href: "#alur-pendaftaran" },
  { title: "Portal Staf & Admin", to: "/auth/login" },
  { title: "Paket Keanggotaan", href: "#paket" },
  { title: "Pelatih Profesional", href: "#trainer" },
  { title: "FAQ & Bantuan", href: "#faq" }
]
