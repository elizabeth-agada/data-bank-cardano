import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center  max-w-3xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            How <span className="text-[#38bdf8]">DataBank</span> Works: Secure & Simple Document Storage
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            DataBank makes document storage effortless, secure, and fully under your control. Follow these simple steps
            to get started:
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Step 1 */}
          <div className="flex gap-4 colspan-1 md:col-span-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-radial from-[#0c1a36] to-[#071024] text-lg font-bold text-white border border-[#1e293b]">
              1
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Connect Your Wallet</h3>
              <p className="text-sm text-gray-400">
                Begin by connecting your wallet easily. Data Wallet is secure DataBank securely without storing
                passwords. Your wallet serves as your secure key to access your documents.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 colspan-1 md:col-span-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-radial from-[#0c1a36] to-[#071024] text-lg font-bold text-white border border-[#1e293b]">
              2
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Upload Your Documents</h3>
              <p className="text-sm text-gray-400">
                Drag and drop your files or select them manually to upload. Choose the document type—whether it&apos;s NFTs,
                assets, or certificates. DataBank securely stores your files public, private, or shared with select
                users.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 colspan-1 md:col-span-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-radial from-[#0c1a36] to-[#071024] text-lg font-bold text-white border border-[#1e293b]">
              3
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Mint as NFTs</h3>
              <p className="text-sm text-gray-400">
                Once uploaded, each document is instantly minted as an NFT, guaranteeing authenticity and preventing
                tampering. The process creates your document&apos;s unique digital signature and provides a certificate of
                ownership that only you control.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 col-span-1 md:col-start-2 md:col-span-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-radial from-[#0c1a36] to-[#071024] text-lg font-bold text-white border border-[#1e293b]">
              4
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Manage & Share Securely</h3>
              <p className="text-sm text-gray-400">
                Access your documents through an intuitive dashboard where you can view, manage, share, and revoke
                access. Share documents via QR codes while controlling who can access your documents.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 col-span-1 md:col-span-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-radial from-[#0c1a36] to-[#071024] text-lg font-bold text-white border border-[#1e293b]">
              5
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-white">Access Anytime, Anywhere</h3>
              <p className="text-sm text-gray-400">
                Enjoy cloud-like access to your encrypted documents with blockchain security. Access your files from any
                device available wherever you need them.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Button className="bg-[#38bdf8] md:px-12 py-6 text-white hover:bg-[#0ea5e9] h-9 rounded-md">Start with DataBank</Button>
        </div>
      </div>
    </section>
  )
}

