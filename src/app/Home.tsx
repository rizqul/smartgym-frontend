import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Link
        to="/auth/login"
        className="bg-primary hover:bg-primary-hover focus:ring-primary focus:ring-offset-background shadow-primary/25 flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white shadow-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        Menuju Halaman Login
        <ArrowRight
          className="h-4 w-4"
          strokeWidth={2.5}
        />
      </Link>
    </div>
  )
}
