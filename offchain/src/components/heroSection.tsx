import Image from "next/image"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic";
import DisconnectButton from "@/components/DisconnectButton";
import { useWallet } from "@/components/contexts/wallet/WalletContext"

export default function HeroSection() {
    const WalletConnectors = dynamic(() => import("./WalletConnectors"), { ssr: false });
    const [walletConnection, setWalletConnection] = useWallet();
    const { address } = walletConnection;
      
    return (
        <div id="home" className="relative w-full overflow-hidden pt-10 md:pt-24 pb-0">
            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    {/* Heading with Gradient */}
                    <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ">
                        <span className="bg-gradient-to-b from-white via-white to-[#38bdf8] bg-clip-text text-transparent">Secure your document</span>
                        <br />
                        <span className="bg-gradient-to-b from-white to-[#38bdf8] bg-clip-text text-transparent">
                            With Blockchain Technology
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="mt-6 max-w-2xl text-center text-lg text-gray-400">
                        Our platform offers decentralized, private, and immutable document storage, ensuring your data is safe and
                        fully under your control
                    </p>

                    {/* CTA Buttons */}
                    {address ? (
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <DisconnectButton />
                            </div>
                        ) : (
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <WalletConnectors/>
                            </div>
                        )
                    }


                    {/* App Screenshot - Half Cropped */}
                    <div className="mt-16 w-full max-w-4xl relative rounded-lg overflow-hidden">
                        <Image
                            src="/img/heroImage.png"
                            alt="DataBank App Screenshot"
                            width={1000}
                            height={500}
                            layout="responsive"
                            objectFit="cover"
                            className="rounded-lg ml-5 md:ml-8 lg:ml-5"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

