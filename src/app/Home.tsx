import { Link } from "react-router"

export default function Home() {
  return (
    <div className="font-inter">
      <span className="text-2xl text-emerald-700">Ini halaman home</span>

      <Link to="/auth/login">Login</Link>
    </div>
  )
}
