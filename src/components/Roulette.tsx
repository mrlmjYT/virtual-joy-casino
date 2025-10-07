import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

interface RouletteProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const Roulette = ({ balance, onBalanceChange }: RouletteProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState(0);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const betOnColor = (color: "red" | "black") => {
    if (color === "red") {
      setSelectedNumbers(redNumbers);
    } else {
      setSelectedNumbers(numbers.filter((n) => n !== 0 && !redNumbers.includes(n)));
    }
  };

  const spin = () => {
    if (selectedNumbers.length === 0) {
      toast.error("Bitte wählen Sie mindestens eine Zahl!");
      return;
    }

    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setSpinning(true);
    onBalanceChange(balance - selectedBet);
    setLastWin(0);

    // Simulate spinning
    let spins = 0;
    const spinInterval = setInterval(() => {
      setWinningNumber(Math.floor(Math.random() * 37));
      spins++;

      if (spins >= 20) {
        clearInterval(spinInterval);
        const finalNumber = Math.floor(Math.random() * 37);
        setWinningNumber(finalNumber);
        setSpinning(false);
        checkWin(finalNumber);
      }
    }, 100);
  };

  const checkWin = (number: number) => {
    if (selectedNumbers.includes(number)) {
      const payout = Math.floor((selectedBet * 36) / selectedNumbers.length);
      setLastWin(payout);
      onBalanceChange(balance - selectedBet + payout);
      toast.success(`🎉 Gewonnen! Zahl ${number} - Gewinn: ${payout}`);
    } else {
      toast.error(`Zahl ${number} - Leider verloren!`);
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-secondary text-white";
    return redNumbers.includes(num) ? "bg-accent text-white" : "bg-foreground text-background";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Roulette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Winning Number Display */}
        {winningNumber !== null && (
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${getNumberColor(
                winningNumber
              )} ${spinning ? "animate-spin-slow" : "glow-effect"}`}
            >
              {winningNumber}
            </div>
          </div>
        )}

        {/* Quick Bets */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Button variant="outline" onClick={() => betOnColor("red")} disabled={spinning}>
            <div className="w-4 h-4 bg-accent rounded-full mr-2" />
            Rot
          </Button>
          <Button variant="outline" onClick={() => betOnColor("black")} disabled={spinning}>
            <div className="w-4 h-4 bg-foreground rounded-full mr-2" />
            Schwarz
          </Button>
          <Button variant="outline" onClick={() => setSelectedNumbers([])} disabled={spinning}>
            Zurücksetzen
          </Button>
        </div>

        {/* Number Grid */}
        <div className="bg-secondary/20 rounded-lg p-4 border-2 border-secondary/50">
          <div className="grid grid-cols-12 gap-1">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={spinning}
                className={`aspect-square rounded flex items-center justify-center text-xs font-bold transition-all ${getNumberColor(
                  num
                )} ${
                  selectedNumbers.includes(num)
                    ? "ring-2 ring-primary scale-110 glow-effect"
                    : "opacity-70 hover:opacity-100"
                } ${num === 0 ? "col-span-12" : "col-span-2"}`}
              >
                {num}
              </button>
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
        <div className="flex justify-between text-sm">
          <Badge variant="outline">
            Gewählte Zahlen: {selectedNumbers.length}
          </Badge>
          {lastWin > 0 && (
            <Badge className="bg-accent animate-pulse-slow">
              Gewinn: +{lastWin}
            </Badge>
          )}
        </div>

        {/* Spin Button */}
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
          onClick={spin}
          disabled={spinning || selectedNumbers.length === 0 || balance < selectedBet}
        >
          <RotateCw className={`w-5 h-5 mr-2 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Dreht..." : "SPIN"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Roulette;
