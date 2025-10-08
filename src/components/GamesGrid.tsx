import GameCard from "./GameCard";

interface GamesGridProps {
  onGameSelect: (game: string) => void;
}

const GamesGrid = ({ onGameSelect }: GamesGridProps) => {
  const games = [
    {
      title: "Slot Machine",
      category: "Slots",
      image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop",
      isLocked: false,
      id: "slots"
    },
    {
      title: "Roulette",
      category: "Tischspiele",
      image: "https://images.unsplash.com/photo-1518491945-d3c96a3e7e37?w=400&h=300&fit=crop",
      isLocked: false,
      id: "roulette"
    },
    {
      title: "Blackjack",
      category: "Kartenspiele",
      image: "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&h=300&fit=crop",
      isLocked: false,
      id: "blackjack"
    },
    {
      title: "Video Poker",
      category: "Kartenspiele",
      image: "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=300&fit=crop",
      isLocked: false,
      id: "poker"
    },
    {
      title: "Bingo",
      category: "Sonstiges",
      image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=400&h=300&fit=crop",
      isLocked: false,
      id: "bingo"
    },
    {
      title: "Crash",
      category: "Sonstiges",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      isLocked: false,
      id: "crash"
    },
    {
      title: "Dice",
      category: "Sonstiges",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
      isLocked: false,
      id: "dice"
    },
    {
      title: "Plinko",
      category: "Sonstiges",
      image: "https://images.unsplash.com/photo-1541534401786-2077b5ab8c03?w=400&h=300&fit=crop",
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
