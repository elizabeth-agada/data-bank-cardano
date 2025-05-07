import { MoreVertical } from "lucide-react"
import Image from "next/image"
import Button from "./button"

interface Document {
  id: string
  name: string
  date: string
  size: string
  type: string
  sharedWith: { id: number; avatar: string }[]
}

export default function RecentDocuments() {
  const documents: Document[] = [
    {
      id: "1",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
        { id: 3, avatar: "/img/Ellipse 3.png" },
      ],
    },
    {
      id: "2",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
      ],
    },
    {
      id: "3",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
        { id: 3, avatar: "/img/Ellipse 3.png" },
      ],
    },
    {
      id: "4",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
      ],
    },
    {
      id: "5",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
      ],
    },
    {
      id: "6",
      name: "Document_name",
      date: "March 13, 2025, 12:30 PM",
      size: "2.5MB",
      type: "docx",
      sharedWith: [
        { id: 1, avatar: "/img/Ellipse 1.png" },
        { id: 2, avatar: "/img/Ellipse 2.png" },
        { id: 3, avatar: "/img/Ellipse 3.png" },
      ],
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Documents</h2>
        <Button variant="link" className="text-[#2B9DDA] hover:text-[#2589c2]">
          <h2 className="bg-[#071A32] p-2 rounded-full">
            See All
          </h2>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  return (
    <div className="bg-[#040E24] rounded-2xl border border-[#3A4358] overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-[#071A32] p-2 rounded-md mr-3">
              <Image
                src="/img/document.png"
                alt="Document"
                width={60}
                height={60} />
            </div>
            <div>
              <h3 className="font-medium">{document.name}</h3>
              <p className="text-xs text-gray-400">{document.date}</p>
              <div className="flex items-center text-xs text-gray-400">
          <span>{document.size}</span>
          <span className="mx-2">•</span>
          <span>{document.type}</span>
        </div>
            </div>
            
            
          </div>
          <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#3A4358]">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        
     
      <div className="py-6">
        
        <div className="">
          <div className="flex justify-between items-center">
        <h2 className="font-bold">shared access</h2>
        <button className="text-[#2B9DDA] bg-[#071A32] p-2 hover:text-[#2589c2] hover:bg-[#3A4358] px-3 py-1 h-7 text-xs rounded-full flex items-center">
          <Image
            src="/img/share.png"
            alt="Share"
            width={16}
            height={16}
            className="h-4 w-4 mr-1"
          />
          Share
        </button>
        </div>
        <div className="flex -space-x-2">
          {document.sharedWith.map((user) => (
            <div key={user.id} className="h-6 w-6 rounded-full border-2 border-[#0c1a36] overflow-hidden">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt="User avatar"
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          
          ))}
            </div>
        </div>
       
      </div>
      </div>
    </div>
  )
}


