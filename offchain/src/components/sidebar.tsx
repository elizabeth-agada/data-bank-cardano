"use client";

import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ConnectedWalletCard from "./connected-wallet-card";
import Button from "./button";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
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
      name: "NFT Minting",
      href: "/nft-minting",
      icon: "/img/mint.png",
      isImage: true,
    }
  ];

  return (
    <>
     {/* Mobile */}
      { pathname != "/" && <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#040E24] border-t border-[#1e2d47] z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
            );
          })}
          <Button
            variant="outline" 
            className="h-9 text-sm font-medium border-[#3A4358] hover:bg-[#0c1a36] flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>}

      {/* Desktop */}
      {pathname != "/" && <div className="hidden md:flex w-[240px] bg-[#040E24] border-r border-[#1e2d47] flex-col">
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div
                  key={item.name}
                  className={`relative ${
                    isActive ? "border-r-2 border-[#2B9DDA] absolute -right-2" : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
                      isActive
                        ? "text-[#FFFFFF] bg-[#2B9DDA14]"
                        : "text-gray-300 hover:bg-[#0c1a36]"
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
              );
            })}
          </nav>
        </div>
        <div className="p-4">
          <ConnectedWalletCard />
        </div>
      </div>}
    </>
  );
}