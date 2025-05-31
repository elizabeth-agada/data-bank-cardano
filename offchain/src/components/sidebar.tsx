"use client"

import type React from "react"

import { FileText, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import ConnectedWalletCard from "./connected-wallet-card"
import Button from "./button"
import { useState, useRef, useEffect } from "react"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStep, setUploadStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [uploadType, setUploadType] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [redirectPath, setRedirectPath] = useState("")
  const [documentName, setDocumentName] = useState("")

  interface SelectedFile {
    file: File
    name: string
    size: string
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "/img/home.png",
      isImage: true,
    },
    {
      name: "Document",
      href: "/documents",
      icon: "/img/file.png",
      isImage: true,
    },
    {
      name: "NFTs",
      href: "/nft-minting",
      icon: "/img/mint.png",
      isImage: true,
    },
  ]

  // Handle redirection after processing is complete
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
    setUploadStep(1)
    setUploadType("upload")
    setRedirectPath("")
    setDocumentName("")
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget
  }

  const handleFileChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })
        // Set the document name
      const nameWithoutExtension = file.name.split(".").slice(0, -1).join(".")
      setDocumentName(nameWithoutExtension)
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
      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })
      // Set default document name from file name
      const nameWithoutExtension = file.name.split(".").slice(0, -1).join(".")
      setDocumentName(nameWithoutExtension)
      setUploadStep(2)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  const handleUploadSubmit = async () => {
    setUploadStep(3)
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
    }, 10000)
  }

  const closeUploadDialog = () => {
    setUploadStep(0)
    setSelectedFile(null)
    setIsProcessing(false)
    setDocumentName("")
  }

  return (
    <>
      {/* Mobile */}
      {pathname != "/" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#040E24] border-t border-[#1e2d47] z-40 ">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center text-sm font-semibold ${
                    isActive ? "text-[#2B9DDA]" : "text-gray-300"
                  }`}
                >
                  {item.isImage ? (
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              )
            })}
            <div
              className="text-sm font-semibold flex items-center flex-col cursor-pointer py-2 gap-2"
              onClick={handleUploadClick}
            >
              <Upload className="h-5 w-5 mr-2 text-[#2B9DDA]" />
              Upload
            </div>
          </div>
        </div>
      )}

      {/* Desktop */}
      {pathname != "/" && (
        <div className="hidden md:flex w-[240px] bg-[#040E24] border-r border-[#1e2d47] flex-col">
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <div
                    key={item.name}
                    className={`relative ${isActive ? "border-r-2 border-[#2B9DDA] absolute -right-2" : ""}`}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
                        isActive ? "text-[#FFFFFF] bg-[#2B9DDA14]" : "text-gray-300 hover:bg-[#0c1a36]"
                      }`}
                    >
                      {item.isImage ? (
                        <Image
                          src={item.icon || "/placeholder.svg"}
                          alt={item.name}
                          width={20}
                          height={20}
                          className="mr-3 h-5 w-5"
                        />
                      ) : (
                        <FileText className="mr-3 h-5 w-5" />
                      )}
                      {item.name}
                    </Link>
                  </div>
                )
              })}
            </nav>
          </div>
          <div className="p-4">
            <ConnectedWalletCard />
          </div>
        </div>
      )}

      {/* Upload for mobile */}
      {uploadStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#040E24] border border-[#1e2d47] rounded-lg w-full max-w-3xl relative">
            <button
              onClick={closeUploadDialog}
              className="absolute right-3 top-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#1e2d47]"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-white text-center text-base sm:text-lg mb-2 pr-6">
                {uploadStep === 3
                  ? uploadType === "mint"
                    ? "Minting your document"
                    : "Uploading your document"
                  : "Upload your document securely to the blockchain."}
              </h2>

              {uploadStep === 1 && (
                <div
                  className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-4 sm:mt-6 p-4 sm:p-8 md:p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs sm:text-sm text-white text-center mb-4 sm:mb-8">
                      Select your file or drag and drop here
                    </p>
                    <Button
                      variant="primary"
                      className="bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full text-xs sm:text-sm"
                      onClick={handleFileInputClick}
                    >
                      <Image
                        src="/img/cloud-upload.png"
                        alt="Upload"
                        width={24}
                        height={24}
                        className="h-4 w-4 sm:h-6 sm:w-6 mr-2"
                      />
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
                <div className="mt-4 sm:mt-6">
                  <div
                    className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-4 sm:mt-6 p-4 sm:p-8 md:p-12"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs sm:text-sm text-white text-center mb-4 sm:mb-8">
                        Select your file or drag and drop here
                      </p>
                      <Button
                        variant="primary"
                        className="bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full text-xs sm:text-sm"
                        onClick={handleFileInputClick}
                      >
                        <Image
                          src="/img/cloud-upload.png"
                          alt="Upload"
                          width={24}
                          height={24}
                          className="h-4 w-4 sm:h-6 sm:w-6 mr-2"
                        />
                        Re-upload document
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
                  <div className="bg-[#0a1830] p-3 sm:p-4 rounded-lg flex items-center mt-4">
                    <div className="text-[#2B9DDA] mr-2 sm:mr-3 flex-shrink-0">
                      <FileText size={20} className="sm:h-6 sm:w-6 h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[#00D966] font-medium text-xs sm:text-sm truncate">File selected</div>
                      <div className="text-white text-xs sm:text-sm truncate">{selectedFile.name}</div>
                      <div className="text-gray-400 text-xs truncate">{selectedFile.size} MB</div>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter a name for your document"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="w-full bg-transparent border border-[#3A4358] rounded-3xl px-3 py-2 sm:px-4 sm:py-3 mt-4 text-white text-xs sm:text-sm focus:outline-none focus:border-[#2B9DDA]"
                  />

                  <div className="mt-4">
                    <p className="text-white mb-3 sm:mb-4 text-xs sm:text-sm text-center">Select upload type:</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 sm:justify-center">
                      <button
                        type="button"
                        className={`rounded-full px-4 py-2 text-xs sm:text-sm ${
                          uploadType === "upload"
                            ? "bg-[#2B9DDA] text-white"
                            : "bg-[#0C2A49] text-white border border-[#3A4358]"
                        }`}
                        onClick={() => {
                          setUploadType("upload")
                          setRedirectPath("/documents")
                          setTimeout(() => handleUploadSubmit(), 100)
                        }}
                      >
                        Upload only
                      </button>
                      <button
                        type="button"
                        className={`rounded-full px-4 py-2 text-xs sm:text-sm ${
                          uploadType === "mint"
                            ? "bg-[#2B9DDA] text-white"
                            : "bg-[#0C2A49] text-white border border-[#3A4358]"
                        }`}
                        onClick={() => {
                          setUploadType("mint")
                          setRedirectPath("/nft-minting")
                          setTimeout(() => handleUploadSubmit(), 100)
                        }}
                      >
                        Upload and mint as NFT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === 3 && (
                <div className="border border-dashed border-[#3A4358] rounded-lg mt-4 sm:mt-6 p-4 sm:p-8 md:p-12">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-center mb-4 sm:mb-6 text-xs sm:text-sm">
                      {uploadType === "mint"
                        ? "Your document is being minted as an NFT, please relax a little"
                        : "Your document is being uploaded to the blockchain, please relax a little"}
                    </p>

                    <div className="w-full max-w-[200px]">
                      <Image
                        src="/img/load.gif"
                        alt="Loading"
                        height={200}
                        width={200}
                        className="object-contain w-full h-auto"
                      />
                    </div>

                    {!isProcessing && (
                      <p className="text-[#00D966] text-center mt-4 sm:mt-6 text-xs sm:text-sm">
                        {uploadType === "mint"
                          ? `Upload complete! Redirecting to NFT page...`
                          : `Upload complete! Redirecting to documents page...`}
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