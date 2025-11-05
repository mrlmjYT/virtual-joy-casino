import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCw, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

// Assets
import cherry from "@/assets/slots/cherry.png";
import lemon from "@/assets/slots/lemon.png";
import orange from "@/assets/slots/orange.png";
import grapes from "@/assets/slots/grapes.png";
import diamond from "@/assets/slots/diamond.png"; // SPECIAL symbol
import star from "@/assets/slots/star.png";
import seven from "@/assets/slots/seven.png";

interface SlotMachineProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

type SymbolKey =
  | "cherry"
  | "lemon"
  | "orange"
  | "grapes"
  | "diamond"
  | "star"
  | "seven";

const SYMBOLS: { key: SymbolKey; src: string; alt: string; special?: boolean; weight: number }[] = [
  { key: "cherry", src: cherry, alt: "Kirsche", weight: 3 },
  { key: "lemon", src: lemon, alt: "Zitrone", weight: 3 },
  { key: "orange", src: orange, alt: "Orange", weight: 3 },
  { key: "grapes", src: grapes, alt: "Trauben", weight: 3 },
  { key: "star", src: star, alt: "Stern", weight: 2 },
  { key: "seven", src: seven, alt: "Sieben", weight: 1 },
  { key: "diamond", src: diamond, alt: "Diamant", special: true, weight: 1 },
];

// Payout table for collected specials (diamonds)
const SPECIAL_PAYOUT: Record<number, number> = {
  1: 1,
  2: 2,
  3: 5,
  4: 12,
  5: 40,
  6: 200, // ULTRA JACKPOT
};

const pickRandomSymbol = (excludeSpecialChance = false): SymbolKey => {
  // Weighted random. If excludeSpecialChance is true, we slightly reduce diamond odds for respins fairness
  const pool = SYMBOLS.flatMap((s) =>
    Array(Math.max(1, s.key === "diamond" && excludeSpecialChance ? s.weight : s.weight)).fill(s.key),
  );
  return pool[Math.floor(Math.random() * pool.length)];
};

