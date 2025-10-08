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
          <div className="bg-gradient-to-br from-muted to-background rounded-lg border-2 border-border p-6">
            <div className="relative h-64 flex items-center justify-center">
              {playing ? (
                <div className="text-center">
                  <div className="animate-bounce text-6xl">🔴</div>
                  <p className="text-muted-foreground mt-4">Ball fällt...</p>
                </div>
              ) : result !== null ? (
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient-gold mb-4">
                    {multipliers[result]}x
                  </div>
                  <p className={`text-xl font-bold ${
                    multipliers[result] >= 1 ? "text-green-500" : "text-yellow-500"
                  }`}>
                    {multipliers[result] >= 1 
                      ? `Gewonnen! +${Math.floor(betAmount * multipliers[result]).toLocaleString()}`
                      : `+${Math.floor(betAmount * multipliers[result]).toLocaleString()}`
                    }
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Lassen Sie den Ball fallen!</p>
              )}
            </div>

            {/* Multiplier Display */}
            <div className="grid grid-cols-16 gap-1 mt-4">
              {multipliers.map((mult, index) => (
                <div
                  key={index}
                  className={`text-center p-1 rounded text-xs font-bold ${
                    result === index ? "bg-primary text-primary-foreground" : "bg-muted"
                  } ${
                    mult >= 4 ? "text-green-500" : mult >= 1 ? "text-yellow-500" : "text-red-500"
                  }`}
                >
                  {mult}x
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
