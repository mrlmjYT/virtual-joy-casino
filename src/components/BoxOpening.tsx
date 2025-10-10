import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Sparkles, Watch, Car, Home, Gem, Trophy, Smartphone, Headphones, Shirt, Gift } from "lucide-react";
import { toast } from "sonner";

interface Item {
  name: string;
  value: number;
  icon: any;
  rarity: "common" | "rare" | "epic" | "legendary" | "jackpot";
  color: string;
}

interface BoxOpeningProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const bronzeItems: Item[] = [
  { name: "T-Shirt", value: 20, icon: Shirt, rarity: "common", color: "bg-gray-500" },
  { name: "Kopfhörer", value: 50, icon: Headphones, rarity: "common", color: "bg-gray-500" },
  { name: "Geschenk", value: 80, icon: Gift, rarity: "rare", color: "bg-blue-500" },
  { name: "Smartphone", value: 150, icon: Smartphone, rarity: "epic", color: "bg-purple-500" },
  { name: "Bronze Uhr", value: 300, icon: Watch, rarity: "jackpot", color: "bg-yellow-500" },
];

const silverItems: Item[] = [
  { name: "Kopfhörer Pro", value: 150, icon: Headphones, rarity: "common", color: "bg-gray-500" },
  { name: "Smartphone Pro", value: 300, icon: Smartphone, rarity: "rare", color: "bg-blue-500" },
  { name: "Silber Uhr", value: 600, icon: Watch, rarity: "epic", color: "bg-purple-500" },
  { name: "Diamant", value: 1000, icon: Gem, rarity: "epic", color: "bg-purple-500" },
  { name: "Luxus Uhr", value: 1500, icon: Trophy, rarity: "jackpot", color: "bg-yellow-500" },
];

const goldItems: Item[] = [
  { name: "Designer Uhr", value: 500, icon: Watch, rarity: "common", color: "bg-gray-500" },
  { name: "Gold Diamant", value: 1000, icon: Gem, rarity: "rare", color: "bg-blue-500" },
  { name: "Rolex", value: 1800, icon: Trophy, rarity: "epic", color: "bg-purple-500" },
  { name: "Sportwagen", value: 2500, icon: Car, rarity: "epic", color: "bg-purple-500" },
  { name: "Luxus Auto", value: 3000, icon: Car, rarity: "jackpot", color: "bg-yellow-500" },
];

const diamondItems: Item[] = [
  { name: "Luxus Uhr", value: 1500, icon: Watch, rarity: "common", color: "bg-gray-500" },
  { name: "Sportwagen", value: 3000, icon: Car, rarity: "rare", color: "bg-blue-500" },
  { name: "Diamant Ring", value: 5000, icon: Gem, rarity: "epic", color: "bg-purple-500" },
  { name: "Luxus Villa", value: 8000, icon: Home, rarity: "legendary", color: "bg-red-500" },
  { name: "Supercar", value: 10000, icon: Car, rarity: "jackpot", color: "bg-yellow-500" },
];

const boxes = [
  { id: 1, name: "Bronze Box", price: 100, items: bronzeItems, color: "bg-amber-700" },
  { id: 2, name: "Silver Box", price: 500, items: silverItems, color: "bg-gray-400" },
  { id: 3, name: "Gold Box", price: 1000, items: goldItems, color: "bg-yellow-500" },
  { id: 4, name: "Diamond Box", price: 2500, items: diamondItems, color: "bg-blue-400" },
];

