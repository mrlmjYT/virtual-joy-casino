import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface BetSelectorProps {
  balance: number;
  selectedBet: number;
  onBetChange: (amount: number) => void;
  minBet?: number;
}

const BetSelector = ({ balance, selectedBet, onBetChange, minBet = 10 }: BetSelectorProps) => {
  const betOptions = [10, 50, 100, 500];
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Coins className="w-4 h-4" />
        <span>Einsatz wählen:</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {betOptions.map((amount) => (
          <Button
            key={amount}
            variant={selectedBet === amount ? "default" : "outline"}
            size="sm"
            onClick={() => onBetChange(amount)}
            disabled={balance < amount}
            className={selectedBet === amount ? "glow-effect" : ""}
          >
            {amount}
          </Button>
        ))}
        <Button
          variant={selectedBet === balance ? "default" : "outline"}
          size="sm"
          onClick={() => onBetChange(balance)}
          disabled={balance < minBet}
          className={`col-span-1 ${selectedBet === balance ? "glow-effect bg-accent" : ""}`}
        >
          All-In
        </Button>
      </div>
    </div>
  );
};

export default BetSelector;
