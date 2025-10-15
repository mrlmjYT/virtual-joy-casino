import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BetSelector from "./BetSelector";
import { toast } from "sonner";

interface KenoProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Keno = ({ balance, onBalanceChange }: KenoProps) => {
  const [bet, setBet] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleNumber = (num: number) => {
    if (isPlaying) return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    } else {
      toast.error("Maximal 10 Zahlen auswählbar!");
    }
  };

  const play = () => {
    if (selectedNumbers.length === 0) {
      toast.error("Bitte wählen Sie mindestens eine Zahl!");
      return;
    }
    if (balance < bet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setIsPlaying(true);
    onBalanceChange(balance - bet);

    // Draw 20 random numbers
    const drawn: number[] = [];
    while (drawn.length < 20) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!drawn.includes(num)) {
        drawn.push(num);
      }
    }
    
    setDrawnNumbers(drawn);

    // Calculate matches
    const matches = selectedNumbers.filter(num => drawn.includes(num)).length;
    
    // Payout table
    const payouts: { [key: number]: { [key: number]: number } } = {
      1: { 1: 3 },
      2: { 2: 12 },
      3: { 2: 1, 3: 46 },
      4: { 2: 1, 3: 5, 4: 91 },
      5: { 3: 2, 4: 12, 5: 810 },
      6: { 3: 1, 4: 4, 5: 70, 6: 1600 },
      7: { 4: 2, 5: 20, 6: 360, 7: 7000 },
      8: { 5: 12, 6: 98, 7: 1550, 8: 10000 },
      9: { 5: 6, 6: 44, 7: 335, 8: 4700, 9: 10000 },
      10: { 5: 2, 6: 24, 7: 142, 8: 1000, 9: 4500, 10: 10000 }
    };

    setTimeout(() => {
      const multiplier = payouts[selectedNumbers.length]?.[matches] || 0;
      const winAmount = bet * multiplier;

      if (winAmount > 0) {
        onBalanceChange(balance - bet + winAmount);
        toast.success(`${matches} Treffer! Gewinn: ${winAmount} Chips`);
      } else {
        toast.error(`${matches} Treffer - Kein Gewinn`);
      }
      
      setTimeout(() => {
        setIsPlaying(false);
        setDrawnNumbers([]);
      }, 3000);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-gold">Keno</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BetSelector balance={balance} selectedBet={bet} onBetChange={setBet} />

        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Gewählt: {selectedNumbers.length}/10 Zahlen
          </p>
        </div>

        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const isDrawn = drawnNumbers.includes(num);
            const isMatch = isSelected && isDrawn;

            return (
              <Button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={isPlaying}
                className={`aspect-square p-0 ${
                  isMatch
                    ? "bg-secondary text-secondary-foreground"
                    : isSelected
                    ? "bg-primary text-primary-foreground"
                    : isDrawn
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                variant={isSelected || isDrawn ? "default" : "outline"}
              >
                {num}
              </Button>
            );
          })}
        </div>

        <Button 
          onClick={play} 
          disabled={isPlaying || selectedNumbers.length === 0}
          className="w-full"
          size="lg"
        >
          {isPlaying ? "Ziehung läuft..." : "Spielen"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Keno;