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
}

const GamesGrid = ({ onGameSelect }: GamesGridProps) => {
  const games = [
    {
      title: "Slot Machine",
      category: "Slots",
      image: slotMachineImg,
      isLocked: false,
      id: "slots"
    },
    {
      title: "Roulette",
      category: "Tischspiele",
      image: rouletteImg,
      isLocked: false,
      id: "roulette"
    },
    {
      title: "Blackjack",
      category: "Kartenspiele",
      image: blackjackImg,
      isLocked: false,
      id: "blackjack"
    },
    {
      title: "Video Poker",
      category: "Kartenspiele",
      image: videoPokerImg,
      isLocked: false,
      id: "poker"
    },
    {
      title: "Bingo",
      category: "Sonstiges",
      image: bingoImg,
      isLocked: false,
      id: "bingo"
    },
    {
      title: "Crash",
      category: "Sonstiges",
      image: crashImg,
      isLocked: false,
      id: "crash"
    },
    {
      title: "Dice",
      category: "Sonstiges",
      image: diceImg,
      isLocked: false,
      id: "dice"
    },
    {
      title: "Plinko",
      category: "Sonstiges",
      image: plinkoImg,
      isLocked: false,
      id: "plinko"
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
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              category={game.category}
              image={game.image}
              isLocked={game.isLocked}
              onPlay={() => !game.isLocked && onGameSelect(game.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesGrid;
