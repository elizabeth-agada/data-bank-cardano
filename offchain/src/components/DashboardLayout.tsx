import type React from "react"
import Sidebar from "./sidebar"
import ClientNavBar from "./clientNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ClientNavBar />
      </div>
      <div className="flex flex-1 pt-16 overflow-y-auto">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </div>
  )
}