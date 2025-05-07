import Image from 'next/image'

interface DocumentStatsProps {
  totalDocuments: number
  increase: number
}

export default function DocumentStats({ totalDocuments, increase }: DocumentStatsProps) {
  return (
    <div className="bg-[#040E24] rounded-2xl p-6 border border-[#3A4358]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm mb-2">Total Document</h3>
          <div className="text-3xl font-bold">{totalDocuments.toLocaleString()}</div>
          <div className="text-[#00D966] font-bold text-sm mt-1">+{increase}</div>
        </div>
        <div className="bg-[#071A32] p-2 rounded-full">
          <Image src="/img/document.png" alt="Document" width={24} height={24} />
        </div>
      </div>
    </div>
  )
}

