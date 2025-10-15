import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BetSelector from "./BetSelector";
import { toast } from "sonner";

interface WheelOfFortuneProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const WheelOfFortune = ({ balance, onBalanceChange }: WheelOfFortuneProps) => {
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const segments = [
    { multiplier: 1, color: "bg-primary", label: "1x" },
    { multiplier: 2, color: "bg-secondary", label: "2x" },
    { multiplier: 0, color: "bg-destructive", label: "0x" },
    { multiplier: 5, color: "bg-accent", label: "5x" },
    { multiplier: 1, color: "bg-primary", label: "1x" },
    { multiplier: 2, color: "bg-secondary", label: "2x" },
    { multiplier: 0, color: "bg-destructive", label: "0x" },
    { multiplier: 10, color: "bg-primary", label: "10x" },
  ];

  const spin = () => {
    if (balance < bet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setIsSpinning(true);
    onBalanceChange(balance - bet);
    setLastWin(null);

    const spins = 5 + Math.random() * 3;
    const randomSegment = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    const finalRotation = spins * 360 + randomSegment * segmentAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      const winningSegment = segments[randomSegment];
      const winAmount = bet * winningSegment.multiplier;
      setLastWin(winAmount);

      if (winAmount > 0) {
        onBalanceChange(balance - bet + winAmount);
        toast.success(`Gewinn: ${winAmount} Chips (${winningSegment.label})`);
      } else {
        toast.error("Verloren!");
      }

      setIsSpinning(false);
    }, 4000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-gold">Glücksrad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BetSelector balance={balance} selectedBet={bet} onBetChange={setBet} />

        <div className="relative w-full aspect-square max-w-md mx-auto">
          <div className="absolute inset-0 rounded-full border-8 border-border overflow-hidden">
            <div
              className="w-full h-full transition-transform duration-[4000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right ${segment.color}`}
                  style={{
                    transform: `rotate(${(index * 360) / segments.length}deg)`,
                    clipPath: "polygon(100% 100%, 0% 100%, 50% 0%)",
                  }}
                >
                  <div
                    className="absolute bottom-4 right-4 text-white font-bold text-xl"
                    style={{ transform: "rotate(-45deg)" }}
                  >
                    {segment.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-accent"></div>
          </div>
        </div>

        {lastWin !== null && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {lastWin > 0 ? `+${lastWin} Chips` : "Verloren"}
            </p>
          </div>
        )}

        <Button onClick={spin} disabled={isSpinning} className="w-full" size="lg">
          {isSpinning ? "Rad dreht sich..." : "Drehen"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WheelOfFortune;