export const getDashboardPrefix = (role?: string) => {
  return role?.toUpperCase() === "STAFF" ? "/staff/dashboard" : "/admin/dashboard"
}
