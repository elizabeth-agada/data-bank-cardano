import DocumentsPage from "@/components/documents-page"
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout"

export default function Documents() {
  return (
    <DashboardLayout>
      <ProtectedRoute>
        <DocumentsPage />
      </ProtectedRoute>
    </DashboardLayout>
  ) 
}