const BoxOpening = ({ balance, onBalanceChange }: BoxOpeningProps) => {
  const [opening, setOpening] = useState(false);
  const [lastWin, setLastWin] = useState<Item | null>(null);
  const [selectedBox, setSelectedBox] = useState<typeof boxes[0] | null>(null);
  const [spinningItems, setSpinningItems] = useState<Item[]>([]);
  const [finalItemIndex, setFinalItemIndex] = useState<number>(0);

  const getRandomItem = (items: Item[]): Item => {
    const random = Math.random();
    
    // Jackpot has 1% chance
    if (random < 0.01) {
      return items[items.length - 1]; // Jackpot is always last
    }
    
    // Distribute other items
    if (random < 0.50) return items[0]; // Common - 49%
    if (random < 0.80) return items[1]; // Rare - 30%
    if (random < 0.95) return items[2]; // Epic - 15%
    return items[3]; // Legendary - 5%
  };

  const openBox = async (box: typeof boxes[0]) => {
    if (balance < box.price) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setOpening(true);
    setSelectedBox(box);
    onBalanceChange(balance - box.price);

    // Create spinning animation with random items
    const wonItem = getRandomItem(box.items);
    const spinItems: Item[] = [];
    
    // Add 20 random items for the spin
    for (let i = 0; i < 20; i++) {
      spinItems.push(box.items[Math.floor(Math.random() * box.items.length)]);
    }
    // Place the won item at a specific position (around 75% through)
    spinItems[15] = wonItem;
    
    setSpinningItems(spinItems);
    setFinalItemIndex(15);

    // Simulate opening animation
    setTimeout(() => {
      const profit = wonItem.value - box.price;
      
      setLastWin(wonItem);
      onBalanceChange(balance - box.price + wonItem.value);
      
      if (wonItem.rarity === "jackpot") {
        toast.success(`🏆 JACKPOT! ${wonItem.name}: ${wonItem.value} Chips!`);
      } else if (profit > 0) {
        toast.success(`🎉 ${wonItem.name}: ${wonItem.value} Chips! (+${profit})`);
      } else {
        toast.error(`${wonItem.name}: ${wonItem.value} Chips (${profit})`);
      }
      
      setOpening(false);
      setSpinningItems([]);
    }, 3500);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Wählen Sie eine Box</h3>
        <p className="text-muted-foreground">Kaufen und öffnen Sie Boxen für die Chance auf große Gewinne!</p>
      </div>

      {opening && spinningItems.length > 0 && (
        <Card className="bg-muted/50 overflow-hidden">
          <CardContent className="p-6">
            <div className="relative h-32 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-1 h-full bg-primary z-10 -translate-x-1/2 -translate-y-1/2" />
              <div 
                className="flex gap-4 absolute left-1/2 top-1/2 -translate-y-1/2"
                style={{
                  animation: "spin-wheel 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
                  transform: `translateX(calc(-50% - ${finalItemIndex * 120}px)) translateY(-50%)`
                }}
              >
                {spinningItems.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div 
                      key={index} 
                      className={`${item.color} min-w-[100px] h-24 rounded-lg flex flex-col items-center justify-center text-white p-2`}
                    >
                      <ItemIcon className="w-8 h-8 mb-1" />
                      <p className="text-xs font-bold text-center">{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {lastWin && !opening && (
        <Card className={`${lastWin.rarity === "jackpot" ? "bg-yellow-500/20 border-yellow-500 animate-pulse" : "bg-primary/10 border-primary"}`}>
          <CardContent className="p-6 text-center">
            <div className={`${lastWin.color} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3`}>
              {(() => {
                const WinIcon = lastWin.icon;
                return <WinIcon className="w-10 h-10 text-white" />;
              })()}
            </div>
            <Badge className="mb-2" variant={lastWin.rarity === "jackpot" ? "default" : "secondary"}>
              {lastWin.rarity === "jackpot" ? "🏆 JACKPOT" : lastWin.rarity.toUpperCase()}
            </Badge>
            <p className="text-2xl font-bold">{lastWin.name}</p>
            <p className="text-xl text-primary">{lastWin.value} Chips</p>
          </CardContent>
        </Card>
      )}

      {selectedBox && !opening && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 text-center">Mögliche Gewinne - {selectedBox.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {selectedBox.items.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div key={index} className={`${item.color} p-4 rounded-lg text-white text-center transition-transform hover:scale-105`}>
                    <ItemIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold text-sm mb-1">{item.name}</p>
                    <p className="text-xs mb-1">{item.value} Chips</p>
                    {item.rarity === "jackpot" && (
                      <Badge className="text-xs bg-yellow-600">Jackpot</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {boxes.map((box) => {
          const jackpotItem = box.items[box.items.length - 1];
          const JackpotIcon = jackpotItem.icon;
          
          return (
            <Card 
              key={box.id} 
              className={`group hover:shadow-lg transition-all cursor-pointer ${selectedBox?.id === box.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedBox(box)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`${box.color} w-24 h-24 mx-auto rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Package className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h4 className="font-bold text-lg">{box.name}</h4>
                  <Badge variant="secondary" className="mt-2">{box.price} Chips</Badge>
                </div>

                <div className="text-sm space-y-1">
                  <p className="font-semibold">Jackpot:</p>
                  <div className="flex items-center justify-center gap-2">
                    <JackpotIcon className="w-4 h-4" />
                    <span className="text-yellow-500 font-bold">{jackpotItem.name}</span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openBox(box);
                  }}
                  disabled={opening || balance < box.price}
                  className="w-full"
                >
                  {opening && selectedBox?.id === box.id ? "Öffne..." : "Kaufen & Öffnen"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BoxOpening;
