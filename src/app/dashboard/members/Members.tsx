import { ChevronDown, Download, Search, TrendingUp, UserPlus, Users } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { CardStats } from "../../../components/ui/CardStats"
import { Input } from "../../../components/ui/Input"
import { Select } from "../../../components/ui/Select"
import Table from "../../../components/ui/Table"
import TableHead from "../../../components/ui/TableHead"
import TableTR from "../../../components/ui/TableTR"
import TableTH from "../../../components/ui/TableTH"
import TableTD from "../../../components/ui/TableTD"

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
          <Table>
            <TableHead>
              <TableTR
                isEven={2 % 2 == 0}
                isHeader={true}
              >
                <TableTH>tes</TableTH>
                <TableTH>
                  <span>tes</span>
                </TableTH>
                <TableTH>
                  <span>tes</span>
                </TableTH>
              </TableTR>
              <TableTR isEven={3 % 2 == 0}>
                <TableTD>ini</TableTD>
                <TableTD>ini</TableTD>
                <TableTD>ini</TableTD>
              </TableTR>
            </TableHead>
          </Table>
        </div>
      </div>
    </div>
  )
}
