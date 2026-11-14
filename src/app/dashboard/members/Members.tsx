import { ChevronDown, Download, Search, TrendingUp, UserPlus, Users } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { CardStats } from "../../../components/ui/CardStats"
import { Input } from "../../../components/ui/Input"
import { Select } from "../../../components/ui/Select"

export default function ManageMembers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Membership Overview</h1>

      <div className="border-primary/20 mt-8 flex h-400 w-full flex-col gap-6 rounded-2xl border-2 border-dashed p-4">
        {/* header and button */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex w-150 flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">Manajement Member</h2>
            <p className="text-text-muted">
              Kelola data master member, status membership, riwayat dan pendaftaran akun dalam ekosistem SmartGym.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Download />}
            >
              Export Data
            </Button>

            <Button
              variant="primary"
              leftIcon={<UserPlus />}
            >
              Tambah member baru
            </Button>
          </div>
        </div>

        {/* cardStats */}
        <div className="flex w-full gap-2">
          <CardStats
            topIcon={<Users />}
            bottomIcon={<TrendingUp />}
            label="Total terdaftar"
            subLabel="All-Time"
            value={2585}
          />

          <CardStats
            topIcon={<Users />}
            bottomIcon={<TrendingUp />}
            label="Total terdaftar"
            subLabel="All-Time"
            value={2585}
          />
          <CardStats
            topIcon={<Users />}
            bottomIcon={<TrendingUp />}
            label="Total terdaftar"
            subLabel="All-Time"
            value={2585}
          />
          <CardStats
            topIcon={<Users />}
            bottomIcon={<TrendingUp />}
            label="Total terdaftar"
            subLabel="All-Time"
            value={2585}
          />
        </div>

        {/* table */}
        <div className="bg-surface flex flex-col gap-2 rounded-xl p-3">
          <div className="flex gap-2">
            <Input
              rightElement={<Search />}
              placeholder="cari nama member, email, atau ID"
            />

            <Select rightElement={<ChevronDown />}>
              <option
                value=""
                disabled
              >
                Select tier...
              </option>
              <option value="bronze">Bronze Member</option>
              <option value="silver">Silver Member</option>
              <option value="gold">Gold Member</option>
            </Select>
          </div>

          <p>this is table</p>
          <div className="mx-auto w-full overflow-x-auto rounded-md">
            <table className="w-full">
              <thead className="text-center text-sm whitespace-nowrap">
                <tr className="bg-[#282A2E]">
                  <th className="px-4 py-3">member details</th>
                  <th className="px-4 py-3">kontak</th>
                  <th className="px-4 py-3">status akun</th>
                  <th className="px-4 py-3">status membership</th>
                  <th className="px-4 py-3">paket terakhir</th>
                  <th className="px-4 py-3">bergabung</th>
                  <th className="px-4 py-3">action</th>
                </tr>
              </thead>

              <tbody className="text-left text-sm">
                <tr className="bg-[#1A1C20]">
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                </tr>
                <tr className="bg-[#0C0E12]/30">
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                  <td className="px-4 py-3">Dimas pratama</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
