```
src/
├── app/                    # "Pages"
│   ├── auth/               # Halaman terkait autentikasi
│   │   └── Login.tsx
│   ├── admin/              # Halaman spesifik fitur Admin
│   ├── staff/              # Halaman spesifik fitur Staff
│   └── Home.tsx            
│
├── assets/                 # Gambar statis, logo, atau ilustrasi
│
├── components/
│   ├── ui/                 # Atoms & Molecules (Komponen dasar & murni UI)
│   │   ├── Button.tsx      
│   │   ├── Input.tsx       
│   │   ├── Card.tsx        
│   │   ├── Badge.tsx       
│   │   └── Modal.tsx       
│   │
│   ├── forms/              # Molecules/Organisms (Gabungan input + label + validasi)
│   │   ├── LoginForm.tsx
│   │   └── MemberForm.tsx
│   │
│   ├── layout/             
│   │   ├── Sidebar.tsx     # Sidebar dinamis (bisa render menu sesuai role)
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   │
│   └── features/           
│       ├── member/         # (Contoh: MemberTable.tsx, MemberDetailCard.tsx)
│       └── trainer/        # (Contoh: TrainerSlotGrid.tsx)
│
├── hooks/                  # Custom React Hooks (contoh: useAuth, useRole)
│
├── layouts/                # Setara "Templates" (Kerangka layout utama)
│   ├── AuthLayout.tsx      # Layout untuk login
│   └── DashboardLayout.tsx # Layout untuk halaman dalam (membungkus Sidebar & Topbar)
│
├── lib/                    # Konfigurasi library pihak ketiga & utility functions
│   ├── axios.ts            # Setup interceptor untuk request API
│   └── utils.ts            # Fungsi helper (format uang, format tanggal)
│
├── middleware/             # Logic guard untuk route
│   └── web.ts              
│
├── services/               # Pemisahan logic pemanggilan API (Fetch data)
│   ├── auth.service.ts
│   └── member.service.ts
│
├── store/                  # Global state management (Zustand/Redux/Context API)
│   └── authStore.ts        # Menyimpan data user login dan role (Admin/Staff)
│
├── types/                  # Definisi TypeScript Interfaces secara global
│   ├── user.type.ts
│   └── api.type.ts
│
├── app.css                 # Global CSS & Konfigurasi Tailwind (v4)
├── main.tsx                # Entry point React
└── router.tsx              # Konfigurasi react-router
```