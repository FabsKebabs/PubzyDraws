import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface Winner {
  id: string;
  username: string;
  Giveaway: string;
  prize: string;
  Date: string;
}

export default function LeaderboardTable() {
  const { data: winners, isLoading, error } = useQuery<Winner[]>({
    queryKey: ["/api/leaderboard"],
  });

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "N/A";
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="cyber-border overflow-hidden">
        <div className="p-4 animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-1 h-8 bg-gray-700 rounded"></div>
                <div className="col-span-3 h-8 bg-gray-700 rounded"></div>
                <div className="col-span-4 h-8 bg-gray-700 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-700 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-orbitron text-red-500 mb-2">Error Loading Leaderboard</h3>
        <p className="text-gray-400">There was a problem fetching the leaderboard data. Please try again later.</p>
      </Card>
    );
  }

  // Render empty state
  if (!winners || winners.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-orbitron text-white mb-2">No Winners Yet</h3>
        <p className="text-gray-400 mb-4">There are no giveaway winners to display yet. Enter a giveaway for your chance to win!</p>
        <Trophy className="h-16 w-16 text-primary mx-auto opacity-30" />
      </Card>
    );
  }

  // Helper function to get medal for position
  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return position + 1;
    }
  };

  return (
    <Card className="cyber-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-black/60">
            <TableRow>
              <TableHead className="w-12 text-center font-orbitron text-primary">#</TableHead>
              <TableHead className="font-orbitron text-primary">User</TableHead>
              <TableHead className="font-orbitron text-primary">Giveaway</TableHead>
              <TableHead className="font-orbitron text-primary">Prize</TableHead>
              <TableHead className="font-orbitron text-primary">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners?.map((winner, index) => (
              <TableRow 
                key={winner.id}
                className="border-b border-primary/20 hover:bg-primary/5 transition-colors"
              >
                <TableCell className="font-rajdhani text-center">
                  <div className="flex items-center justify-center">
                    {getMedal(index)}
                  </div>
                </TableCell>
                <TableCell className="font-rajdhani font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-primary to-purple-600 h-8 w-8 rounded-full flex items-center justify-center text-white">
                      {winner.username.charAt(0).toUpperCase()}
                    </div>
                    <span className={index < 3 ? "text-cyan-400" : "text-white"}>
                      {winner.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-rajdhani">{winner.Giveaway}</TableCell>
                <TableCell className="font-rajdhani text-pink-500 font-semibold">{winner.prize}</TableCell>
                <TableCell className="font-rajdhani text-gray-400">{formatDate(winner.Date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}