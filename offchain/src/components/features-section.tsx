
export default function FeaturesSection() {
  return (
    <section id="features" className="w-full  py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Unlock the Future of Data Storage With Databank
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Upload documents, convert them to secure NFTs, and manage, share, or verify with privacy control.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 mx-auto max-w-5xl">
          {/* Feature 1: Secure File Upload */}
          <div className="flex flex-col items-center rounded-3xl bg-gradient-radial from-[#0c1a36] to-[#071024] p-8 md:p-12 text-center border border-[#1e293b]">
            <h3 className="mb-3 text-xl font-semibold text-white">Secure File Upload</h3>
            <p className="text-gray-400">
              Upload your document, and it is automatically converted into a secure NFT on the blockchain. This ensures
              ownership, authenticity, and protection from tampering.
            </p>
          </div>

          {/* Feature 2: Share and verify */}
          <div className="flex flex-col items-center rounded-3xl bg-gradient-radial from-[#0c1a36] to-[#071024] p-8 md:p-12 text-center border border-[#1e293b]">
            <h3 className="mb-3 text-xl font-semibold text-white">Share and verify</h3>
            <p className="text-gray-400">
              Generate secure downloadable links or QR codes to provide access to specific recipients. This enables
              quick and reliable third-party verification while keeping your data protected.
            </p>
          </div>

          {/* Feature 3: Privacy & Access */}
          <div className="flex flex-col items-center rounded-3xl bg-gradient-radial from-[#0c1a36] to-[#071024] p-8 md:p-12 text-center border border-[#1e293b]">
            <h3 className="mb-3 text-xl font-semibold text-white">Privacy & Access</h3>
            <p className="text-gray-400">
              Take full control of your documents with advanced privacy settings. Choose who can access, download, or
              verify your files, ensuring complete security and peace of mind.
            </p>
          </div>

          {/* Feature 4: Doc Management */}
          <div className="flex flex-col items-center rounded-3xl bg-gradient-radial from-[#0c1a36] to-[#071024] p-8 md:p-12 text-center border border-[#1e293b]">
            <h3 className="mb-3 text-xl font-semibold text-white">Doc Management</h3>
            <p className="text-gray-400">
              Manage your documents seamlessly through an intuitive dashboard. View, organize, and retrieve your files
              effortlessly in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

