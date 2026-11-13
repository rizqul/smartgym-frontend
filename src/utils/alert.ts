import Swal from "sweetalert2"

const baseCustomClass = {
  popup: "border border-white/10 rounded-2xl shadow-2xl bg-[#1C1F26]",
  title: "text-xl font-bold text-white",
  htmlContainer: "text-text-secondary text-[14px] mt-2",
  actions: "w-full flex justify-center gap-3 mt-6",
  confirmButton:
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1F26]",
  cancelButton:
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-colors bg-[#2A2D35] text-text-secondary hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-[#1C1F26]"
}

const GymSwal = Swal.mixin({
  background: "#1C1F26",
  color: "#ffffff",
  buttonsStyling: false,
  customClass: baseCustomClass
})

export const Alert = {
  success: (title: string, text?: string) => {
    return GymSwal.fire({
      icon: "success",
      title,
      text,
      customClass: {
        ...baseCustomClass,
        confirmButton: `${baseCustomClass.confirmButton} bg-primary text-white hover:bg-primary-hover focus:ring-primary`
      }
    })
  },

  error: (title: string, text?: string) => {
    return GymSwal.fire({
      icon: "error",
      title,
      text,
      customClass: {
        ...baseCustomClass,
        confirmButton: `${baseCustomClass.confirmButton} bg-danger text-white hover:bg-danger/90 focus:ring-danger`
      }
    })
  },

  confirm: ({
    title,
    text,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    isDanger = false
  }: {
    title: string
    text: string
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
  }) => {
    return GymSwal.fire({
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: {
        ...baseCustomClass,
        confirmButton: `${baseCustomClass.confirmButton} ${
          isDanger
            ? "bg-danger text-white hover:bg-danger/90 focus:ring-danger"
            : "bg-primary text-white hover:bg-primary-hover focus:ring-primary"
        }`
      }
    })
  }
}
