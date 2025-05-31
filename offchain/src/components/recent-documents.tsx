"use client";

import { MoreVertical } from "lucide-react"
import Image from "next/image"
import Button from "./button"
import { useRecentDocuments, RecentDocument } from "@/hooks/read/useRecentDocuments"
import { Skeleton } from "@/components/ui/skeleton"
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAlt } from 'react-icons/fa';

export default function RecentDocuments() {
  const { documents, isLoading, error } = useRecentDocuments(6);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        <Button variant="link" className="text-[#2B9DDA] hover:text-[#2589c2]">
          <h2 className="bg-[#071A32] p-2 rounded-full">
            See All
          </h2>
        </Button>
      </div>
      
      {error && (
        <div className="text-red-500 p-4 bg-[#040E24] rounded-lg">
          Failed to load documents. Please try again later.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show loading skeletons
          Array(6).fill(0).map((_, index) => (
            <DocumentCardSkeleton key={index} />
          ))
        ) : documents.length > 0 ? (
          // Show documents
          documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))
        ) : (
          // Show empty state
          <div className="col-span-3 text-center py-10 bg-[#040E24] rounded-lg">
            <p className="text-gray-400">No recent documents found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: RecentDocument }) {
  return (
    <div className="bg-[#040E24] rounded-2xl border border-[#3A4358] overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
          <div className="bg-[#071A32] p-2 rounded-md mr-3">
            {getFileIconByType(document.type)}
          </div>
            <div>
              <h3 className="font-medium">{document.name}</h3>
              <p className="text-xs text-gray-400">{document.date}</p>
              <div className="flex items-center text-xs text-gray-400">
                <span>{document.size}</span>
                <span className="mx-2">•</span>
                <span>{document.type}</span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#3A4358]">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
        <div className="py-6">
          <div className="">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Document Status</h2>
              <button className="text-[#2B9DDA] bg-[#071A32] p-2 hover:text-[#2589c2] hover:bg-[#3A4358] px-3 py-1 h-7 text-xs rounded-full flex items-center">
                <Image
                  src="/img/share.png"
                  alt="Share"
                  width={16}
                  height={16}
                  className="h-4 w-4 mr-1"
                />
                View
              </button>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentCardSkeleton() {
  return (
    <div className="bg-[#040E24] rounded-2xl border border-[#3A4358] overflow-hidden p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Skeleton className="h-16 w-16 rounded-md mr-3 bg-[#071A32]" />
          <div>
            <Skeleton className="h-5 w-32 mb-2 bg-[#071A32]" />
            <Skeleton className="h-3 w-24 mb-2 bg-[#071A32]" />
            <Skeleton className="h-3 w-20 bg-[#071A32]" />
          </div>
        </div>
        <Skeleton className="h-6 w-6 rounded-md bg-[#071A32]" />
      </div>
      
      <div className="py-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-24 bg-[#071A32]" />
          <Skeleton className="h-7 w-16 rounded-full bg-[#071A32]" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-6 w-20 rounded-full bg-[#071A32]" />
        </div>
      </div>
    </div>
  )
}

// Helper function to get the appropriate icon based on file type
function getFileIconByType(type: string) {
  const fileType = type.toLowerCase();

  if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500 w-6 h-6" />;
  if (fileType.includes('doc') || fileType.includes('word')) return <FaFileWord className="text-blue-500 w-6 h-6" />;
  if (fileType.includes('xls') || fileType.includes('sheet')) return <FaFileExcel className="text-green-500 w-6 h-6" />;
  if (fileType.includes('ppt') || fileType.includes('presentation')) return <FaFilePowerpoint className="text-orange-500 w-6 h-6" />;
  if (fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png') || fileType.includes('gif')) return <FaFileImage className="text-yellow-500 w-6 h-6" />;

  return <FaFileAlt className="text-gray-400 w-6 h-6" />; // Default icon
}