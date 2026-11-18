import * as z from "zod"

const name = z
  .string()
  .trim()
  .min(1, "Nama lengkap tidak boleh kosong.")
  .max(100, "Nama lengkap maksimal 100 karakter.")

const email = z
  .string()
  .trim()
  .min(1, "Alamat email wajib diisi.")
  .email("Format email tidak valid (contoh: user@gymmick.my.id).")

const password = z
  .string()
  .min(8, "Kata sandi minimal harus 8 karakter.")

const passwordConfirmation = z
  .string()
  .min(1, "Konfirmasi kata sandi tidak boleh kosong.")

const remember = z.boolean().optional()

const code = z
  .string()
  .min(1, "Kode OTP wajib diisi.")
  .length(6, "Kode OTP harus tepat 6 digit.")
  .regex(/^\d+$/, "Kode OTP hanya boleh berisi kombinasi angka.")

const avatar = z
  .any()
  .refine(
    (value) =>
      value === undefined ||
      value === null ||
      value instanceof FileList ||
      typeof value === "string",
    {
      message: "Harap unggah file gambar yang valid."
    }
  )
  .optional()

const packageName = z
  .string()
  .trim()
  .min(1, "Nama paket tidak boleh kosong.")
  .max(100, "Nama paket maksimal 100 karakter.")

const description = z
  .string()
  .trim()
  .min(1, "Deskripsi wajib diisi.")

const price = z.coerce
  .number()
  .min(0, "Harga wajib diisi dan tidak boleh negatif.")

const duration = z.coerce
  .number()
  .min(1, "Durasi masa aktif wajib diisi (minimal 1 hari).")

export { avatar, code, email, name, password, passwordConfirmation, remember, packageName, description, price, duration }
