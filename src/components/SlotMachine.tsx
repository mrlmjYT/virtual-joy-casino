import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, RotateCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

interface SlotMachineProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "⭐", "7️⃣"];

const SlotMachine = ({ balance, onBalanceChange }: SlotMachineProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [reels, setReels] = useState(["🍒", "🍋", "🍊"]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  const spin = () => {
    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setSpinning(true);
    onBalanceChange(balance - selectedBet);
    setLastWin(0);

    // Spinning animation
    let spins = 0;
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      spins++;

      if (spins >= 15) {
        clearInterval(spinInterval);
        // Final result
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];
        setReels(finalReels);
        setSpinning(false);
        checkWin(finalReels);
      }
    }, 100);
  };

  const checkWin = (finalReels: string[]) => {
    let winAmount = 0;

    // Three of a kind
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      if (finalReels[0] === "7️⃣") {
        winAmount = selectedBet * 50; // Jackpot
        toast.success("🎉 JACKPOT! 7-7-7!");
      } else if (finalReels[0] === "💎") {
        winAmount = selectedBet * 20;
        toast.success("💎 Diamant-Gewinn!");
      } else {
        winAmount = selectedBet * 10;
        toast.success("🎊 Dreifach-Gewinn!");
      }
    }
    // Two of a kind
    else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      winAmount = selectedBet * 2;
      toast.success("✨ Kleiner Gewinn!");
    }
    // No win
    else {
      toast.info("Leider kein Gewinn. Versuchen Sie es erneut!");
    }

    if (winAmount > 0) {
      setLastWin(winAmount);
      onBalanceChange(balance - selectedBet + winAmount);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Slot Machine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reels */}
        <div className="bg-secondary/20 rounded-lg p-6 border-2 border-secondary/50">
          <div className="grid grid-cols-3 gap-4">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`aspect-square bg-background rounded-lg flex items-center justify-center text-6xl border-2 border-border ${
                  spinning ? "animate-pulse-slow" : ""
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Bet Selector */}
        <BetSelector
          balance={balance}
          selectedBet={selectedBet}
          onBetChange={setSelectedBet}
        />

        {/* Stats */}
        {lastWin > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent animate-pulse-slow" />
              <span className="text-muted-foreground">Gewinn:</span>
              <span className="font-bold text-accent">+{lastWin}</span>
            </div>
          </div>
        )}

        {/* Spin Button */}
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
          onClick={spin}
          disabled={spinning || balance < selectedBet}
        >
          <RotateCw className={`w-5 h-5 mr-2 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Dreht..." : "SPIN"}
        </Button>

        {balance < selectedBet && (
          <p className="text-center text-sm text-destructive">
            Nicht genug Guthaben. Holen Sie sich Ihren Tagesbonus!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SlotMachine;
