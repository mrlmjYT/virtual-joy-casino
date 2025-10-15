import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BetSelector from "./BetSelector";
import { toast } from "sonner";
import { Dices } from "lucide-react";

interface SicBoProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

type BetType = "small" | "big" | "odd" | "even" | "triple" | null;

const SicBo = ({ balance, onBalanceChange }: SicBoProps) => {
  const [bet, setBet] = useState(10);
  const [selectedBet, setSelectedBet] = useState<BetType>(null);
  const [dice, setDice] = useState<number[]>([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    if (!selectedBet) {
      toast.error("Bitte wählen Sie eine Wette!");
      return;
    }
    if (balance < bet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setIsRolling(true);
    onBalanceChange(balance - bet);

    // Animate dice rolling
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDice(finalDice);

      const total = finalDice.reduce((a, b) => a + b, 0);
      const isTriple = finalDice[0] === finalDice[1] && finalDice[1] === finalDice[2];
      let winAmount = 0;

      if (selectedBet === "small" && total >= 4 && total <= 10 && !isTriple) {
        winAmount = bet * 2;
      } else if (selectedBet === "big" && total >= 11 && total <= 17 && !isTriple) {
        winAmount = bet * 2;
      } else if (selectedBet === "odd" && total % 2 === 1 && !isTriple) {
        winAmount = bet * 2;
      } else if (selectedBet === "even" && total % 2 === 0 && !isTriple) {
        winAmount = bet * 2;
      } else if (selectedBet === "triple" && isTriple) {
        winAmount = bet * 30;
      }

      if (winAmount > 0) {
        onBalanceChange(balance - bet + winAmount);
        toast.success(`Gewonnen! +${winAmount} Chips`);
      } else {
        toast.error("Verloren!");
      }

      setIsRolling(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-gold flex items-center gap-2">
          <Dices className="w-8 h-8" />
          Sic Bo (Würfelspiel)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BetSelector balance={balance} selectedBet={bet} onBetChange={setBet} />

        <div className="flex justify-center gap-4">
          {dice.map((die, index) => (
            <div
              key={index}
              className={`w-20 h-20 bg-card border-4 border-primary rounded-lg flex items-center justify-center text-4xl font-bold text-primary transition-transform ${
                isRolling ? "animate-spin" : ""
              }`}
            >
              {die}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={selectedBet === "small" ? "default" : "outline"}
            onClick={() => !isRolling && setSelectedBet("small")}
            disabled={isRolling}
            className="h-20"
          >
            <div>
              <p className="font-bold text-lg">Klein</p>
              <p className="text-xs">4-10 (2x)</p>
            </div>
          </Button>

          <Button
            variant={selectedBet === "big" ? "default" : "outline"}
            onClick={() => !isRolling && setSelectedBet("big")}
            disabled={isRolling}
            className="h-20"
          >
            <div>
              <p className="font-bold text-lg">Groß</p>
              <p className="text-xs">11-17 (2x)</p>
            </div>
          </Button>

          <Button
            variant={selectedBet === "odd" ? "default" : "outline"}
            onClick={() => !isRolling && setSelectedBet("odd")}
            disabled={isRolling}
            className="h-20"
          >
            <div>
              <p className="font-bold text-lg">Ungerade</p>
              <p className="text-xs">2x Einsatz</p>
            </div>
          </Button>

          <Button
            variant={selectedBet === "even" ? "default" : "outline"}
            onClick={() => !isRolling && setSelectedBet("even")}
            disabled={isRolling}
            className="h-20"
          >
            <div>
              <p className="font-bold text-lg">Gerade</p>
              <p className="text-xs">2x Einsatz</p>
            </div>
          </Button>

          <Button
            variant={selectedBet === "triple" ? "default" : "outline"}
            onClick={() => !isRolling && setSelectedBet("triple")}
            disabled={isRolling}
            className="h-20 col-span-2"
          >
            <div>
              <p className="font-bold text-lg">Drilling</p>
              <p className="text-xs">Alle 3 gleich (30x)</p>
            </div>
          </Button>
        </div>

        <Button onClick={roll} disabled={isRolling || !selectedBet} className="w-full" size="lg">
          {isRolling ? "Würfel rollen..." : "Würfeln"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SicBo;