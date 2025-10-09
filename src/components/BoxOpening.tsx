import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface BoxOpeningProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const boxes = [
  { id: 1, name: "Bronze Box", price: 100, minWin: 10, maxWin: 300, color: "bg-amber-700" },
  { id: 2, name: "Silver Box", price: 500, minWin: 100, maxWin: 1500, color: "bg-gray-400" },
  { id: 3, name: "Gold Box", price: 1000, minWin: 300, maxWin: 3000, color: "bg-yellow-500" },
  { id: 4, name: "Diamond Box", price: 2500, minWin: 1000, maxWin: 10000, color: "bg-blue-400" },
];

const BoxOpening = ({ balance, onBalanceChange }: BoxOpeningProps) => {
  const [opening, setOpening] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const openBox = async (box: typeof boxes[0]) => {
    if (balance < box.price) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    setOpening(true);
    onBalanceChange(balance - box.price);

    // Simulate opening animation
    setTimeout(() => {
      const win = Math.floor(Math.random() * (box.maxWin - box.minWin + 1)) + box.minWin;
      const profit = win - box.price;
      
      setLastWin(win);
      onBalanceChange(balance - box.price + win);
      
      if (profit > 0) {
        toast.success(`🎉 Gewonnen: ${win} Chips! (+${profit})`);
      } else {
        toast.error(`Verlust: ${Math.abs(profit)} Chips`);
      }
      
      setOpening(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Wählen Sie eine Box</h3>
        <p className="text-muted-foreground">Kaufen und öffnen Sie Boxen für die Chance auf große Gewinne!</p>
      </div>

      {lastWin !== null && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">Letzter Gewinn: {lastWin} Chips</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {boxes.map((box) => (
          <Card key={box.id} className="group hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`${box.color} w-24 h-24 mx-auto rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Package className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h4 className="font-bold text-lg">{box.name}</h4>
                <Badge variant="secondary" className="mt-2">{box.price} Chips</Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Gewinn: {box.minWin} - {box.maxWin}</p>
              </div>

              <Button
                onClick={() => openBox(box)}
                disabled={opening || balance < box.price}
                className="w-full"
              >
                {opening ? "Öffne..." : "Kaufen & Öffnen"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxOpening;
