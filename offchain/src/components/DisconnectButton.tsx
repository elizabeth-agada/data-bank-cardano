import { useState } from "react";
import Button from "./button";
import { useWallet } from "@/components/contexts/wallet/WalletContext";

export default function WalletButton() {
    const [walletConnection, setWalletConnection] = useWallet();
    const [showDetails, setShowDetails] = useState(false);


    const { address, pkh, stakeAddress, skh } = walletConnection;

    function toggleDetails() {
        setShowDetails((prev) => !prev);
    }

    return (
        <div className="relative">
            <Button
                className="absolute top-0 right-0 -translate-y-full"
                onClick={toggleDetails}
            >
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
            </Button>
            {showDetails && address && (
                <div className="absolute top-full right-0 mt-2 p-4 bg-white border rounded shadow-lg">
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Public Key Hash:</strong> {pkh}</p>
                    <p><strong>Stake Address:</strong> {stakeAddress}</p>
                    <p><strong>Stake Key Hash:</strong> {skh}</p>
                    <Button
                        className="mt-2"
                        onClick={() => {
                            setShowDetails(false);
                            setWalletConnection({
                                wallet: undefined,
                                walletApi: undefined,
                                address: "",
                                pkh: "",
                                stakeAddress: "",
                                skh: "",
                            });
                        }}
                    >
                        Disconnect
                    </Button>
                </div>
            )}
        </div>
    );
}