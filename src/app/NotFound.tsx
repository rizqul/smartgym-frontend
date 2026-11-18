import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"
import { Button } from "~/components/ui/Button"
import logoGym from "~/assets/logo.png"

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/", { replace: true })
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0C10] px-4 py-10 text-center">
      {/* Custom Keyframes untuk animasi gym kebingungan */}
      <style>{`
        @keyframes gymFloat {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(0.82); opacity: 0.2; }
        }
        @keyframes questionFloat {
          0%, 100% { transform: translateY(0px) rotate(-8deg); opacity: 0.5; }
          50% { transform: translateY(-10px) rotate(8deg); opacity: 1; }
        }
        @keyframes eyeLook {
          0%, 40%, 100% { transform: translateX(0px); }
          50%, 90% { transform: translateX(3px); }
        }
        .animate-gym-float {
          animation: gymFloat 3.4s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-shadow-pulse {
          animation: shadowPulse 3.4s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-q-1 {
          animation: questionFloat 2.4s ease-in-out infinite;
        }
        .animate-q-2 {
          animation: questionFloat 2.8s ease-in-out 0.4s infinite;
        }
        .animate-q-3 {
          animation: questionFloat 2.2s ease-in-out 0.8s infinite;
        }
        .animate-eye-look {
          animation: eyeLook 4s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Glow Background */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]/10 blur-[120px]" />

      {/* Logo Header */}
      <div className="relative z-10 mb-6 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#1C1F26] shadow-md">
          <img
            src={logoGym}
            alt="SmartGym Logo"
            className="h-6 w-6 object-contain"
          />
        </div>
        <span className="text-lg font-bold tracking-wide text-white">
          Smart<span className="text-primary">Gym</span>
        </span>
      </div>

      {/* Ilustrasi Animasi: 4 [Kettlebell Kebingungan] 4 */}
      <div className="relative z-10 my-2 flex items-center justify-center gap-2 sm:gap-3">
        <span className="bg-linear-to-b from-white to-white/25 bg-clip-text text-7xl font-black text-transparent select-none sm:text-9xl">
          4
        </span>

        {/* Karakter Kettlebell Kebingungan */}
        <div className="relative h-36 w-36 sm:h-44 sm:w-44">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            {/* Tanda Tanya Melayang */}
            <text
              x="28"
              y="55"
              fill="#F97316"
              fontSize="26"
              fontWeight="800"
              className="animate-q-1"
            >
              ?
            </text>
            <text
              x="158"
              y="48"
              fill="#FDBA74"
              fontSize="22"
              fontWeight="800"
              className="animate-q-2"
            >
              ?
            </text>
            <text
              x="168"
              y="88"
              fill="#F97316"
              fontSize="16"
              fontWeight="700"
              className="animate-q-3"
            >
              ?
            </text>

            {/* Bayangan di lantai */}
            <ellipse
              cx="100"
              cy="176"
              rx="44"
              ry="9"
              fill="#000000"
              className="animate-shadow-pulse"
            />

            {/* Grup Karakter Kettlebell */}
            <g className="animate-gym-float">
              {/* Gagang Kettlebell */}
              <path
                d="M68 78 V58 C68 40 82 32 100 32 C118 32 132 40 132 58 V78"
                stroke="#F97316"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M72 78 V58 C72 44 84 36 100 36 C116 36 128 44 128 58 V78"
                stroke="#FDBA74"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.45"
              />

              {/* Badan Kettlebell */}
              <rect
                x="46"
                y="70"
                width="108"
                height="94"
                rx="46"
                fill="#1C1F26"
                stroke="#F97316"
                strokeWidth="3.5"
              />

              {/* Highlight Kilau */}
              <path
                d="M64 92 C66 84 74 80 82 79"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.2"
              />

              {/* Wajah Kebingungan */}
              <g className="animate-eye-look">
                {/* Mata Kiri (Agak besar) */}
                <circle
                  cx="80"
                  cy="112"
                  r="7.5"
                  fill="white"
                />
                <circle
                  cx="81"
                  cy="112"
                  r="3.5"
                  fill="#0B0C10"
                />

                {/* Mata Kanan (Agak sipit/kecil biar kelihatan bingung) */}
                <circle
                  cx="118"
                  cy="114"
                  r="5.5"
                  fill="white"
                />
                <circle
                  cx="119"
                  cy="114"
                  r="2.8"
                  fill="#0B0C10"
                />
              </g>

              {/* Alis Miring (Ekspresi bingung) */}
              <path
                d="M71 100 Q80 95 88 100"
                stroke="#FDBA74"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M110 104 Q119 102 127 98"
                stroke="#FDBA74"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Mulut Bergelombang */}
              <path
                d="M88 134 Q94 129 100 134 T112 134"
                stroke="#F97316"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Label Berat di Bawah */}
              <text
                x="100"
                y="153"
                textAnchor="middle"
                fill="white"
                opacity="0.35"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1.5"
              >
                404 KG
              </text>
            </g>
          </svg>
        </div>

        <span className="bg-linear-to-b from-white to-white/25 bg-clip-text text-7xl font-black text-transparent select-none sm:text-9xl">
          4
        </span>
      </div>

      {/* Teks Penjelasan */}
      <div className="relative z-10 mt-2 max-w-md">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Waduh, Salah Masuk Ruangan!</h1>
        <p className="text-text-secondary mt-2.5 text-sm leading-relaxed">
          Halaman yang Anda cari sepertinya lagi <span className="font-semibold text-white">rest day</span> atau alamat URL-nya sudah
          berpindah.
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-lg shadow-[#F97316]/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>
    </div>
  )
}
