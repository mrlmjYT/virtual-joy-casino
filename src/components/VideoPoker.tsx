import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, RotateCw } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

interface VideoPokerProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

type CardType = { suit: string; value: string; numValue: number };

const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const VideoPoker = ({ balance, onBalanceChange }: VideoPokerProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [hand, setHand] = useState<CardType[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [gameState, setGameState] = useState<"betting" | "draw" | "result">("betting");
  const [result, setResult] = useState<{ name: string; payout: number } | null>(null);

  const createDeck = (): CardType[] => {
    const deck: CardType[] = [];
    for (const suit of suits) {
      for (let i = 0; i < values.length; i++) {
        deck.push({ suit, value: values[i], numValue: i + 2 });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const deal = () => {
    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    onBalanceChange(balance - selectedBet);
    const deck = createDeck();
    setHand(deck.slice(0, 5));
    setHeld([false, false, false, false, false]);
    setGameState("draw");
    setResult(null);
  };

  const draw = () => {
    const deck = createDeck();
    let deckIndex = 0;
    const newHand = hand.map((card, i) => {
      if (!held[i]) {
        return deck[deckIndex++];
      }
      return card;
    });
    
    setHand(newHand);
    setGameState("result");
    evaluateHand(newHand);
  };

  const toggleHold = (index: number) => {
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };

  const evaluateHand = (hand: CardType[]) => {
    const values = hand.map(c => c.numValue).sort((a, b) => a - b);
    const suits = hand.map(c => c.suit);
    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = values.every((v, i) => i === 0 || v === values[i - 1] + 1) ||
                      (values[0] === 2 && values[4] === 14 && values[1] === 3 && values[2] === 4 && values[3] === 5);

    let handResult = { name: "Nichts", payout: 0 };

    if (isStraight && isFlush && values[4] === 14) {
      handResult = { name: "Royal Flush!", payout: selectedBet * 250 };
    } else if (isStraight && isFlush) {
      handResult = { name: "Straight Flush!", payout: selectedBet * 50 };
    } else if (counts[0] === 4) {
      handResult = { name: "Vierling!", payout: selectedBet * 25 };
    } else if (counts[0] === 3 && counts[1] === 2) {
      handResult = { name: "Full House!", payout: selectedBet * 9 };
    } else if (isFlush) {
      handResult = { name: "Flush!", payout: selectedBet * 6 };
    } else if (isStraight) {
      handResult = { name: "Straight!", payout: selectedBet * 4 };
    } else if (counts[0] === 3) {
      handResult = { name: "Drilling!", payout: selectedBet * 3 };
    } else if (counts[0] === 2 && counts[1] === 2) {
      handResult = { name: "Zwei Paare!", payout: selectedBet * 2 };
    } else if (counts[0] === 2) {
      const pairValue = Object.keys(valueCounts).find(k => valueCounts[parseInt(k)] === 2);
      if (pairValue && (parseInt(pairValue) >= 11 || parseInt(pairValue) === 14)) {
        handResult = { name: "Hohe Paar!", payout: selectedBet * 1 };
      }
    }

    setResult(handResult);

    if (handResult.payout > 0) {
      onBalanceChange(balance - selectedBet + handResult.payout);
      toast.success(`🎉 ${handResult.name} - Gewinn: ${handResult.payout}`);
    } else {
      toast.error("Leider kein Gewinn!");
    }
  };

  const renderCard = (card: CardType, index: number) => {
    const isRed = ["♥", "♦"].includes(card.suit);
    return (
      <div className="relative">
        <button
          onClick={() => gameState === "draw" && toggleHold(index)}
          disabled={gameState !== "draw"}
          className={`w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center font-bold transition-all ${
            held[index] ? "ring-4 ring-primary translate-y-[-10px]" : ""
          } ${
            isRed ? "text-accent" : "text-foreground"
          } bg-background border-border hover:scale-105`}
        >
          <div className="text-xl">{card.value}</div>
          <div className="text-3xl">{card.suit}</div>
        </button>
        {gameState === "draw" && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            {held[index] ? (
              <Lock className="w-5 h-5 text-primary" />
            ) : (
              <Unlock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Video Poker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hand */}
        {hand.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap">
            {hand.map((card, i) => (
              <div key={i}>{renderCard(card, i)}</div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {gameState === "draw" && (
          <p className="text-center text-sm text-muted-foreground">
            Klicken Sie auf Karten zum Halten, dann auf DRAW
          </p>
        )}

        {/* Result */}
        {result && gameState === "result" && (
          <div className="text-center">
            <Badge className="text-lg py-2 px-4 bg-accent animate-pulse-slow">
              {result.name}
              {result.payout > 0 && ` - Gewinn: ${result.payout}`}
            </Badge>
          </div>
        )}

        {/* Paytable */}
        <div className="bg-muted/30 rounded-lg p-3 text-xs">
          <div className="grid grid-cols-2 gap-1">
            <div>Royal Flush: 250x</div>
            <div>Straight Flush: 50x</div>
            <div>Vierling: 25x</div>
            <div>Full House: 9x</div>
            <div>Flush: 6x</div>
            <div>Straight: 4x</div>
            <div>Drilling: 3x</div>
            <div>Zwei Paare: 2x</div>
          </div>
        </div>

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
              onClick={deal}
              disabled={balance < selectedBet}
            >
              Deal
            </Button>
          </>
        )}

        {/* Draw */}
        {gameState === "draw" && (
          <Button
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
            onClick={draw}
          >
            Draw
          </Button>
        )}

        {/* New Game */}
        {gameState === "result" && (
          <Button
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect"
            onClick={() => setGameState("betting")}
          >
            <RotateCw className="w-5 h-5 mr-2" />
            Neue Runde
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPoker;
