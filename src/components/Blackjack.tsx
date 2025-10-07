import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Hand, RotateCw } from "lucide-react";
import { toast } from "sonner";
import BetSelector from "./BetSelector";

interface BlackjackProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

type CardType = { suit: string; value: string; numValue: number };

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const Blackjack = ({ balance, onBalanceChange }: BlackjackProps) => {
  const [selectedBet, setSelectedBet] = useState(10);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer" | "ended">("betting");
  const [gameResult, setGameResult] = useState<string>("");

  const createDeck = (): CardType[] => {
    const deck: CardType[] = [];
    for (const suit of suits) {
      for (const value of values) {
        let numValue = parseInt(value);
        if (value === "A") numValue = 11;
        else if (["J", "Q", "K"].includes(value)) numValue = 10;
        deck.push({ suit, value, numValue });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const calculateHand = (hand: CardType[]): number => {
    let sum = hand.reduce((acc, card) => acc + card.numValue, 0);
    let aces = hand.filter((card) => card.value === "A").length;
    
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const startGame = () => {
    if (balance < selectedBet) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    onBalanceChange(balance - selectedBet);
    const deck = createDeck();
    
    const newPlayerHand = [deck[0], deck[2]];
    const newDealerHand = [deck[1], deck[3]];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState("playing");
    setGameResult("");

    // Check for immediate blackjack
    if (calculateHand(newPlayerHand) === 21) {
      dealerPlay([...newDealerHand], deck.slice(4), newPlayerHand);
    }
  };

  const hit = () => {
    const deck = createDeck();
    const newCard = deck[0];
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const handValue = calculateHand(newHand);
    if (handValue > 21) {
      endGame("bust");
    } else if (handValue === 21) {
      stand();
    }
  };

  const stand = () => {
    setGameState("dealer");
    const deck = createDeck();
    dealerPlay([...dealerHand], deck, playerHand);
  };

  const dealerPlay = (hand: CardType[], deck: CardType[], finalPlayerHand: CardType[]) => {
    let currentHand = [...hand];
    let deckIndex = 0;

    while (calculateHand(currentHand) < 17) {
      currentHand.push(deck[deckIndex++]);
    }

    setDealerHand(currentHand);
    
    const dealerValue = calculateHand(currentHand);
    const playerValue = calculateHand(finalPlayerHand);

    setTimeout(() => {
      if (dealerValue > 21) {
        endGame("dealer-bust");
      } else if (playerValue > dealerValue) {
        endGame("win");
      } else if (playerValue === dealerValue) {
        endGame("push");
      } else {
        endGame("lose");
      }
    }, 1000);
  };

  const endGame = (result: string) => {
    setGameState("ended");
    let winAmount = 0;

    switch (result) {
      case "win":
        winAmount = selectedBet * 2;
        setGameResult("Sie gewinnen!");
        toast.success(`🎉 Gewonnen! +${winAmount}`);
        break;
      case "dealer-bust":
        winAmount = selectedBet * 2;
        setGameResult("Dealer überkauft - Sie gewinnen!");
        toast.success(`🎉 Dealer überkauft! +${winAmount}`);
        break;
      case "push":
        winAmount = selectedBet;
        setGameResult("Unentschieden!");
        toast.info("Unentschieden - Einsatz zurück");
        break;
      case "bust":
        setGameResult("Überkauft - Verloren!");
        toast.error("Überkauft!");
        break;
      case "lose":
        setGameResult("Dealer gewinnt!");
        toast.error("Verloren!");
        break;
    }

    if (winAmount > 0) {
      onBalanceChange(balance - selectedBet + winAmount);
    }
  };

  const renderCard = (card: CardType, hidden = false) => {
    const isRed = ["♥", "♦"].includes(card.suit);
    return (
      <div
        className={`w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center font-bold ${
          hidden
            ? "bg-primary border-primary"
            : `bg-background border-border ${isRed ? "text-accent" : "text-foreground"}`
        }`}
      >
        {hidden ? (
          <div className="text-2xl">🂠</div>
        ) : (
          <>
            <div className="text-xl">{card.value}</div>
            <div className="text-2xl">{card.suit}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-card to-card/80 border-primary/30 glow-effect">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-gradient-gold">Blackjack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dealer Hand */}
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">Dealer Hand</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {dealerHand.map((card, i) => (
              <div key={i}>{renderCard(card, gameState === "playing" && i === 1)}</div>
            ))}
          </div>
          {gameState !== "betting" && gameState !== "playing" && (
            <Badge variant="outline">Wert: {calculateHand(dealerHand)}</Badge>
          )}
        </div>

        {/* Player Hand */}
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">Ihre Hand</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {playerHand.map((card, i) => (
              <div key={i}>{renderCard(card)}</div>
            ))}
          </div>
          {gameState !== "betting" && (
            <Badge className="bg-primary">Wert: {calculateHand(playerHand)}</Badge>
          )}
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className="text-center">
            <Badge className="text-lg py-2 px-4 bg-accent animate-pulse-slow">
              {gameResult}
            </Badge>
          </div>
        )}

        {/* Betting Phase */}
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
              Deal starten
            </Button>
          </>
        )}

        {/* Playing Phase */}
        {gameState === "playing" && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 text-lg"
              onClick={hit}
            >
              <Plus className="w-5 h-5 mr-2" />
              Hit
            </Button>
            <Button
              className="h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={stand}
            >
              <Hand className="w-5 h-5 mr-2" />
              Stand
            </Button>
          </div>
        )}

        {/* New Game */}
        {gameState === "ended" && (
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

export default Blackjack;
