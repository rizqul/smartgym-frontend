export interface MemberData {
  id: string
  name: string
  avatar?: string
  initials?: string
  avatarBg?: string
  email: string
  phone: string
  accountStatus: "Active" | "Inactive"
  membershipStatus: "Active Pass" | "Suspended"
  package: string
  expDate: string
  joinDate: string
}

export const MOCK_MEMBERS: MemberData[] = [
  {
    id: "#SG-2024-001",
    name: "Dimas Pratama",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80",
    email: "dimas.pratama@gmail.com",
    phone: "+62 812-4456-9921",
    accountStatus: "Active",
    membershipStatus: "Active Pass",
    package: "Annual Pro",
    expDate: "Exp: 14 Jan 2025",
    joinDate: "14 Jan 2024"
  },
  {
    id: "#SG-2024-089",
    name: "Reza Firmansyah",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80",
    email: "reza.firmansyah92@gmail.com",
    phone: "+62 878-5521-7789",
    accountStatus: "Inactive",
    membershipStatus: "Suspended",
    package: "Quarterly Beast",
    expDate: "Suspended by Admin",
    joinDate: "19 Mar 2024"
  },
  {
    id: "#SG-2024-210",
    name: "Budi Santoso",
    initials: "BS",
    avatarBg: "bg-blue-900/40 text-blue-400",
    email: "budi.santoso@corporate.id",
    phone: "+62 821-9988-1209",
    accountStatus: "Active",
    membershipStatus: "Active Pass",
    package: "Monthly Flex",
    expDate: "Exp: 28 Mei 2024",
    joinDate: "28 Apr 2024"
  },
  {
    id: "#SG-2024-295",
    name: "Kevin Wijaya",
    initials: "KW",
    avatarBg: "bg-yellow-900/40 text-yellow-500",
    email: "kevin.wijaya@student.ac.id",
    phone: "+62 899-7712-3345",
    accountStatus: "Active",
    membershipStatus: "Active Pass",
    package: "Quarterly Beast",
    expDate: "Exp: 02 Agu 2024",
    joinDate: "02 Mei 2024"
  }
]
