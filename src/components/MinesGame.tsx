import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BetSelector from "./BetSelector";
import { toast } from "sonner";
import { Bomb, Diamond } from "lucide-react";

interface MinesGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const MinesGame = ({ balance, onBalanceChange }: MinesGameProps) => {
  const [bet, setBet] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gemsFound, setGemsFound] = useState(0);

  const startGame = () => {
    if (balance < bet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    onBalanceChange(balance - bet);
    
    // Generate random mine positions
    const positions: number[] = [];
    while (positions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }

    setMinePositions(positions);
    setRevealed(Array(25).fill(false));
    setGameActive(true);
    setCurrentMultiplier(1);
    setGemsFound(0);
  };

  const revealTile = (index: number) => {
    if (!gameActive || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (minePositions.includes(index)) {
      // Hit a mine - game over
      setGameActive(false);
      setRevealed(Array(25).fill(true));
      toast.error("💣 Mine getroffen! Spiel verloren!");
    } else {
      // Found a gem
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);
      
      // Calculate multiplier based on gems found and mines
      const safeSpots = 25 - mineCount;
      const multiplierIncrease = 1 + (newGemsFound * (mineCount / safeSpots));
      setCurrentMultiplier(multiplierIncrease);
      
      toast.success(`💎 Diamant gefunden! Multiplikator: ${multiplierIncrease.toFixed(2)}x`);
    }
  };

  const cashOut = () => {
    if (!gameActive) return;

    const winAmount = Math.floor(bet * currentMultiplier);
    onBalanceChange(balance - bet + winAmount);
    setGameActive(false);
    setRevealed(Array(25).fill(true));
    toast.success(`Auszahlung: ${winAmount} Chips!`);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-gradient-gold">Mines (Minenfeld)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!gameActive && (
          <>
            <BetSelector balance={balance} selectedBet={bet} onBetChange={setBet} />
            
            <div>
              <label className="block text-sm font-medium mb-2">Anzahl Minen: {mineCount}</label>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map((count) => (
                  <Button
                    key={count}
                    variant={mineCount === count ? "default" : "outline"}
                    onClick={() => setMineCount(count)}
                    size="sm"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {gameActive && (
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-primary">
              Multiplikator: {currentMultiplier.toFixed(2)}x
            </p>
            <p className="text-lg text-muted-foreground">
              Diamanten gefunden: {gemsFound} / {25 - mineCount}
            </p>
            <p className="text-lg font-medium">
              Aktueller Gewinn: {Math.floor(bet * currentMultiplier)} Chips
            </p>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {Array.from({ length: 25 }).map((_, index) => (
            <Button
              key={index}
              onClick={() => revealTile(index)}
              disabled={!gameActive || revealed[index]}
              className="aspect-square p-0 text-2xl"
              variant={revealed[index] ? "default" : "outline"}
            >
              {revealed[index] ? (
                minePositions.includes(index) ? (
                  <Bomb className="w-6 h-6 text-destructive" />
                ) : (
                  <Diamond className="w-6 h-6 text-secondary" />
                )
              ) : (
                "?"
              )}
            </Button>
          ))}
        </div>

        {gameActive ? (
          <Button onClick={cashOut} className="w-full" size="lg" variant="secondary">
            Auszahlen ({Math.floor(bet * currentMultiplier)} Chips)
          </Button>
        ) : (
          <Button onClick={startGame} className="w-full" size="lg">
            Neues Spiel starten
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MinesGame;