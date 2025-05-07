import DocumentStats from "./document-stats";
import StorageStats from "./storage-stats";
import RecentDocuments from "./recent-documents";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen sm:min-h-0 bg-[#040E24] text-white mb-12 sm:mb-0">
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DocumentStats totalDocuments={12000} increase={203.13} />
            <StorageStats used={15} total={30} />
          </div>
          <RecentDocuments />
        </main>
      </div>
    </div>
  );
}