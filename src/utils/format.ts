export const formatRupiah = (angka: number): string => {
  return new Intl.NumberFormat("id-ID").format(angka)
}
