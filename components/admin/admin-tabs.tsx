"use client"

import { Button } from "@/components/ui/button"
import { Plus, Zap, TrendingUp } from "lucide-react"

interface AdminTabsProps {
  activeTab: "create" | "simulate" | "stats"
  onTabChange: (tab: "create" | "simulate" | "stats") => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onTabChange("create")}
        variant={activeTab === "create" ? "default" : "outline"}
        size="sm"
        className={activeTab === "create" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
      >
        <Plus className="h-4 w-4 mr-1" />
        Create Leaderboard
      </Button>
      <Button
        onClick={() => onTabChange("simulate")}
        variant={activeTab === "simulate" ? "default" : "outline"}
        size="sm"
        className={activeTab === "simulate" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
      >
        <Zap className="h-4 w-4 mr-1" />
        Simulate Activity
      </Button>
      <Button
        onClick={() => onTabChange("stats")}
        variant={activeTab === "stats" ? "default" : "outline"}
        size="sm"
        className={activeTab === "stats" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
      >
        <TrendingUp className="h-4 w-4 mr-1" />
        Statistics
      </Button>
    </div>
  )
}
