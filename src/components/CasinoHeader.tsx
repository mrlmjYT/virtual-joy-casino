import { Coins, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CasinoHeaderProps {
  balance: number;
}

const CasinoHeader = ({ balance }: CasinoHeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-gold">VirtualCasino</h1>
              <p className="text-xs text-muted-foreground">Spielen Sie sicher mit Spielgeld</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-muted px-6 py-2 rounded-full border border-primary/30 glow-effect">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg text-primary">{balance.toLocaleString()}</span>
              </div>
            </div>

            <Button variant="outline" size="icon" className="rounded-full">
              <Trophy className="w-5 h-5" />
            </Button>

            <Button variant="outline" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CasinoHeader;
