import { Card } from "@/components/ui/card";
import { Users, Gift, Eye, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function CommunityStats() {
  const { data: usersCount = { count: 0 } } = useQuery({
    queryKey: ["/api/users/count"],
  });

  const { data: entryCount = { count: 0 } } = useQuery({
    queryKey: ["/api/entries/count"],
  });

  const { data: giveaways = [] } = useQuery({
    queryKey: ["/api/giveaways"],
  });

  // Stats with dynamic data
  const stats = [
    {
      title: "Total Members",
      value: usersCount.count.toLocaleString(),
      change: "+1,240 this month",
      icon: <Users className="text-primary" />,
      color: "primary",
    },
    {
      title: "Active Giveaways",
      value: giveaways.length.toString(),
      change: "Current giveaway",
      icon: <Gift className="text-pink-500" />,
      color: "pink-500",
    },
    {
      title: "Video Views",
      value: "1.28M",
      change: "+42K this week",
      icon: <Eye className="text-purple-600" />,
      color: "purple-600",
    },
    {
      title: "Prize Value",
      value: "R$74,675",
      change: "Given away this year",
      icon: <DollarSign className="text-cyan-400" />,
      color: "cyan-400",
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="font-orbitron text-2xl font-bold text-white mb-6">Community Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-5 relative overflow-hidden bg-black/80">
            <div className={`absolute -bottom-2 -right-2 w-16 h-16 bg-${stat.color} opacity-20 rounded-full blur-xl`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-rajdhani text-gray-400">{stat.title}</h3>
                <div className={`bg-${stat.color}/20 h-8 w-8 rounded-full flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="font-orbitron text-3xl font-bold text-white">{stat.value}</p>
              <p className="font-rajdhani text-cyan-400 text-sm mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {stat.change}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}