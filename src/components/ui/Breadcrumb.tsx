import { Link, useLocation } from "react-router"
import { ChevronRight, Home } from "lucide-react"

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dasbor",
  staffs: "Staf",
  transactions: "Transaksi",
  membership: "Keanggotaan",
  settings: "Pengaturan",
  members: "Anggota",
  attendance: "Kehadiran",
  trainers: "Pelatih",
  create: "Tambah",
  edit: "Ubah"
}

const isIdSegment = (segment: string): boolean => {
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
  )
}

const formatLabel = (segment: string): string => {
  const key = segment.toLowerCase()
  if (SEGMENT_LABELS[key]) return SEGMENT_LABELS[key]

  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export function Breadcrumb() {
  const location = useLocation()
  const rawSegments = location.pathname.split("/").filter(Boolean)

  const items = rawSegments.reduce<Array<{ label: string; routeTo: string }>>((acc, segment, index) => {
    const routeTo = `/${rawSegments.slice(0, index + 1).join("/")}`
    const isLast = index === rawSegments.length - 1

    if (isIdSegment(segment)) {
      if (isLast) {
        acc.push({ label: "Detail", routeTo })
      }
      return acc
    }

    acc.push({ label: formatLabel(segment), routeTo })
    return acc
  }, [])

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-text-muted flex items-center space-x-1 text-[13px] font-medium"
    >
      <Link
        to="/dashboard"
        aria-label="Dasbor"
        className="flex items-center gap-1 transition-colors hover:text-white"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div
            key={item.routeTo}
            className="flex items-center space-x-1"
          >
            <ChevronRight className="h-4 w-4 text-white/20" />
            {isLast ? (
              <span className="text-white">{item.label}</span>
            ) : (
              <Link
                to={item.routeTo}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
