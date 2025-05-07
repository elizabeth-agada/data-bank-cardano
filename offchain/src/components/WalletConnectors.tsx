"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/contexts/wallet/WalletContext";
import { Wallet } from "@/types/cardano";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
import { handleError } from "@/components/utils";
import Image from "next/image";
export default function WalletConnectors() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { lucid } = walletConnection;
  const [isModalOpen, setIsModalOpen] = useState(false);

  function getWallets() {
    const wallets: Wallet[] = [];
    const { cardano } = window;

    for (const c in cardano) {
      const wallet = cardano[c];
      if (!wallet.apiVersion) continue; // Skip non-wallet objects
      wallets.push(wallet);
    }

    return wallets.sort((l, r) => (l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1));
  }

  const wallets = getWallets();

  async function onConnectWallet(wallet: Wallet) {
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";

      const walletApi = await wallet.enable();
      lucid.selectWallet.fromAPI(walletApi);

      const address = await lucid.wallet().address();
      const pkh = paymentCredentialOf(address).hash;

      const stakeAddress = (await lucid.wallet().rewardAddress()) ?? "";
      const skh = stakeAddress ? stakeCredentialOf(stakeAddress).hash : "";

      setWalletConnection((walletConnection) => ({
        ...walletConnection,
        wallet,
        walletApi,
        address,
        pkh,
        stakeAddress,
        skh,
      }));

      setIsModalOpen(false); // Close modal after successful connection
    } catch (error) {
        handleError(error as { [key: string]: unknown; info?: string; message?: string });
    }
  }

  return (
    <>
      <Button
        variant="default"
        className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Connect Wallet
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Wallet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {wallets.length ? (
              wallets.map((wallet, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-between"
                  onClick={() => onConnectWallet(wallet)}
                >
                  <span>{wallet.name}</span>
                  <Image src={wallet.icon} alt={`${wallet.name} icon`} className="h-6 w-6" />
                </Button>
              ))
            ) : (
              <p className="text-center text-gray-500">No Cardano Wallets Found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}