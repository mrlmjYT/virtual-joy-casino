import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-card to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-slow" />
            <span className="text-sm font-medium text-primary">100% Kostenlos & Risikofrei</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-gold">
            Willkommen im<br />VirtualCasino
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Erleben Sie die Spannung echter Casino-Spiele ohne finanzielles Risiko. 
            Täglich kostenlose Chips, faire Spiele und jede Menge Spaß!
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-effect">
              <Gift className="w-5 h-5 mr-2" />
              Jetzt kostenlos spielen
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Spiele entdecken
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Täglich Bonus</h3>
              <p className="text-muted-foreground text-sm">
                Holen Sie sich jeden Tag kostenlose Chips zum Spielen
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fair & Sicher</h3>
              <p className="text-muted-foreground text-sm">
                Zertifizierte RNG-Technologie für faire Spielergebnisse
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Viele Spiele</h3>
              <p className="text-muted-foreground text-sm">
                Slots, Roulette, Blackjack und vieles mehr entdecken
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
