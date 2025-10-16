import { Coins, Trophy, User, ShoppingBag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/lib/formatNumber";

interface CasinoHeaderProps {
  balance: number;
}

const CasinoHeader = ({ balance }: CasinoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Coins className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gradient-gold">VirtualCasino</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Spielen Sie sicher mit Spielgeld</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="bg-muted px-4 md:px-6 py-2 rounded-full border border-primary/30 glow-effect">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="font-bold text-base md:text-lg text-primary">{formatNumber(balance)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:scale-110 transition-transform h-9 w-9 md:h-10 md:w-10"
                onClick={() => navigate('/shop')}
                title="Shop"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              </Button>

              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:scale-110 transition-transform h-9 w-9 md:h-10 md:w-10"
                onClick={() => navigate('/')}
                title="Lobby"
              >
                <Trophy className="w-4 h-4 md:w-5 md:h-5" />
              </Button>

              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:scale-110 transition-transform h-9 w-9 md:h-10 md:w-10"
                onClick={() => navigate('/profile')}
                title="Profil"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile-friendly footer link */}
        <div className="mt-3 pt-3 border-t border-border/50 flex justify-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate('/impressum')}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <FileText className="w-3 h-3 mr-1" />
            Impressum
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CasinoHeader;
