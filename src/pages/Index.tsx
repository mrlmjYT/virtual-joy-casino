import { useState } from "react";
import CasinoHeader from "@/components/CasinoHeader";
import HeroSection from "@/components/HeroSection";
import GamesGrid from "@/components/GamesGrid";
import SlotMachine from "@/components/SlotMachine";
import Roulette from "@/components/Roulette";
import Blackjack from "@/components/Blackjack";
import VideoPoker from "@/components/VideoPoker";
import Bingo from "@/components/Bingo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const DAILY_BONUS = 1000;

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [lastBonusDate, setLastBonusDate] = useState<string | null>(null);

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
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLobby = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
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
        </div>
      ) : (
        <>
          <HeroSection />
          <GamesGrid onGameSelect={handleGameSelect} />

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
