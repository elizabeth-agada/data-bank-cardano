import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, LogOut, User, Key, Shield, Coins } from "lucide-react";
import { useWallet } from "@/components/contexts/wallet/WalletContext";

// Mock wallet context for demo


export default function WalletButton() {
    const [walletConnection, setWalletConnection] = useWallet();
    const [showDetails, setShowDetails] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const { address, pkh, stakeAddress, skh } = walletConnection;

    function toggleDetails() {
        setShowDetails((prev) => !prev);
    }

    async function copyToClipboard(text: string, field: string | null) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    function disconnect() {
        setShowDetails(false);
        setWalletConnection({
            wallet: undefined,
            walletApi: undefined,
            address: "",
            pkh: "",
            stakeAddress: "",
            skh: "",
        });
    }

    const walletInfo = [
        { label: "Wallet Address", value: address, icon: User, key: "address" },
        { label: "Public Key Hash", value: pkh, icon: Key, key: "pkh" },
        { label: "Stake Address", value: stakeAddress, icon: Coins, key: "stakeAddress" },
        { label: "Stake Key Hash", value: skh, icon: Shield, key: "skh" }
    ];

    return (
        <div className="relative font-inter">
            {/* Main Wallet Button */}
            <Button 
                variant="default" 
                className={`
                    relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-white
                    bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600
                    hover:from-violet-500 hover:via-blue-500 hover:to-indigo-500
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    transition-all duration-300 ease-out
                    border border-white/20
                    ${showDetails ? 'ring-2 ring-violet-400/50' : ''}
                `}
                onClick={toggleDetails}
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-blue-400/20 to-indigo-400/20 animate-pulse" />
                
                {/* Button content */}
                <div className="relative flex items-center gap-2">
                    <Wallet size={18} className="drop-shadow-sm" />
                    <span className="drop-shadow-sm">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
                    </span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 hover:translate-x-full" />
            </Button>

            {/* Wallet Details Modal */}
            {showDetails && address && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowDetails(false)}
                    />
                    
                    {/* Modal */}
                    <div className="absolute top-full right-0 mt-4 z-50 w-96 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                                        <Wallet size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Wallet Connected</h3>
                                        <p className="text-sm text-gray-500">Manage your wallet details</p>
                                    </div>
                                </div>
                            </div>

                            {/* Wallet Info Cards */}
                            <div className="space-y-3 mb-6">
                                {walletInfo.map(({ label, value, icon: Icon, key }) => (
                                    <div key={key} className="group">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                                            {label}
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200">
                                                <Icon size={16} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-mono text-sm text-gray-700 break-all flex-1">
                                                    {value}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(value ?? "", key)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg transition-all duration-200"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy size={14} className="text-gray-400 hover:text-gray-600" />
                                                </button>
                                            </div>
                                            
                                            {/* Copy notification */}
                                            {copiedField === key && (
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md animate-in fade-in duration-200">
                                                    Copied!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowDetails(false)}
                                    variant="outline"
                                    className="flex-1 rounded-xl border-gray-200  text-black hover:bg-gray-50 text-black"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={disconnect}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}