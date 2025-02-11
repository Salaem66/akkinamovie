import Image from "next/image"

export default function Mascot({ message }: { message: string }) {
  return (
    <div className="flex items-center mb-4">
      <div className="relative w-16 h-16 mr-4">
        <Image
          src="/placeholder.svg?height=64&width=64"
          alt="AkinaMovie Mascot"
          layout="fill"
          className="rounded-full"
        />
      </div>
      <div className="bg-blue-100 p-3 rounded-lg rounded-tl-none">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

