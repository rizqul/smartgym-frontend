export const getInitials = (name?: string | null) => {
  if (!name || !name.trim()) return "U"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export const getAvatarUrl = (name: string, profileUrl?: string | null) => {
  if (profileUrl && profileUrl.trim() !== "") {
    return profileUrl
  }

  const safeName = encodeURIComponent(name || "User")
  return `https://ui-avatars.com/api/?name=${safeName}&background=1C1F26&color=F97316&bold=true`
}