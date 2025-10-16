import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BetSelector from './BetSelector';
import { CircleDot } from 'lucide-react';

interface PlinkoProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const Plinko = ({ balance, onBalanceChange, onBack }: PlinkoProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  // Multipliers for landing positions (16 positions)
  const multipliers = [16, 9, 4, 2, 1, 0.5, 0.3, 0.5, 0.5, 0.3, 0.5, 1, 2, 4, 9, 16];

  const dropBall = async () => {
    if (betAmount > balance) return;

    setPlaying(true);
    onBalanceChange(balance - betAmount);
    setResult(null);

    // Simulate ball drop
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Random position (more likely to land in center)
    const gaussianRandom = () => {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const randomPos = Math.round((gaussianRandom() * 2.5) + 7.5);
    const position = Math.max(0, Math.min(15, randomPos));
    
    setResult(position);

    const multiplier = multipliers[position];
    const winAmount = Math.floor(betAmount * multiplier);
    onBalanceChange(balance - betAmount + winAmount);
    setPlaying(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="outline" className="mb-6">
        ← Zurück zur Lobby
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-gold flex items-center gap-2">
            <CircleDot className="w-6 h-6" />
            Plinko
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plinko Board */}
          <div className="bg-gradient-to-br from-secondary/30 via-secondary/10 to-background rounded-xl border-2 border-primary/20 p-8 shadow-2xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none"></div>
            
            <div className="relative h-80 flex items-center justify-center">
              {playing ? (
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-bounce text-7xl drop-shadow-2xl filter">
                      🔴
                    </div>
                    <div className="absolute inset-0 blur-xl bg-red-500/30 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-muted-foreground mt-6 font-medium animate-pulse">Ball fällt...</p>
                </div>
              ) : result !== null ? (
                <div className="text-center animate-scale-in">
                  <div className="relative inline-block mb-6">
                    <div className="text-6xl font-black text-gradient-gold drop-shadow-lg">
                      {multipliers[result]}x
                    </div>
                    <div className="absolute inset-0 blur-2xl bg-primary/40 animate-pulse"></div>
                  </div>
                  <p className={`text-2xl font-bold drop-shadow-md ${
                    multipliers[result] >= 1 ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {multipliers[result] >= 1 
                      ? `🎉 Gewonnen! +${Math.floor(betAmount * multipliers[result]).toLocaleString()}`
                      : `+${Math.floor(betAmount * multipliers[result]).toLocaleString()}`
                    }
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-4">🎯 Bereit?</p>
                  <p className="text-sm text-muted-foreground/70">Lassen Sie den Ball fallen!</p>
                </div>
              )}
            </div>

            {/* Multiplier Display */}
            <div className="grid grid-cols-16 gap-1 mt-6 relative">
              {multipliers.map((mult, index) => (
                <div
                  key={index}
                  className={`relative text-center p-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    result === index 
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50 ring-2 ring-primary animate-pulse" 
                      : "bg-gradient-to-b from-muted to-muted/50 hover:scale-105"
                  } ${
                    mult >= 4 
                      ? "text-green-400 font-extrabold" 
                      : mult >= 1 
                      ? "text-yellow-400 font-bold" 
                      : "text-red-400"
                  }`}
                >
                  {mult}x
                  {mult >= 4 && <div className="absolute -top-1 -right-1 text-xs">💎</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <BetSelector 
              balance={balance}
              selectedBet={betAmount}
              onBetChange={setBetAmount}
            />

            <Button 
              className="w-full"
              size="lg"
              onClick={dropBall}
              disabled={betAmount > balance || playing}
            >
              {playing ? "Ball fällt..." : "Ball fallen lassen"}
            </Button>
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground text-center">
            <p>Höhere Multiplikatoren an den Rändern, aber schwerer zu erreichen!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Plinko;
