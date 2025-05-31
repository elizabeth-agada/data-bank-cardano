import Dashboard from "../../components/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout"

export default function HomePage() {
  
  return (
  <DashboardLayout>
    <ProtectedRoute>
    <Dashboard />;
    </ProtectedRoute>
  </DashboardLayout>
  )
  
}