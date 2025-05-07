import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
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
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button className="bg-[#38bdf8] md:px-12 py-6 text-white hover:bg-[#0ea5e9] h-9 rounded-full">Connect wallet</Button>
                        <Button variant="outline" className="border-white md:px-12 py-6 text-white hover:bg-gray-800 bg-[#020817] h-9 rounded-full">
                            Learn more
                        </Button>
                    </div>

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

