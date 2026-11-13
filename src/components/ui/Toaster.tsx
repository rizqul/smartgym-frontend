import { Toaster as HotToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1C1F26",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          fontSize: "13px",
          fontWeight: 500
        },
        success: {
          iconTheme: { primary: "#10B981", secondary: "#fff" }
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#fff" }
        }
      }}
    />
  )
}
