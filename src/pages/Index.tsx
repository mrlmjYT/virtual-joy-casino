import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CasinoHeader from "@/components/CasinoHeader";
import HeroSection from "@/components/HeroSection";
import GamesGrid from "@/components/GamesGrid";
import SlotMachine from "@/components/SlotMachine";
import Roulette from "@/components/Roulette";
import Blackjack from "@/components/Blackjack";
import VideoPoker from "@/components/VideoPoker";
import Bingo from "@/components/Bingo";
import Crash from "@/components/Crash";
import Dice from "@/components/Dice";
import Plinko from "@/components/Plinko";
import Leaderboard from "@/components/Leaderboard";
import AdModal from "@/components/AdModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

const DAILY_BONUS = 1000;

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [balance, setBalance] = useState(10000);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [lastBonusDate, setLastBonusDate] = useState<string | null>(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [pendingGame, setPendingGame] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Update leaderboard when game is played
  useEffect(() => {
    if (!user) return;

    const updateLeaderboard = async () => {
      try {
        const { data: leaderboardData } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (leaderboardData) {
          const totalWinnings = balance - 10000;
          const biggestWin = Math.max(leaderboardData.biggest_win, totalWinnings);
          
          await supabase
            .from('leaderboard')
            .update({
              total_winnings: Math.max(0, totalWinnings),
              biggest_win: biggestWin,
            })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating leaderboard:', error);
      }
    };

    // Only update when not in a game
    if (!selectedGame) {
      updateLeaderboard();
    }
  }, [balance, user, selectedGame]);

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    if (lastBonusDate === today) {
      toast.error("Sie haben Ihren Tagesbonus bereits abgeholt!");
      return;
    }

    setBalance(balance + DAILY_BONUS);
    setLastBonusDate(today);
    toast.success(`🎁 +${DAILY_BONUS} Chips erhalten!`);
  };

  const handleGameSelect = (game: string) => {
    const newRoundsPlayed = roundsPlayed + 1;
    setRoundsPlayed(newRoundsPlayed);
    
    // Show ad every 2 rounds
    if (newRoundsPlayed % 2 === 0) {
      setPendingGame(game);
      setShowAd(true);
    } else {
      setSelectedGame(game);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (pendingGame) {
      setSelectedGame(pendingGame);
      setPendingGame(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToLobby = () => {
    setSelectedGame(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <AdModal isOpen={showAd} onClose={handleAdClose} />
      <CasinoHeader balance={balance} />

      {selectedGame ? (
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="outline" 
            onClick={handleBackToLobby}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Lobby
          </Button>
          {selectedGame === "slots" && <SlotMachine balance={balance} onBalanceChange={setBalance} />}
          {selectedGame === "roulette" && <Roulette balance={balance} onBalanceChange={setBalance} />}
          {selectedGame === "blackjack" && <Blackjack balance={balance} onBalanceChange={setBalance} />}
          {selectedGame === "poker" && <VideoPoker balance={balance} onBalanceChange={setBalance} />}
          {selectedGame === "bingo" && <Bingo balance={balance} onBalanceChange={setBalance} />}
          {selectedGame === "crash" && <Crash balance={balance} onBalanceChange={setBalance} onBack={handleBackToLobby} />}
          {selectedGame === "dice" && <Dice balance={balance} onBalanceChange={setBalance} onBack={handleBackToLobby} />}
          {selectedGame === "plinko" && <Plinko balance={balance} onBalanceChange={setBalance} onBack={handleBackToLobby} />}
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
          <HeroSection />
          
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GamesGrid onGameSelect={handleGameSelect} />
              </div>
              <div>
                <Leaderboard />
              </div>
            </div>
          </div>

          <section className="py-16 bg-card/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6 text-gradient-gold">
                Sicher & Fair
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Alle Spiele nutzen zertifizierte Zufallszahlengeneratoren (RNG) für faire Ergebnisse. 
                Spielen Sie ohne Risiko und genießen Sie die Casino-Atmosphäre!
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
                  onClick={claimDailyBonus}
                >
                  🎁 Tagesbonus abholen (+{DAILY_BONUS})
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 VirtualCasino • 100% Spielgeld • Keine Echtgeldwetten • Nur für Unterhaltung
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
