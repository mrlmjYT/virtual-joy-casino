import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, Swords } from "lucide-react";
import { toast } from "sonner";

interface BoxBattleProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const battleModes = [
  { id: "1v1", name: "1v1", players: 2, cost: 500 },
  { id: "1v1v1v1", name: "1v1v1v1", players: 4, cost: 400 },
  { id: "2v2", name: "2v2 Team", players: 4, cost: 600 },
  { id: "3v3", name: "3v3 Team", players: 6, cost: 800 },
  { id: "2v2v2", name: "2v2v2", players: 6, cost: 700 },
];

const BoxBattle = ({ balance, onBalanceChange }: BoxBattleProps) => {
  const [battling, setBattling] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const startBattle = async (mode: typeof battleModes[0], vsBot: boolean) => {
    if (balance < mode.cost) {
      toast.error("Nicht genug Guthaben für diesen Battle-Modus!");
      return;
    }

    setBattling(true);
    setSelectedMode(mode.id);
    onBalanceChange(balance - mode.cost);

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
      
      const totalPot = mode.cost * mode.players;
      let winnings = 0;
      
      if (playerRank === 1) {
        winnings = Math.floor(totalPot * 0.6);
      } else if (playerRank === 2) {
        winnings = Math.floor(totalPot * 0.3);
      } else if (playerRank === 3) {
        winnings = Math.floor(totalPot * 0.1);
      }
      
      if (winnings > 0) {
        onBalanceChange(balance - mode.cost + winnings);
        toast.success(`🏆 Platz ${playerRank}! Gewinn: ${winnings} Chips`);
      } else {
        toast.error(`Platz ${playerRank} - Kein Gewinn`);
      }
      
      setBattling(false);
      setSelectedMode(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Box Battle Modi</h3>
        <p className="text-muted-foreground">Treten Sie gegen Bots oder echte Spieler an!</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {battleModes.map((mode) => (
          <Card key={mode.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <Swords className="w-12 h-12 mx-auto mb-2 text-primary" />
                <h4 className="font-bold text-xl">{mode.name}</h4>
                <Badge variant="secondary" className="mt-2">{mode.cost} Chips</Badge>
                <p className="text-sm text-muted-foreground mt-2">{mode.players} Spieler</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => startBattle(mode, true)}
                  disabled={battling || balance < mode.cost}
                  className="w-full"
                  variant="default"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  vs. Bots
                </Button>
                
                <Button
                  onClick={() => startBattle(mode, false)}
                  disabled={battling || balance < mode.cost}
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
        ))}
      </div>
    </div>
  );
};

export default BoxBattle;
