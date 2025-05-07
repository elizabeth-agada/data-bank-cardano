import Image from 'next/image'

interface StorageStatsProps {
  used: number
  total: number
}

export default function StorageStats({ used, total }: StorageStatsProps) {
  const percentage = (used / total) * 100

  return (
    <div className="bg-[#040E24] rounded-2xl p-6 border border-[#3A4358]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm mb-2">Storage</h3>
          <div className="text-3xl font-bold">
            {used} GB of {total}GB
          </div>
        </div>
        <div className="">
          <Image src="/img/store.png" alt="Hard Drive" width={24} height={24} />
        </div>
      </div>
      <div className="mt-4 bg-[#3A4358] rounded-full h-2 overflow-hidden">
        <div className="bg-[#2B9DDA] h-full rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

