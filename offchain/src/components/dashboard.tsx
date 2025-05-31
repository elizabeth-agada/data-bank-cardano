
"use client";
import DocumentStats from "./document-stats";
import StorageStats from "./storage-stats";
import RecentDocuments from "./recent-documents";
import { useWallet } from "@/components/contexts/wallet/WalletContext";

export default function Dashboard() {
    const [walletConnection, setWalletConnection] = useWallet();
    const { address } = walletConnection;
  

  return (
    <div className="flex flex-col min-h-screen sm:min-h-0 bg-[#040E24] text-white mb-12 sm:mb-0">
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DocumentStats userId={address || ""} />
            {/* Storage Stats Widget */}
            {address && (
              <StorageStats 
                userId={address} 
                maxStorage={30} // 30GB max storage
              />
            )}
          </div>
          <RecentDocuments />
        </main>
      </div>
    </div>
  );
}