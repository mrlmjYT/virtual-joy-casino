import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeaderboardEntry {
  username: string;
  total_winnings: number;
  games_played: number;
  biggest_win: number;
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          total_winnings,
          games_played,
          biggest_win,
          profiles!inner(username)
        `)
        .order('total_winnings', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted = data?.map(entry => ({
        username: (entry.profiles as any).username,
        total_winnings: entry.total_winnings,
        games_played: entry.games_played,
        biggest_win: entry.biggest_win,
      })) || [];

      setLeaders(formatted);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-gradient-gold">Rangliste</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lädt...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient-gold flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Rangliste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {leaders.map((leader, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{leader.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {leader.games_played} Spiele
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{leader.total_winnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Höchster: {leader.biggest_win.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
