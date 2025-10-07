import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock } from "lucide-react";

interface GameCardProps {
  title: string;
  category: string;
  image: string;
  isLocked?: boolean;
  onPlay?: () => void;
}

const GameCard = ({ title, category, image, isLocked, onPlay }: GameCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 hover:glow-effect">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-3">{title}</h3>
        <Button 
          className="w-full" 
          disabled={isLocked}
          onClick={onPlay}
        >
          <Play className="w-4 h-4 mr-2" />
          {isLocked ? "Bald verfügbar" : "Spielen"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
