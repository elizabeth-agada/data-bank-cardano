"use client"

import { MoreHorizontal, File, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase } from '@/utils/supabase';
import { useWallet } from "@/components/contexts/wallet/WalletContext";

type Document = {
  id: string
  name: string
  date: string
  type: string
  size: string
  status: string
}

export default function DocumentTable() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { address } = walletConnection;
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)
  const [useDateRange, setUseDateRange] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '2023-02-14', end: '2023-03-14' })

  // if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fetch documents from Supabase
  useEffect(() => {
    async function fetchDocuments() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Adjust the table name and columns according to your Supabase schema
        let query = supabase
          .from('documents')
          .select('*')
          .eq('owner_address', address) // Filter by the user's address
        
        // Only apply date range if it's being used
        if (useDateRange) {
          setDateRange({start: '2023-02-14', end: '2023-03-14'})
          query = query
            .gte('created_at', dateRange.start)
            .lte('created_at', dateRange.end)
        }
        
        const { data, error } = await query
        
        if (error) {
          throw error
        }
        
        if (data) {
          // Transform the data to match our Document type
          const formattedDocs = data.map(doc => ({
            id: doc.document_hash,
            name: doc.document_name || 'Unnamed Document',
            // Format date from ISO string to MM/DD/YYYY
            date: new Date(doc.created_at).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            }),
            type: doc.document_type || 'Unknown',
            size: formatFileSize(doc.document_size || 0),
            status: doc.status
          }))
          
          setDocuments(formattedDocs)
        }
      } catch (err) {
        console.error('Error fetching documents:', err)
        setError('Failed to load documents. Please try again later.')
      } finally {
        // Add a small delay to prevent flickering if the data loads very quickly
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }
    
    fetchDocuments()
  }, [address, dateRange, useDateRange])

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return <Image src="/img/document.png" alt="pdf" width={20} height={20} />
      case "SVG":
        return <Image src="/img/document.png" alt="svg" width={20} height={20} />
      case "DOCX":
      case "DOC":
        return <Image src="/img/document.png" alt="doc" width={20} height={20} />
      default:
        return <File className="h-4 w-4 text-[#2B9DDA]" />
    }
  }

  const toggleDateRange = () => {
    setUseDateRange(!useDateRange)
  }

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <div className="relative mb-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/https___lottiefiles.com_animations_loading-40-paperplane-pXSmJB5J2C-puFEjFkAAYpUzlBWYX3LAfv8XXvQNb.gif"
          alt="Loading animation" width={100} height={100}
          className="w-full h-full object-contain" 
        />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-medium text-white mb-2">Your documents are being fetched, please relax a little</h2>
        <p className="text-gray-400 text-sm">fetching documents...</p>
      </div>
    </div>
  )

  const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <div className="text-center">
        <h2 className="text-xl font-medium text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-red-400 text-sm mb-4">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-[#2B9DDA] text-white rounded-md hover:bg-[#2589c2] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[40vh] w-full">
      <div className="text-center">
        <h2 className="text-xl font-medium text-white mb-2">No documents found</h2>
        <p className="text-gray-400 text-sm">Try adjusting your search or date range</p>
      </div>
    </div>
  )

  // Mobile
  const MobileDocumentCard = ({ doc, index }: { doc: Document; index: number }) => (
    <div key={index} className="bg-[#071A32A3] border border-[#242D40] rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full">{getFileIcon(doc.type)}</div>
          <span className="text-sm font-medium">{doc.name}</span>
        </div>
        <button className="p-1 hover:bg-[#1a2235] rounded-md transition-colors group">
          <MoreHorizontal className="h-4 w-4 text-gray-400 group-hover:text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400">DATE</p>
          <p>{doc.date}</p>
        </div>
        <div>
          <p className="text-gray-400">DOC TYPE</p>
          <span className="bg-[#6278A71F] px-2 py-0.5 rounded-full text-xs text-gray-300 inline-block mt-1">
            {doc.type}
          </span>
        </div>
        <div>
          <p className="text-gray-400">SIZE</p>
          <p>{doc.size}</p>
        </div>
        <div>
          <p className="text-gray-400">STATUS</p>
          <span className={`text-xs ${doc.status === "MINTED" ? "text-[#47A663]" : "text-[#F94F59]"}`}>
            {doc.status}
          </span>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="h-full w-full pb-20 md:pb-6">
      <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl font-semibold">All Documents</h1>
        
        {/* Date Filter Toggle */}
        <div className="flex items-center space-x-3">
          {useDateRange && (
            <div className="flex items-center space-x-2 text-sm bg-[#071A32A3] border border-[#242D40] text-gray-400 p-1 sm:px-3 py-1.5 rounded-full">
              <Image src="/img/calendar.png" alt="" width={2} height={2} className="h-2 w-2 sm:h-4 sm:w-4" />
              <h2 className="text-xs sm:text-base">Feb 14 - Mar 14</h2>
            </div>
          )}
          <button 
            onClick={toggleDateRange} 
            className={`px-3 py-1.5 rounded-full text-xs border ${useDateRange ? 'bg-[#2B9DDA] text-white border-transparent' : 'bg-transparent text-gray-400 border-[#242D40]'}`}
          >
            {useDateRange ? 'Clear Date Filter' : 'Add Date Filter'}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {isMobile && (
        <div className="md:hidden w-full space-y-3 sm:space-y-0">
          <div className="flex justify-start items-center border border-[#3A4358] rounded-full sm:pr-24 px-4 py-1.5 sm:ml-32">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Document"
              className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none ml-2 w-full"
            />
          </div>
          
          {documents.length === 0 ? (
            <EmptyState />
          ) : (
            documents.map((doc, index) => (
              <MobileDocumentCard key={doc.id || index} doc={doc} index={index} />
            ))
          )}
        </div>
      )}

      {/* Desktop */}
      <div className={`${isMobile ? "hidden" : "block"} overflow-x-auto rounded-2xl border border-[#242D40]`}>
        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#040E24]">
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">DOCUMENT</th>
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">DATE</th>
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">DOC TYPE</th>
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">SIZE</th>
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">STATUS</th>
                <th className="text-left py-4 px-6 text-xs text-gray-400 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={doc.id || index}
                  className="border-b border-[#0c0f14] last:border-b-0 hover:bg-[#0c1a36] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full">{getFileIcon(doc.type)}</div>
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{doc.date}</td>
                  <td className="py-4 px-6">
                    <span className="bg-[#6278A71F] px-3 py-1 rounded-full text-xs text-gray-300">{doc.type}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{doc.size}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm ${doc.status === "MINTED" ? "text-green-500" : "text-red-500"}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-1 hover:bg-[#1a2235] rounded-md transition-colors group">
                      <MoreHorizontal className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}