import { useEffect, useState } from "react"
import { getInitials } from "~/utils/avatar"

interface AvatarProps {
  src?: string | null
  name: string
  className?: string
}

export default function Avatar({ src, name, className = "h-10 w-10 rounded-xl" }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const validSrc = src?.trim()

  if (!validSrc || hasError) {
    return (
      <div
        aria-label={name}
        className={`bg-primary/15 text-primary flex shrink-0 items-center justify-center border border-white/10 text-xs font-bold select-none ${className}`}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={validSrc}
      alt={name}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`shrink-0 border border-white/10 object-cover ${className}`}
    />
  )
}
