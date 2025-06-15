import { Card, CardContent } from "@/components/ui/card"
import { Users, Coins, Trophy } from "lucide-react"

interface StatsOverviewProps {
  activeCount: number
}

export default function StatsOverview({ activeCount }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">10.2M+</div>
          <div className="text-blue-200">Active Players</div>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">$475K</div>
          <div className="text-blue-200">Total Prize Pool</div>
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6 text-center">
          <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{activeCount}</div>
          <div className="text-blue-200">Active Tournaments</div>
        </CardContent>
      </Card>
    </div>
  )
}
