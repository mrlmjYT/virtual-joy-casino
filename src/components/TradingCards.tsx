import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

interface TradingCardsProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const cardRarities = [
  { name: "Common", color: "bg-gray-400", chance: 0.6, value: 50 },
  { name: "Uncommon", color: "bg-green-500", chance: 0.25, value: 150 },
  { name: "Rare", color: "bg-blue-500", chance: 0.1, value: 500 },
  { name: "Epic", color: "bg-purple-500", chance: 0.04, value: 1500 },
  { name: "Legendary", color: "bg-yellow-500", chance: 0.01, value: 5000 },
];

const boosterPacks = [
  { id: 1, name: "Starter Booster", price: 200, cards: 3 },
  { id: 2, name: "Standard Booster", price: 500, cards: 5 },
  { id: 3, name: "Premium Booster", price: 1000, cards: 8 },
  { id: 4, name: "Mystery Booster", price: 2000, cards: 12 },
];

interface CardPull {
  rarity: string;
  color: string;
  value: number;
}

const TradingCards = ({ balance, onBalanceChange }: TradingCardsProps) => {
  const [opening, setOpening] = useState(false);
  const [pulledCards, setPulledCards] = useState<CardPull[]>([]);

  const getRandomCard = (): CardPull => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const rarity of cardRarities) {
      cumulative += rarity.chance;
      if (random <= cumulative) {
        return {
          rarity: rarity.name,
          color: rarity.color,
          value: rarity.value
        };
      }
    }
    
    return {
      rarity: cardRarities[0].name,
      color: cardRarities[0].color,
      value: cardRarities[0].value
    };
  };

  const openBooster = async (booster: typeof boosterPacks[0]) => {
    if (balance < booster.price) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setOpening(true);
    setPulledCards([]);
    onBalanceChange(balance - booster.price);

    // Simulate card pulls
    setTimeout(() => {
      const cards: CardPull[] = [];
      let totalValue = 0;

      for (let i = 0; i < booster.cards; i++) {
        const card = getRandomCard();
        cards.push(card);
        totalValue += card.value;
      }

      setPulledCards(cards);
      onBalanceChange(balance - booster.price + totalValue);

      const profit = totalValue - booster.price;
      if (profit > 0) {
        toast.success(`🎉 Gesamt-Wert: ${totalValue} Chips! (+${profit})`);
      } else {
        toast.error(`Gesamt-Wert: ${totalValue} Chips (${profit})`);
      }

      setOpening(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Trading Card Booster</h3>
        <p className="text-muted-foreground">Öffnen Sie Booster-Packs für seltene Karten!</p>
      </div>

      {pulledCards.length > 0 && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 text-center">Gezogene Karten:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pulledCards.map((card, index) => (
                <div key={index} className={`${card.color} p-4 rounded-lg text-white text-center`}>
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-bold text-sm">{card.rarity}</p>
                  <p className="text-xs">{card.value} Chips</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {boosterPacks.map((booster) => (
          <Card key={booster.id} className="group hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-gradient-to-br from-primary to-accent w-24 h-32 mx-auto rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-12 h-12 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-lg">{booster.name}</h4>
                <Badge variant="secondary" className="mt-2">{booster.price} Chips</Badge>
                <p className="text-sm text-muted-foreground mt-2">{booster.cards} Karten</p>
              </div>

              <Button
                onClick={() => openBooster(booster)}
                disabled={opening || balance < booster.price}
                className="w-full"
              >
                {opening ? "Öffne..." : "Booster öffnen"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-bold mb-2 text-center">Seltenheit & Wert</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {cardRarities.map((rarity) => (
              <div key={rarity.name} className={`${rarity.color} p-3 rounded text-white text-center`}>
                <p className="font-bold text-sm">{rarity.name}</p>
                <p className="text-xs">{(rarity.chance * 100).toFixed(1)}%</p>
                <p className="text-xs">{rarity.value} Chips</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingCards;
