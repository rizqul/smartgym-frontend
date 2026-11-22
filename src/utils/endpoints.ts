export const API_AUTH_LOGIN = "/auth/login"
export const API_AUTH_LOGOUT = "/auth/logout"
export const API_FORGOT_PASSWORD = "/auth/forgot-password"
export const API_VERIFY_OTP = "/auth/reset-verify"
export const API_RESET_PASSWORD = "/auth/reset-password"

export const API_USER = "/user"
export const API_USER_UPDATE_PROFILE = "/user/profile"
export const API_USER_UPDATE_PASSWORD = "/user/password"

export const API_ADMIN_MEMBERS_LIST = "/admin/dashboard/members"
export const API_ADMIN_STAFF_LIST = "/admin/dashboard/staff"
export const API_ADMIN_MEMBERSHIP_PACKAGE_LIST = "/admin/dashboard/memberships/packages"
export const API_ADMIN_TRAINERS_LIST = "/admin/dashboard/trainers"
export const API_ADMIN_TRANSACTIONS_LIST = "/admin/dashboard/transactions"

export const API_ADMIN_MEMBERS_CREATE = "/admin/dashboard/members/create"
export const API_ADMIN_MEMBERS_OTP = "/admin/dashboard/members/otp"
export const API_ADMIN_STAFF_CREATE = "/admin/dashboard/staff/create"
export const API_ADMIN_MEMBERSHIP_PACKAGE_CREATE = "/admin/dashboard/memberships/packages/create"
export const API_ADMIN_TRAINERS_CREATE = "/admin/dashboard/trainers/create"

export const API_ADMIN_STAFF_DELETE = (id: string) => `/admin/dashboard/staff/delete/${id}`
export const API_ADMIN_MEMBERS_DELETE =  (id: string) =>  `/admin/dashboard/members/delete/${id}`
export const API_ADMIN_MEMBERSHIP_PACKAGE_DELETE = (id: string) => `/admin/dashboard/memberships/packages/delete/${id}`

export const API_ADMIN_STAFF_UPDATE = (id: string) => `/admin/dashboard/staff/update/${id}`

export const API_ADMIN_TRAINERS_SLOT_LIST = (id: string) => `/admin/dashboard/trainers/slot/${id}`
export const API_ADMIN_TRAINERS_SLOT_CREATE = (id: string) => `/admin/dashboard/trainers/slot/create/${id}`

export const API_ADMIN_CHECKIN_LIST = "/admin/dashboard/checkins"
export const API_ADMIN_CHECKIN_SUMMARY = "/admin/dashboard/checkins/summary"
export const API_ADMIN_CHECKIN_QR_TOKEN = "/admin/dashboard/checkins/qr-token"

export const API_STAFF_MEMBERS_LIST = "/staff/dashboard/member"
export const API_STAFF_MEMBERS_OTP = "/staff/dashboard/member/otp"
export const API_STAFF_MEMBERS_CREATE = "/staff/dashboard/member/create"
export const API_STAFF_MEMBERS_DELETE = (id: string) => `/staff/dashboard/member/delete/${id}`

export const API_STAFF_MEMBERSHIP_PACKAGE_LIST = "/staff/dashboard/memberships/packages"

export const API_STAFF_TRAINERS_LIST = "/staff/dashboard/trainers"
export const API_STAFF_TRAINERS_SLOT_LIST = (id: string) => `/staff/dashboard/trainers/slot/${id}`

export const API_STAFF_CHECKIN_QR_TOKEN = "/staff/dashboard/checkins/qr-token"
export const API_STAFF_CHECKIN_CHECKOUT = (memberId: string) => `/staff/dashboard/checkins/${memberId}/checkout`
export const API_ADMIN_CHECKIN_CHECKOUT = (memberId: string) => `/admin/dashboard/checkins/${memberId}/checkout`