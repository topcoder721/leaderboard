import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ModalWrapperProps {
  children: React.ReactNode
  onClose: () => void
}

export default function ModalWrapper({ children, onClose }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20 overflow-hidden">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  )
}
