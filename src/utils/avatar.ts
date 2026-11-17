export const getAvatarUrl = (name: string, profileUrl?: string | null) => {
  if (profileUrl && profileUrl.trim() !== "") {
    return profileUrl
  }

  const safeName = encodeURIComponent(name || "User")
  return `https://ui-avatars.com/api/?name=${safeName}&background=1C1F26&color=F97316&bold=true`
}
