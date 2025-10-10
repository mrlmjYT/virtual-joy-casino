import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Swords, Package } from "lucide-react";
import { toast } from "sonner";

interface BoxBattleProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const battleModes = [
  { id: "1v1", name: "1v1", players: 2 },
  { id: "1v1v1v1", name: "1v1v1v1", players: 4 },
  { id: "2v2", name: "2v2 Team", players: 4 },
  { id: "3v3", name: "3v3 Team", players: 6 },
  { id: "2v2v2", name: "2v2v2", players: 6 },
];

const boxes = [
  { id: 1, name: "Bronze Box", price: 100, color: "bg-amber-700" },
  { id: 2, name: "Silver Box", price: 500, color: "bg-gray-400" },
  { id: 3, name: "Gold Box", price: 1000, color: "bg-yellow-500" },
  { id: 4, name: "Diamond Box", price: 2500, color: "bg-blue-400" },
];

const BoxBattle = ({ balance, onBalanceChange }: BoxBattleProps) => {
  const [battling, setBattling] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<typeof boxes[0] | null>(null);

  const startBattle = async (mode: typeof battleModes[0], box: typeof boxes[0], vsBot: boolean) => {
    const totalCost = box.price * mode.players;
    
    if (balance < totalCost) {
      toast.error("Nicht genug Guthaben für diesen Battle-Modus!");
      return;
    }

    setBattling(true);
    setSelectedMode(mode.id);
    setSelectedBox(box);
    onBalanceChange(balance - totalCost);

    // Simulate battle
    setTimeout(() => {
      const playerScore = Math.floor(Math.random() * 10000) + 1000;
      const opponentScores = Array.from({ length: mode.players - 1 }, () => 
        Math.floor(Math.random() * 10000) + 1000
      );
      
      const allScores = [{ name: "Sie", score: playerScore }, ...opponentScores.map((score, i) => ({
        name: vsBot ? `Bot ${i + 1}` : `Spieler ${i + 1}`,
        score
      }))];
      
      allScores.sort((a, b) => b.score - a.score);
      const playerRank = allScores.findIndex(s => s.name === "Sie") + 1;
      
      const totalPot = totalCost * mode.players;
      let winnings = 0;
      
      if (playerRank === 1) {
        winnings = Math.floor(totalPot * 0.6);
      } else if (playerRank === 2) {
        winnings = Math.floor(totalPot * 0.3);
      } else if (playerRank === 3) {
        winnings = Math.floor(totalPot * 0.1);
      }
      
      if (winnings > 0) {
        onBalanceChange(balance - totalCost + winnings);
        toast.success(`🏆 Platz ${playerRank}! Gewinn: ${winnings} Chips`);
      } else {
        toast.error(`Platz ${playerRank} - Kein Gewinn`);
      }
      
      setBattling(false);
      setSelectedMode(null);
      setSelectedBox(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Box Battle</h3>
        <p className="text-muted-foreground">Wähle eine Box und kämpfe gegen andere Spieler oder Bots!</p>
      </div>

      {!selectedBox && (
        <>
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold">Schritt 1: Wähle eine Box</h4>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {boxes.map((box) => (
              <Card 
                key={box.id} 
                className="group hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedBox(box)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`${box.color} w-20 h-20 mx-auto rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{box.name}</h4>
                    <Badge variant="secondary" className="mt-2">{box.price} Chips pro Spieler</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedBox && (
        <>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-lg">
              <div className={`${selectedBox.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold">{selectedBox.name}</p>
                <p className="text-sm text-muted-foreground">{selectedBox.price} Chips pro Spieler</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedBox(null)}>
              Andere Box wählen
            </Button>
          </div>

          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold">Schritt 2: Wähle einen Battle Modus</h4>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {battleModes.map((mode) => {
              const totalCost = selectedBox.price * mode.players;
              return (
                <Card key={mode.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <Swords className="w-12 h-12 mx-auto mb-2 text-primary" />
                      <h4 className="font-bold text-xl">{mode.name}</h4>
                      <Badge variant="secondary" className="mt-2">{totalCost} Chips</Badge>
                      <p className="text-xs text-muted-foreground">({selectedBox.price} × {mode.players} Spieler)</p>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => startBattle(mode, selectedBox, true)}
                        disabled={battling || balance < totalCost}
                        className="w-full"
                        variant="default"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        vs. Bots
                      </Button>
                      
                      <Button
                        onClick={() => startBattle(mode, selectedBox, false)}
                        disabled={battling || balance < totalCost}
                        className="w-full"
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        vs. Spieler
                      </Button>
                    </div>

                    {battling && selectedMode === mode.id && (
                      <div className="text-center text-sm text-primary animate-pulse">
                        Battle läuft...
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BoxBattle;
