import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BetSelector from './BetSelector';
import { TrendingUp } from 'lucide-react';

interface CrashProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const Crash = ({ balance, onBalanceChange, onBack }: CrashProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [gameState, setGameState] = useState<"betting" | "playing" | "crashed">("betting");
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [cashoutMultiplier, setCashoutMultiplier] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameState === "playing") {
      intervalRef.current = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.01;
          if (next >= crashPoint) {
            crash();
            return crashPoint;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, crashPoint]);

  const generateCrashPoint = () => {
    // Generates a crash point with house edge
    const r = Math.random();
    return Math.max(1.00, Math.floor((99 / (r * 99)) * 100) / 100);
  };

  const startGame = () => {
    if (betAmount > balance) return;

    onBalanceChange(balance - betAmount);
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    setMultiplier(1.00);
    setCashoutMultiplier(0);
    setGameState("playing");
  };

  const cashout = () => {
    if (gameState !== "playing") return;

    const winAmount = Math.floor(betAmount * multiplier);
    onBalanceChange(balance + winAmount);
    setCashoutMultiplier(multiplier);
    setGameState("crashed");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const crash = () => {
    setGameState("crashed");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetGame = () => {
    setGameState("betting");
    setMultiplier(1.00);
    setCrashPoint(0);
    setCashoutMultiplier(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="outline" className="mb-6">
        ← Zurück zur Lobby
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-gold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Crash Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multiplier Display */}
          <div className="relative h-64 bg-gradient-to-br from-muted to-background rounded-lg border-2 border-border flex items-center justify-center overflow-hidden">
            {gameState === "betting" && (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Warten auf Start...</p>
              </div>
            )}
            {(gameState === "playing" || gameState === "crashed") && (
              <div className="text-center">
                <div className={`text-7xl font-bold ${
                  gameState === "crashed" && cashoutMultiplier === 0 
                    ? "text-destructive" 
                    : gameState === "crashed" 
                    ? "text-green-500" 
                    : "text-gradient-gold"
                }`}>
                  {multiplier.toFixed(2)}x
                </div>
                {gameState === "crashed" && (
                  <div className="mt-4">
                    {cashoutMultiplier > 0 ? (
                      <p className="text-green-500 text-xl font-bold">
                        Gewonnen! +{Math.floor(betAmount * cashoutMultiplier).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-destructive text-xl font-bold">
                        Abgestürzt bei {crashPoint.toFixed(2)}x!
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          {gameState === "betting" && (
            <div className="space-y-4">
              <BetSelector 
                balance={balance}
                selectedBet={betAmount}
                onBetChange={setBetAmount}
              />
              <Button 
                className="w-full"
                size="lg"
                onClick={startGame}
                disabled={betAmount > balance}
              >
                Spiel starten
              </Button>
            </div>
          )}

          {gameState === "playing" && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={cashout}
            >
              Auszahlen {Math.floor(betAmount * multiplier).toLocaleString()}
            </Button>
          )}

          {gameState === "crashed" && (
            <Button 
              className="w-full"
              size="lg"
              onClick={resetGame}
            >
              Neues Spiel
            </Button>
          )}

          {/* Info */}
          <div className="text-sm text-muted-foreground text-center">
            <p>Cashout bevor der Multiplikator abstürzt!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crash;
