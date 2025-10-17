import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CasinoHeader from "@/components/CasinoHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, TrendingUp, Target, Coins, Calendar, Award, Zap, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/formatNumber";

interface ProfileProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Profile = ({ balance }: ProfileProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalWinnings: 0,
    gamesPlayed: 0,
    biggestWin: 0,
    username: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      // Fetch leaderboard data
      const { data: leaderboardData } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (leaderboardData) {
        setStats({
          totalWinnings: leaderboardData.total_winnings || 0,
          gamesPlayed: leaderboardData.games_played || 0,
          biggestWin: leaderboardData.biggest_win || 0,
          username: profileData?.username || user.email?.split('@')[0] || 'Spieler',
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const winRate = stats.gamesPlayed > 0 
    ? ((stats.totalWinnings / (stats.gamesPlayed * 100)) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <CasinoHeader balance={balance} />
      
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-8 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Lobby
        </Button>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="border-2 border-primary/20 shadow-lg glow-effect animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-3xl font-bold">
                    {stats.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-4xl text-gradient-gold mb-2">
                    {stats.username}
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Mitglied seit {new Date().toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Aktuelles Guthaben</CardTitle>
                  <Coins className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatNumber(balance)}</p>
                <p className="text-xs text-muted-foreground mt-1">Spielgeld-Chips</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-secondary/50 transition-all hover:scale-105 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Spiele Gespielt</CardTitle>
                  <Target className="w-5 h-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary">{stats.gamesPlayed}</p>
                <p className="text-xs text-muted-foreground mt-1">Runden insgesamt</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-accent/50 transition-all hover:scale-105 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Größter Gewinn</CardTitle>
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">{formatNumber(stats.biggestWin)}</p>
                <p className="text-xs text-muted-foreground mt-1">Beste Runde</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-primary/50 transition-all hover:scale-105 hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Gesamtgewinne</CardTitle>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatNumber(stats.totalWinnings)}</p>
                <p className="text-xs text-muted-foreground mt-1">Lifetime Winnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Section */}
          <Card className="border-2 border-primary/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Erfolge & Statistiken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <span className="text-sm font-medium">Win Rate</span>
                    <span className="text-lg font-bold text-primary">{winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <span className="text-sm font-medium">Durchschn. Gewinn/Spiel</span>
                    <span className="text-lg font-bold text-secondary">
                      {stats.gamesPlayed > 0 
                        ? formatNumber(Math.floor(stats.totalWinnings / stats.gamesPlayed))
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Zap className="w-8 h-8 text-accent" />
                    <div>
                      <p className="font-medium">Status: Aktiv</p>
                      <p className="text-xs text-muted-foreground">Bereit zum Spielen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Trophy className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Level: {Math.floor(stats.gamesPlayed / 10) + 1}</p>
                      <p className="text-xs text-muted-foreground">{stats.gamesPlayed % 10}/10 Spiele bis nächstes Level</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-accent">Wichtiger Hinweis</h3>
                  <p className="text-sm text-muted-foreground">
                    Alle angezeigten Werte sind reines Spielgeld ohne echten Geldwert. 
                    Diese Plattform dient ausschließlich der Unterhaltung und es können 
                    keine echten Gewinne erzielt werden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;