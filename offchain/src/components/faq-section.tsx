"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

type FAQItem = {
  id: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: "01",
    question: "What is Data-Bank?",
    answer:
      "Data-Bank is a decentralized document storage platform that leverages blockchain technology to secure your critical documents by converting them into NFTs. It enables you to store, manage, and share digital assets such as IDs, passports, and certificates with verifiable authenticity and permanence.",
  },
  {
    id: "02",
    question: "How are my documents secured?",
    answer:
      "Each document you upload is minted as an NFT on the blockchain, ensuring it remains immutable and tamper-proof. This process uses advanced encryption and decentralized storage. In short, once your document is stored, its authenticity and integrity are guaranteed without relying on a single point of failure.",
  },
  {
    id: "03",
    question: "Which wallets are supported?",
    answer:
      "Data-Bank integrates seamlessly with Algorand-based wallets like Pera Wallet. This allows you to securely connect to the platform manage your digital identity, and handle document transactions without traditional password logins, enhancing both security and user experience.",
  },
  {
    id: "04",
    question: "Can I share my documents?",
    answer:
      "Absolutely. Data-Bank offers flexible sharing options through secure links or QR codes. You can customize access permissions to control who can view or edit your documents, ensuring that while your data remains private and secure, you still have the ability to collaborate or provide verified access when needed.",
  },
]

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

  return (
    <>
    <section id="faq" className="w-full py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Data-Bank FAQ: Your Guide to Secure, Decentralized Document Storage
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-md">
              {/* Accordion Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between bg-[#020817] p-4 text-left text-white transition-all hover:bg-[#0f1a30] border border-[#1e293b]"
              >
                <div className="flex items-center">
                  <span className="mr-4 text-lg font-medium text-[#38bdf8] flex h-8 w-8 items-center justify-center rounded bg-[#1a2436]">{item.id}</span>
                  <span className="text-lg font-medium">{item.question}</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1a2436]">
                  {openItem === item.id ? (
                    <Minus className="h-5 w-5 text-[#38bdf8]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#38bdf8]" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItem === item.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="bg-[#0c1425] p-4 pl-16 text-gray-400">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="about-us" className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Data-Bank: Revolutionizing Secure Document Storage
          </h2>
          <p className="text-lg text-gray-400">
            Data-Bank is a secure blockchain-based document storage solution that helps you organize and manage your
            critical documents with ease. Experience the future of document storage and take control of your digital
            assets.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}

