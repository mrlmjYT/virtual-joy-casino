import GameCard from "./GameCard";
import slotMachineImg from "@/assets/slot-machine.jpg";
import rouletteImg from "@/assets/roulette.jpg";
import blackjackImg from "@/assets/blackjack.jpg";
import videoPokerImg from "@/assets/video-poker.jpg";
import bingoImg from "@/assets/bingo.jpg";
import crashImg from "@/assets/crash.jpg";
import diceImg from "@/assets/dice.jpg";
import plinkoImg from "@/assets/plinko.jpg";

interface GamesGridProps {
  onGameSelect: (game: string) => void;
  userLevel: number;
}

const GamesGrid = ({ onGameSelect, userLevel }: GamesGridProps) => {
  const games = [
    {
      title: "Slot Machine",
      category: "Slots",
      image: slotMachineImg,
      requiredLevel: 1,
      id: "slots"
    },
    {
      title: "Dice",
      category: "Würfelspiele",
      image: diceImg,
      requiredLevel: 1,
      id: "dice"
    },
    {
      title: "Roulette",
      category: "Tischspiele",
      image: rouletteImg,
      requiredLevel: 2,
      id: "roulette"
    },
    {
      title: "Crash",
      category: "Multiplier",
      image: crashImg,
      requiredLevel: 2,
      id: "crash"
    },
    {
      title: "Blackjack",
      category: "Kartenspiele",
      image: blackjackImg,
      requiredLevel: 3,
      id: "blackjack"
    },
    {
      title: "Plinko",
      category: "Arcade",
      image: plinkoImg,
      requiredLevel: 3,
      id: "plinko"
    },
    {
      title: "Video Poker",
      category: "Kartenspiele",
      image: videoPokerImg,
      requiredLevel: 4,
      id: "poker"
    },
    {
      title: "Bingo",
      category: "Klassiker",
      image: bingoImg,
      requiredLevel: 4,
      id: "bingo"
    },
    {
      title: "Keno",
      category: "Lotterie",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
      requiredLevel: 5,
      id: "keno"
    },
    {
      title: "Glücksrad",
      category: "Wheel Games",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
      requiredLevel: 6,
      id: "wheel"
    },
    {
      title: "Sic Bo",
      category: "Würfelspiele",
      image: "https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=400&h=300&fit=crop",
      requiredLevel: 7,
      id: "sicbo"
    },
    {
      title: "Mines",
      category: "Strategy",
      image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=300&fit=crop",
      requiredLevel: 8,
      id: "mines"
    },
    {
      title: "Box Opening",
      category: "Spezial",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
      requiredLevel: 5,
      id: "boxes"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient-gold">Unsere Spiele</h2>
          <p className="text-muted-foreground text-lg">
            Entdecken Sie eine große Auswahl an spannenden Casino-Spielen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const isLocked = userLevel < game.requiredLevel;
            return (
              <GameCard
                key={game.id}
                title={game.title}
                category={`${game.category} ${isLocked ? `• Level ${game.requiredLevel}` : ""}`}
                image={game.image}
                isLocked={isLocked}
                onPlay={() => !isLocked && onGameSelect(game.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GamesGrid;
