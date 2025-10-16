import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCw } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

interface BingoProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Bingo = ({ balance, onBalanceChange }: BingoProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [bingoCard, setBingoCard] = useState<number[][]>([]);
  const [marked, setMarked] = useState<boolean[][]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"betting" | "playing" | "won">("betting");
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 3x, 4x

  const generateBingoCard = () => {
    const card: number[][] = [];
    for (let col = 0; col < 5; col++) {
      const column: number[] = [];
      const min = col * 15 + 1;
      const max = min + 14;
      const availableNumbers = Array.from({ length: 15 }, (_, i) => min + i);
      
      for (let row = 0; row < 5; row++) {
        if (col === 2 && row === 2) {
          column.push(0); // Free space
        } else {
          const randomIndex = Math.floor(Math.random() * availableNumbers.length);
          column.push(availableNumbers.splice(randomIndex, 1)[0]);
        }
      }
      card.push(column);
    }
    return card;
  };

  const startGame = () => {
    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    onBalanceChange(balance - selectedBet);
    const newCard = generateBingoCard();
    setBingoCard(newCard);
    setMarked(Array(5).fill(null).map(() => Array(5).fill(false)));
    setMarked(prev => {
      const newMarked = [...prev];
      newMarked[2][2] = true; // Free space
      return newMarked;
    });
    setCalledNumbers([]);
    setCurrentNumber(null);
    setGameState("playing");
    setAutoPlay(true);
  };

  useEffect(() => {
    if (autoPlay && gameState === "playing") {
      const baseSpeed = 1500;
      const interval = setInterval(() => {
        callNumber();
      }, baseSpeed / speed);
      return () => clearInterval(interval);
    }
  }, [autoPlay, gameState, calledNumbers, speed]);

  const callNumber = () => {
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    const remaining = allNumbers.filter(n => !calledNumbers.includes(n));
    
    if (remaining.length === 0) {
      setAutoPlay(false);
      toast.info("Alle Zahlen wurden gezogen!");
      return;
    }

    const newNumber = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentNumber(newNumber);
    setCalledNumbers(prev => [...prev, newNumber]);

    // Auto-mark if number is on card
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 5; row++) {
        if (bingoCard[col][row] === newNumber) {
          setMarked(prev => {
            const newMarked = [...prev];
            newMarked[col][row] = true;
            return newMarked;
          });
          
          // Check for win after marking
          setTimeout(() => checkWin(), 100);
        }
      }
    }
  };

  const checkWin = () => {
    // Reduced win chance - only check for complete patterns after more numbers
    if (calledNumbers.length < 25) return; // Need at least 25 numbers called

    // Check rows
    for (let row = 0; row < 5; row++) {
      if (marked.every(col => col[row])) {
        winGame("Horizontale Linie!");
        return;
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (marked[col].every(cell => cell)) {
        winGame("Vertikale Linie!");
        return;
      }
    }

    // Check diagonals
    if (marked[0][0] && marked[1][1] && marked[2][2] && marked[3][3] && marked[4][4]) {
      winGame("Diagonale!");
      return;
    }
    if (marked[0][4] && marked[1][3] && marked[2][2] && marked[3][1] && marked[4][0]) {
      winGame("Diagonale!");
      return;
    }
  };

  const winGame = (winType: string) => {
    setAutoPlay(false);
    setGameState("won");
    const winAmount = selectedBet * 10;
    onBalanceChange(balance - selectedBet + winAmount);
    toast.success(`🎉 BINGO! ${winType} - Gewinn: ${winAmount}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Bingo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Number */}
        {currentNumber && gameState === "playing" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent text-4xl font-bold animate-scale-in glow-effect">
              {currentNumber}
            </div>
          </div>
        )}

        {/* Bingo Card */}
        {bingoCard.length > 0 && (
          <div className="bg-secondary/20 rounded-lg p-4 border-2 border-secondary/50">
            <div className="grid grid-cols-5 gap-1 mb-2">
              {["B", "I", "N", "G", "O"].map(letter => (
                <div key={letter} className="text-center font-bold text-xl text-primary">
                  {letter}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {bingoCard.map((col, colIndex) =>
                col.map((num, rowIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`aspect-square rounded flex items-center justify-center font-bold transition-all ${
                      marked[colIndex][rowIndex]
                        ? "bg-primary text-primary-foreground glow-effect scale-110"
                        : "bg-background text-foreground"
                    } ${num === 0 ? "bg-accent" : ""} border-2 border-border`}
                  >
                    {num === 0 ? "★" : num}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Stats & Speed Control */}
        {gameState === "playing" && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Badge variant="outline">
                Gezogen: {calledNumbers.length}/75
              </Badge>
              <Badge variant="outline">
                Letzte 5: {calledNumbers.slice(-5).join(", ")}
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              <span className="text-sm text-muted-foreground self-center">Geschwindigkeit:</span>
              {[1, 2, 3, 4].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={speed === s ? "default" : "outline"}
                  onClick={() => setSpeed(s)}
                  className="w-12"
                >
                  {s}x
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Betting */}
        {gameState === "betting" && (
          <>
            <BetSelector
              balance={balance}
              selectedBet={selectedBet}
              onBetChange={setSelectedBet}
            />
            <Button
              className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
              onClick={startGame}
              disabled={balance < selectedBet}
            >
              <Play className="w-5 h-5 mr-2" />
              Spiel starten
            </Button>
          </>
        )}

        {/* New Game */}
        {gameState === "won" && (
          <Button
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
            onClick={() => setGameState("betting")}
          >
            <RotateCw className="w-5 h-5 mr-2" />
            Neue Runde
          </Button>
        )}

        {gameState === "playing" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setAutoPlay(false);
              setGameState("betting");
            }}
          >
            Spiel abbrechen
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Bingo;
