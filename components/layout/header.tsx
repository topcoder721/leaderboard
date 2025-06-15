"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeaderProps {
  onShowAdmin: () => void
}

export default function Header({ onShowAdmin }: HeaderProps) {
  return (
    <div className="text-center py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8" /> {/* Spacer */}
        <div className="relative">
          <Image src="/images/trophy-hero.png" alt="Leaderboard Trophy" width={200} height={120} className="mx-auto" />
        </div>
        <Button
          onClick={onShowAdmin}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 p-2"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">GAMING TOURNAMENTS</h1>
      <p className="text-purple-200 text-sm">Choose your competition</p>
    </div>
  )
}
