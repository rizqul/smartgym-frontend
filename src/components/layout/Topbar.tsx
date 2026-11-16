import { Breadcrumb } from "../ui/Breadcrumb"

export function Topbar() {

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-white/4 bg-[#1C1F26] px-6">
      <div className="flex items-center gap-4">
        <Breadcrumb />
      </div>
    </header>
  )
}
