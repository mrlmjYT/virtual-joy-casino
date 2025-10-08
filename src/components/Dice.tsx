import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import BetSelector from './BetSelector';
import { Dices } from 'lucide-react';

interface DiceProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const Dice = ({ balance, onBalanceChange, onBack }: DiceProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [rollUnder, setRollUnder] = useState(50);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [rolling, setRolling] = useState(false);

  const multiplier = (99 / rollUnder).toFixed(2);
  const winChance = rollUnder;

  const rollDice = async () => {
    if (betAmount > balance) return;

    setRolling(true);
    onBalanceChange(balance - betAmount);

    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const roll = Math.floor(Math.random() * 100) + 1;
    setLastRoll(roll);

    if (roll < rollUnder) {
      const winAmount = Math.floor(betAmount * parseFloat(multiplier));
      onBalanceChange(balance - betAmount + winAmount);
      setResult("win");
    } else {
      setResult("lose");
    }

    setRolling(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="outline" className="mb-6">
        ← Zurück zur Lobby
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-gold flex items-center gap-2">
            <Dices className="w-6 h-6" />
            Dice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Result Display */}
          <div className="h-48 bg-gradient-to-br from-muted to-background rounded-lg border-2 border-border flex items-center justify-center">
            {lastRoll === null ? (
              <p className="text-muted-foreground">Werfen Sie den Würfel!</p>
            ) : (
              <div className="text-center">
                <div className={`text-7xl font-bold ${rolling ? "animate-pulse" : ""} ${
                  result === "win" ? "text-green-500" : "text-destructive"
                }`}>
                  {lastRoll}
                </div>
                {!rolling && result && (
                  <p className={`mt-4 text-xl font-bold ${
                    result === "win" ? "text-green-500" : "text-destructive"
                  }`}>
                    {result === "win" 
                      ? `Gewonnen! +${Math.floor(betAmount * parseFloat(multiplier)).toLocaleString()}`
                      : `Verloren!`
                    }
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <BetSelector 
              balance={balance}
              selectedBet={betAmount}
              onBetChange={setBetAmount}
            />

            {/* Roll Under Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gewinnzahl unter:</span>
                <span className="font-bold">{rollUnder}</span>
              </div>
              <Slider
                value={[rollUnder]}
                onValueChange={(value) => setRollUnder(value[0])}
                min={2}
                max={98}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2</span>
                <span>98</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Multiplikator</p>
                <p className="text-xl font-bold text-primary">{multiplier}x</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">Gewinnchance</p>
                <p className="text-xl font-bold text-primary">{winChance}%</p>
              </div>
            </div>

            {/* Roll Button */}
            <Button 
              className="w-full"
              size="lg"
              onClick={rollDice}
              disabled={betAmount > balance || rolling}
            >
              {rolling ? "Würfelt..." : "Würfeln"}
            </Button>
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground text-center">
            <p>Würfeln Sie eine Zahl unter {rollUnder} um zu gewinnen!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dice;
