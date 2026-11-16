import useAuth from "~/hooks/useAuth"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <div className="border-primary/20 mt-8 flex h-400 w-full items-center justify-center rounded-2xl border-2 border-dashed">
        <p className="text-text-muted">test scroll</p>
      </div>
    </div>
  )
}
