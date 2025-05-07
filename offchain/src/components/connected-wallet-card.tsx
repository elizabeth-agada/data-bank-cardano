import Button from "./button"

export default function ConnectWalletCard() {
  return (
    <div className="bg-[#1a2235] rounded-lg p-4 border border-[#3A4358]">
      <h3 className="font-medium mb-1 text-[#00D966]">Connected!</h3>
      <p className="text-xs text-gray-400 mb-3"> Your decentralized document storage solution</p>
      <Button variant="primary" className="w-full text-xs h-8">
      Hello! 0xe...0009
      </Button>
    </div>
  )
}