const SlotMachine = ({ balance, onBalanceChange }: SlotMachineProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [slots, setSlots] = useState<SymbolKey[]>(Array(6).fill("cherry" as SymbolKey));
  const [reelSymbols, setReelSymbols] = useState<SymbolKey[][]>(
    Array(6).fill(null).map(() => Array(5).fill("cherry" as SymbolKey))
  );
  const [locked, setLocked] = useState<boolean[]>(Array(6).fill(false));
  const [spinning, setSpinning] = useState(false);
  const [spinningReels, setSpinningReels] = useState<boolean[]>(Array(6).fill(false));
  const [lastWin, setLastWin] = useState(0);
  const [specialCount, setSpecialCount] = useState(0);
  const spinTimeout = useRef<number | null>(null);

  useEffect(() => () => {
    if (spinTimeout.current) window.clearTimeout(spinTimeout.current);
  }, []);

  const generateReelSymbols = (locked: boolean, currentSymbol?: SymbolKey): SymbolKey[] => {
    if (locked && currentSymbol) {
      return Array(5).fill(currentSymbol);
    }
    return Array(5).fill(null).map(() => pickRandomSymbol());
  };

  const spinOnce = (currentLocked: boolean[], prevSlots?: SymbolKey[]) => {
    // Generate symbols for each reel (5 symbols per reel)
    const newReelSymbols = (prevSlots ?? slots).map((sym, i) => 
      generateReelSymbols(currentLocked[i], sym)
    );
    setReelSymbols(newReelSymbols);
    
    // Animate spinning reels
    const reelsToSpin = currentLocked.map(l => !l);
    setSpinningReels(reelsToSpin);
    
    // After animation, determine middle symbol (position 2) as result
    setTimeout(() => {
      const newSlots = newReelSymbols.map(reel => reel[2]); // Middle position
      setSlots(newSlots);
      setSpinningReels(Array(6).fill(false));

      // Lock newly landed specials
      const updatedLocked = [...currentLocked];
      let newSpecials = 0;
      newSlots.forEach((k, i) => {
        if (k === "diamond" && !updatedLocked[i]) {
          updatedLocked[i] = true;
          newSpecials++;
        }
      });
      setLocked(updatedLocked);

      return { newSlots, updatedLocked, newSpecials };
    }, 800);

    return { newSlots: prevSlots ?? slots, updatedLocked: currentLocked, newSpecials: 0 };
  };

  const resolveRespins = (currentLocked: boolean[], currentSlots: SymbolKey[], currentCount: number) => {
    // Continue respinning until no new specials or 6 reached
    if (currentCount >= 6) {
      finishSpin(currentCount);
      return;
    }

    spinTimeout.current = window.setTimeout(() => {
      const { newSlots, updatedLocked, newSpecials } = spinOnce(currentLocked, currentSlots);
      const total = currentCount + newSpecials;
      setSpecialCount(total);

      if (newSpecials === 0) {
        finishSpin(total);
      } else {
        // Animate and continue
        resolveRespins(updatedLocked, newSlots, total);
      }
    }, 400);
  };

  const finishSpin = (totalSpecials: number) => {
    setSpinning(false);
    let winAmount = 0;
    if (totalSpecials > 0) {
      const multiplier = SPECIAL_PAYOUT[totalSpecials] ?? 0;
      winAmount = selectedBet * multiplier;
      if (totalSpecials === 6) {
        toast.success("💎 ULTRA JACKPOT! 6x Diamant!", { duration: 4000 });
      } else {
        toast.success(`Diamanten gesammelt: ${totalSpecials}/6`);
      }
    } else {
      toast.info("Kein Diamant – viel Glück beim nächsten Spin!");
    }

    if (winAmount > 0) {
      setLastWin(winAmount);
      onBalanceChange(balance - selectedBet + winAmount);
    }
  };

  const spin = () => {
    if (spinning) return;
    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    // Deduct bet once
    onBalanceChange(balance - selectedBet);
    setSpinning(true);
    setLastWin(0);
    setSpecialCount(0);
    const initialLocked = Array(6).fill(false);
    setLocked(initialLocked);

    // Initial spin
    const { newSlots, updatedLocked, newSpecials } = spinOnce(initialLocked);
    const total = newSpecials;
    setSpecialCount(total);

    // Start respin chain if at least one special
    resolveRespins(updatedLocked, newSlots, total);
  };

  const symbolData = useMemo(() =>
    slots.map((key) => SYMBOLS.find((s) => s.key === key)!),
  [slots]);

  return (
    <Card className="w-full max-w-xl mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Slots: Diamond Respin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reels - 6 vertical columns with 5 visible symbols each */}
        <div className="bg-secondary/20 rounded-lg p-4 border-2 border-secondary/50">
          <div className="flex gap-2 justify-center">
            {reelSymbols.map((reel, reelIndex) => (
              <div
                key={reelIndex}
                className={`relative bg-background rounded-lg border-2 overflow-hidden ${
                  locked[reelIndex] ? "border-accent ring-2 ring-accent shadow-lg" : "border-border"
                }`}
                style={{ width: "60px", height: "300px" }}
              >
                {/* Scrolling symbols container */}
                <div
                  className={`absolute inset-0 flex flex-col transition-transform ${
                    spinningReels[reelIndex] ? "animate-slot-spin" : ""
                  }`}
                >
                  {reel.map((symbolKey, symbolIndex) => {
                    const sym = SYMBOLS.find((s) => s.key === symbolKey)!;
                    return (
                      <div
                        key={`${reelIndex}-${symbolIndex}`}
                        className="flex items-center justify-center"
                        style={{ height: "60px" }}
                      >
                        <img
                          src={sym.src}
                          alt={sym.alt}
                          loading="lazy"
                          className={`w-10 h-10 object-contain ${
                            locked[reelIndex] && symbolIndex === 2 ? "animate-pulse" : ""
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Middle position indicator */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-[60px] border-y-2 border-primary/30" />
                </div>

                {/* Lock indicator */}
                {locked[reelIndex] && (
                  <div className="absolute top-1 right-1 text-xs bg-accent/90 text-accent-foreground px-1.5 py-0.5 rounded-md font-bold">
                    LOCK
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Special progress */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <img src={diamond} alt="Diamant" className="w-6 h-6" />
            <span className="text-sm text-muted-foreground font-bold">
              Diamanten: {specialCount}/6
            </span>
          </div>
        </div>

        {/* Bet Selector */}
        <BetSelector balance={balance} selectedBet={selectedBet} onBetChange={setSelectedBet} />

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
          <p className="text-center text-sm text-destructive">Nicht genug Guthaben. Holen Sie sich Ihren Tagesbonus!</p>
        )}

        {/* Legend */}
        <div className="text-xs text-muted-foreground text-center">
          Diamanten bleiben stehen und lösen Re-Spins aus. Erreiche 6 Diamanten für den ULTRA JACKPOT!
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotMachine;
