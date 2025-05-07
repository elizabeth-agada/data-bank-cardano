import Link from "next/link"
import Image from "next/image"
import { Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="w-full bg-[#020817] py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Logo and Description */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <Image src="/img/logo.png" alt="DataBank" width={200} height={200} className="h-6 w-auto" />
                        </Link>

                        <p className="text-gray-400 max-w-md">
                            Data-Bank is a secure, decentralized document storage solution that transforms your important files into
                            verifiable NFTs. Enjoy immutable, tamper-proof storage with complete control over your digital assets.
                        </p>

                        <div className="flex space-x-4 pt-2">
                            <Link href="#" className="bg-[#1a2436] p-2 rounded-md hover:bg-[#2a3446] transition-colors">
                                <Twitter className="h-5 w-5 text-[#38bdf8]" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Quick Links */}
                    <div className="md:pl-12">
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#home" className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#features" className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link href="#faq" className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#about-us" className="text-gray-400 hover:text-[#38bdf8] transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-4 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2024 Data-Bank. Empowering secure, decentralized document storage.
                </div>
            </div>
        </footer>
    )
}

