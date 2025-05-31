"use client"

import { useState } from "react"
import Button from "@/components/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import DashboardLayout from "@/components/DashboardLayout"

export default function NFTMintingPage() {
  const [activeTab, setActiveTab] = useState("minted")

  const mintedNFTs = [
    {
      id: "1",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "pdf",
      tokenId: "#12346",
      chain: "Ethereum", 
    },

    {
      id: "2",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "pdf",
      tokenId: "#12346",
      chain: "Ethereum", 
    },
    {
      id: "3",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "pdf",
      tokenId: "#12346",
      chain: "Ethereum", 
    },
    {
      id: "4",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "pdf",
      tokenId: "#12346",
      chain: "Ethereum",
    },
    
  ]

  return (
    <DashboardLayout>
      <></>
      <div className="bg-[#040E24]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold text-white">NFT Documents</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#3A4358] mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "minted" ? "text-[#2B9DDA] border-b-2 border-[#2B9DDA]" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("minted")}
            >
              Minted NFTs
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "pending" ? "text-[#2B9DDA] border-b-2 border-[#2B9DDA]" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Mints
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "minted" &&
              mintedNFTs.map((nft) => (
                <div key={nft.id} className=" rounded-lg border border-[#3A4358] overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="">
                        <div className="flex items-center">
                        <div className="p-2 rounded-md mr-3">
                          <Image alt="document" src="/img/document.png" width={40} height={40} />
                        </div>
                        <div className="text-sm">
                          <h3 className="font-medium text-white">{nft.name}</h3>
                          <p className="text-xs text-gray-400">{nft.date}</p>
                          <span className="text-xs">{nft.size}</span>
                          <span className="mx-2">•</span>
                          <span className="text-xs">{nft.type}</span>
                        </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Token ID</p>
                        <p className="text-white">{nft.tokenId}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Chain</p>
                        <p className="text-white">{nft.chain}</p>
                      </div>
                      
                    </div>
                      
                    </div>
                    
                  </div>
                  <div className="px-4 py-3">
                    
                    <div className="mt-3 flex justify-end">
                      <Button variant="primary" className="text-xs h-8 bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full px-4">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === "pending" && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="bg-[#0c1a36] p-8 rounded-lg text-center">
                  <p className="text-white mb-4">No pending NFT mints</p>
                  <p className="text-gray-400 text-sm mb-6">
                    When you mint a document as an NFT, it will appear here during the minting process.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Page no.*/}
          {activeTab === "minted" && mintedNFTs.length > 0 && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                Showing <span className="text-white">1-{mintedNFTs.length}</span> of{" "}
                <span className="text-white">{mintedNFTs.length}</span> NFTs
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 flex items-center justify-center border-[#3A4358] rounded-md"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 flex items-center justify-center border-[#3A4358] rounded-md"
                  disabled
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

