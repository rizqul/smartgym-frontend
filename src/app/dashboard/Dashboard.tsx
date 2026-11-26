import DashboardStatsGrid from "~/components/dashboard/DashboardStatsGrid"
import RecentAttendanceCard from "~/components/dashboard/RecentAttendanceCard"
import RecentTransactionCard from "~/components/dashboard/RecentTransactionCard"
import VisitorTrafficChart from "~/components/dashboard/VisitorTrafficChart"
import { Button } from "~/components/ui/Button"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import useAuth from "~/hooks/useAuth"
import { useGetDashboardChartQuery, useGetDashboardCountQuery, useGetDashboardRecentQuery } from "~/services/dashboard.service"

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"
  const currentYear = new Date().getFullYear()

  const { data: countRes, isLoading: isCountLoading, isError: isCountError, refetch: refetchCount } = useGetDashboardCountQuery()
  const { data: chartRes, isLoading: isChartLoading, refetch: refetchChart } = useGetDashboardChartQuery()
  const { data: recentRes, isLoading: isRecentLoading, isFetching: isRecentFetching, refetch: refetchRecent } = useGetDashboardRecentQuery()

  const isInitialLoading = (isCountLoading || isChartLoading || isRecentLoading) && !countRes

  if (isInitialLoading) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount= {4}
          contentVariant="list"
        />
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-text-primary text-xl font-bold sm:text-2xl">Dashboard Overview</h1>
        <p className="text-text-muted text-[13px] sm:text-[14px]">
          An overview of operational performance, daily visitor traffic, member attendance, and SmartGym transactions.
        </p>
      </div>

      {isCountError && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>Failed to load dashboard statistics.</span>
          <Button
            variant="secondary"
            onClick={() => {
              refetchCount()
              refetchChart()
              refetchRecent()
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      <DashboardStatsGrid
        stats={countRes?.data}
        isAdmin={isAdmin}
        currentYear={currentYear}
      />

      <VisitorTrafficChart
        date={chartRes?.data?.date}
        slots={chartRes?.data?.slots ?? []}
      />

      <div className={`grid grid-cols-1 gap-6 ${isAdmin ? "2xl:grid-cols-2" : ""}`}>
        <RecentAttendanceCard
          attendances={recentRes?.data?.attendanceResponse ?? []}
          isRefreshing={isRecentFetching}
          onRefresh={refetchRecent}
        />

        {isAdmin && <RecentTransactionCard transactions={recentRes?.data?.transactionResponses ?? []} />}
      </div>
    </div>
  )
}
