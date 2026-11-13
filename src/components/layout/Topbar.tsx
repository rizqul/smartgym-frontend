import { Breadcrumb } from "../ui/Breadcrumb"

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/4 bg-[#1C1F26] px-6">
      <div className="flex items-center gap-4">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="User Avatar"
            className="h-9 w-9 rounded-full border border-white/10 object-cover"
          />
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#1C1F26] bg-[#FACC15]"></div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-0.5 text-[13px] leading-tight font-semibold text-white">Marcus Vance</span>
          <span className="w-fit rounded border border-[#B45309]/30 bg-[#B45309]/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#FDBA74] uppercase">
            Administrator
          </span>
        </div>
      </div>
    </header>
  )
}
