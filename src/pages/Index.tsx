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
import Keno from "@/components/Keno";
import WheelOfFortune from "@/components/WheelOfFortune";
import SicBo from "@/components/SicBo";
import MinesGame from "@/components/MinesGame";
import QuizGamble from "@/components/QuizGamble";
import Leaderboard from "@/components/Leaderboard";
import AdModal from "@/components/AdModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

const DAILY_BONUS = 1000;

interface IndexProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Index = ({ balance, onBalanceChange }: IndexProps) => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [lastBonusDate, setLastBonusDate] = useState<string | null>(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [pendingGame, setPendingGame] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userExperience, setUserExperience] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(balance);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load user level
  useEffect(() => {
    if (user) {
      loadUserLevel();
    }
  }, [user]);

  const loadUserLevel = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('level, experience')
      .eq('id', user.id)
      .single();

    if (data) {
      setUserLevel(data.level || 1);
      setUserExperience(data.experience || 0);
    }
  };

  const updateLevelAndExperience = async (experienceGained: number) => {
    if (!user) return;

    const newExperience = userExperience + experienceGained;
    const experienceForNextLevel = userLevel * 100;
    let newLevel = userLevel;

    if (newExperience >= experienceForNextLevel) {
      newLevel = userLevel + 1;
      toast.success(`🎉 Level Up! Du bist jetzt Level ${newLevel}!`);
    }

    setUserExperience(newExperience);
    setUserLevel(newLevel);

    await supabase
      .from('profiles')
      .update({ 
        level: newLevel,
        experience: newExperience 
      })
      .eq('id', user.id);
  };

  // Award XP based on coins spent
  useEffect(() => {
    if (balance < previousBalance && user) {
      const coinsSpent = previousBalance - balance;
      const xpGained = Math.floor(coinsSpent / 10); // 1 XP per 10 coins spent
      if (xpGained > 0) {
        updateLevelAndExperience(xpGained);
      }
    }
    setPreviousBalance(balance);
  }, [balance]);

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

    onBalanceChange(balance + DAILY_BONUS);
    setLastBonusDate(today);
    toast.success(`🎁 +${DAILY_BONUS} Chips erhalten!`);
  };

  const handleGameSelect = (game: string) => {
    // Navigate to boxes page directly
    if (game === "boxes") {
      navigate('/boxes');
      return;
    }
    
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
          {selectedGame === "slots" && <SlotMachine balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "roulette" && <Roulette balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "blackjack" && <Blackjack balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "poker" && <VideoPoker balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "bingo" && <Bingo balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "crash" && <Crash balance={balance} onBalanceChange={onBalanceChange} onBack={handleBackToLobby} />}
          {selectedGame === "dice" && <Dice balance={balance} onBalanceChange={onBalanceChange} onBack={handleBackToLobby} />}
          {selectedGame === "plinko" && <Plinko balance={balance} onBalanceChange={onBalanceChange} onBack={handleBackToLobby} />}
          {selectedGame === "keno" && <Keno balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "wheel" && <WheelOfFortune balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "sicbo" && <SicBo balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "mines" && <MinesGame balance={balance} onBalanceChange={onBalanceChange} />}
          {selectedGame === "quiz" && <QuizGamble balance={balance} onBalanceChange={onBalanceChange} onBack={handleBackToLobby} />}
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
          
          {/* Big Disclaimer Banner */}
          <div className="bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 border-y-4 border-accent py-6 animate-pulse-slow">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold text-lg animate-bounce">
                  ⚠️ KEIN ECHTGELD
                </div>
                <p className="text-center font-bold text-xl">
                  100% SPIELGELD • KEINE ECHTEN GEWINNE • NUR UNTERHALTUNG
                </p>
                <div className="bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold text-lg animate-bounce">
                  ⚠️ KEIN ECHTGELD
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-8">
            {/* Level Progress Bar */}
            <div className="mb-8 max-w-4xl mx-auto">
              <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">Level {userLevel}</span>
                    <span className="text-sm text-muted-foreground">
                      {userExperience} / {userLevel * 100} XP
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 animate-pulse-slow"
                      style={{ width: `${(userExperience / (userLevel * 100)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Spiele Spiele um Erfahrung zu sammeln und neue Spiele freizuschalten!
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GamesGrid onGameSelect={handleGameSelect} userLevel={userLevel} />
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

      <footer className="bg-card border-t-4 border-accent py-12">
        <div className="container mx-auto px-4">
          <div className="bg-accent/10 border-2 border-accent rounded-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-center text-accent mb-4">
              🚨 WICHTIGER HINWEIS - KEIN ECHTGELD! 🚨
            </h3>
            <p className="text-center text-lg font-medium mb-4">
              Diese Plattform verwendet ausschließlich virtuelles Spielgeld ohne jeglichen Geldwert.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="font-bold text-accent">❌ Keine Einzahlungen</p>
                <p className="text-sm text-muted-foreground">Kein echtes Geld nötig</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="font-bold text-accent">❌ Keine Auszahlungen</p>
                <p className="text-sm text-muted-foreground">Keine echten Gewinne möglich</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="font-bold text-accent">✅ Nur Unterhaltung</p>
                <p className="text-sm text-muted-foreground">100% risikofrei spielen</p>
              </div>
            </div>
          </div>
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 VirtualCasino • 100% Spielgeld • Keine Echtgeldwetten • Nur für Unterhaltung
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
