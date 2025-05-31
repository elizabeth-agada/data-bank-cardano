"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Button from "./button"
import { Upload, Search, FileText, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import DisconnectButton from "@/components/DisconnectButton"
import { useWallet } from "@/components/contexts/wallet/WalletContext"
import { useDocumentUpload } from "./useDataBank" // Adjust import path based on where you place the hook
import toast from "react-hot-toast"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isDocumentsPage = pathname === "/documents"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStep, setUploadStep] = useState(0)
  
  // Get wallet connection
  const [walletConnection, setWalletConnection] = useWallet();
  const { address } = walletConnection;
  const { uploadToIpfs, isUploading } = useDocumentUpload(walletConnection)
  
  interface SelectedFile {
    file: File
    name: string
    size: string
  }

  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [uploadType, setUploadType] = useState<"upload" | "mint">("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [redirectPath, setRedirectPath] = useState("")

  // Handle the actual upload/mint process
  const handleRealUploadWithType = async (type: "upload" | "mint") => {
    if (!selectedFile || !documentName.trim()) {
      toast.error("Please select a file and enter a document name")
      return
    }
  
    if (!walletConnection.address) {
      toast.error("Please connect your wallet first")
      return
    }
  
    setIsProcessing(true)
    
    try {
      // Use the passed type parameter instead of uploadType state
      const result = await uploadToIpfs(
        selectedFile.file,
        documentName,
        type, // Use the parameter here
        walletConnection
      )
      
      if (result) {
        toast.success(
          type === 'mint' 
            ? "Document minted successfully!" 
            : "Document uploaded successfully!"
        )
        
        // Set redirect path based on the passed type
        const path = type === 'mint' ? '/nft-minting' : '/documents'
        setRedirectPath(path)
        
        setIsProcessing(false)
        
        setTimeout(() => {
          closeUploadDialog()
          router.push(path)
        }, 2000)
      } else {
        toast.error("Upload failed. Please try again.")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Upload failed: ${error}`)
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (!isProcessing && redirectPath && uploadStep === 3) {
      const timer = setTimeout(() => {
        closeUploadDialog()
        router.push(redirectPath)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isProcessing, redirectPath, uploadStep, router])

  const handleUploadClick = () => {
    // Check wallet connection first
    if (!walletConnection.address) {
      toast.error("Please connect your wallet first")
      return
    }
    
    setUploadStep(1)
    setUploadType("upload")
    setRedirectPath("")
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  // Helper function to get file name without extension
  const getFileNameWithoutExtension = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, "")
  }

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget
  }

  const handleFileChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please select a valid file type (PDF, DOC, DOCX, JPG, JPEG, PNG)")
        return
      }
      
      // Validate file size (e.g., max 10MB)
      const maxSizeInMB = 10
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB`)
        return
      }
      
      const fileNameWithoutExt = getFileNameWithoutExtension(file.name)

      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })

      // Set the document name without extension
      setDocumentName(fileNameWithoutExt)
      setUploadStep(2)
    }
  }

  interface DropEvent extends React.DragEvent<HTMLDivElement> {
    dataTransfer: DataTransfer & {
      files: FileList
    }
  }

  const handleDrop = (e: DropEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please select a valid file type (PDF, DOC, DOCX, JPG, JPEG, PNG)")
        return
      }
      
      // Validate file size (e.g., max 10MB)
      const maxSizeInMB = 10
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeInMB}MB`)
        return
      }
      
      const fileNameWithoutExt = getFileNameWithoutExtension(file.name)

      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })

      // Set the document name without extension
      setDocumentName(fileNameWithoutExt)
      setUploadStep(2)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  const handleUploadTypeSelection = async (type: "upload" | "mint") => {
    setUploadType(type)
    setUploadStep(3)
    
    // Pass the type directly to avoid stale state
    await handleRealUploadWithType(type)
  }
  

  const closeUploadDialog = () => {
    setUploadStep(0)
    setSelectedFile(null)
    setDocumentName("")
    setIsProcessing(false)
    setRedirectPath("")
  }

  // Validation for document name
  const isValidDocumentName = (name: string) => {
    return name.trim().length > 0 && name.length <= 28 && /^[a-zA-Z0-9_\s]+$/.test(name)
  }

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#040E24] border-b border-[#1e2d47]">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/img/logo.png" alt="DataBank" width={200} height={200} className="h-6 w-auto" />
          </Link>
          {isDocumentsPage && (
            <div className="hidden sm:flex justify-start items-center border border-[#3A4358] rounded-full sm:pr-24 px-4 py-1.5 sm:ml-32">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Document"
                className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none ml-2 w-full"
              />
            </div>
          )}
        </div>
        <div className="flex justify-start items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="h-9 text-sm font-medium border-[#3A4358] hover:bg-[#0c1a36] hidden sm:flex rounded-full"
            onClick={handleUploadClick}
            disabled={!walletConnection.address}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          {/* Mobile upload button */}
          <Button
            variant="outline"
            className="h-9 w-9 p-0 flex items-center justify-center sm:hidden border-[#3A4358] hover:bg-[#0c1a36] rounded-full"
            onClick={handleUploadClick}
            disabled={!walletConnection.address}
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload Document</span>
          </Button>
          <DisconnectButton />
        </div>
      </header>

      {/* Upload Dialog */}
      {uploadStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#040E24] border border-[#1e2d47] rounded-lg w-full max-w-3xl relative">
            <button
              onClick={closeUploadDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#1e2d47] transition-colors"
              aria-label="Close"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-4 sm:p-8">
              <h2 className="text-white text-center text-lg mb-2 pr-8">
                {uploadStep === 3
                  ? uploadType === "mint"
                    ? "Minting your document as NFT"
                    : "Uploading your document to IPFS"
                  : "Upload your document securely to the blockchain."}
              </h2>

              {uploadStep === 1 && (
                <div
                  className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-6 p-6 sm:p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-white text-center mb-8">Select your file or drag and drop here</p>
                    <p className="text-xs text-gray-400 text-center mb-4">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)</p>
                    <Button
                      variant="primary"
                      className="bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full"
                      onClick={handleFileInputClick}
                    >
                      <Image src="/img/cloud-upload.png" alt="Upload" width={24} height={24} className="h-6 w-6 mr-2" />
                      Upload document
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              )}

              {uploadStep === 2 && selectedFile && (
                <div className="mt-6">
                  <div className="bg-[#0a1830] p-4 rounded-lg flex items-center mb-4">
                    <div className="text-[#2B9DDA] mr-3">
                      <FileText size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[#00D966] font-medium">File selected</div>
                      <div className="text-white truncate">{selectedFile.name}</div>
                      <div className="text-gray-400 text-sm">{selectedFile.size} MB</div>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter a name for your document (max 28 characters)"
                    className={`w-full bg-transparent border rounded-3xl px-4 py-3 mt-4 text-white focus:outline-none ${
                      isValidDocumentName(documentName) 
                        ? "border-[#3A4358] focus:border-[#2B9DDA]" 
                        : "border-red-500 focus:border-red-500"
                    }`}
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    maxLength={28}
                  />
                  {documentName && !isValidDocumentName(documentName) && (
                    <p className="text-red-400 text-sm mt-1">
                      Name must be 1-28 characters and contain only letters, numbers, underscores, and spaces
                    </p>
                  )}

                  <div className="mt-6">
                    <p className="text-white mb-4 text-center sm:text-left">Select upload type:</p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                      <button
                        type="button"
                        className="rounded-full px-6 py-2 bg-[#0C2A49] text-white border border-[#3A4358] hover:bg-[#2B9DDA] hover:border-[#2B9DDA] transition-colors"
                        onClick={() => handleUploadTypeSelection("upload")}
                        disabled={!isValidDocumentName(documentName)}
                      >
                        Upload to IPFS only
                      </button>
                      <button
                        type="button"
                        className="rounded-full px-6 py-2 bg-[#0C2A49] text-white border border-[#3A4358] hover:bg-[#2B9DDA] hover:border-[#2B9DDA] transition-colors"
                        onClick={() => handleUploadTypeSelection("mint")}
                        disabled={!isValidDocumentName(documentName)}
                      >
                        Upload and mint as NFT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === 3 && (
                <div className="border border-dashed border-[#3A4358] rounded-lg mt-6 p-6 sm:p-12">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-center mb-6">
                      {uploadType === "mint"
                        ? "Your document is being uploaded to IPFS and minted as an NFT..."
                        : "Your document is being uploaded to IPFS..."}
                    </p>

                    <div className="">
                      <Image src="/img/load.gif" alt="Loading" height={200} width={200} className="object-contain" />
                    </div>

                    {!isProcessing && !isUploading && (
                      <p className="text-[#00D966] text-center mt-6">
                        {uploadType === "mint"
                          ? `Document minted successfully! Redirecting to NFT page...`
                          : `Document uploaded successfully! Redirecting to documents page...`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}