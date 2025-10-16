import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Trophy, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';
import BetSelector from './BetSelector';
import { quizQuestions, QuizQuestion } from '@/data/quizQuestions';
import { formatNumber } from '@/lib/formatNumber';

interface QuizGambleProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const QuizGamble = ({ balance, onBalanceChange, onBack }: QuizGambleProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'won' | 'lost'>('betting');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentPrize, setCurrentPrize] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  const getRandomQuestion = (difficulty: number): QuizQuestion => {
    const availableQuestions = quizQuestions.filter(
      q => q.difficulty === difficulty && !usedQuestionIds.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
      // Reset if all questions used
      setUsedQuestionIds([]);
      return quizQuestions.filter(q => q.difficulty === difficulty)[0];
    }
    
    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestionIds([...usedQuestionIds, randomQ.id]);
    return randomQ;
  };

  const startGame = () => {
    if (balance < betAmount) {
      toast.error("Nicht genug Guthaben!");
      return;
    }

    onBalanceChange(balance - betAmount);
    setCurrentPrize(betAmount);
    setQuestionsAnswered(0);
    setUsedQuestionIds([]);
    setGameState('playing');
    
    // Start with difficulty 1
    const firstQuestion = getRandomQuestion(1);
    setCurrentQuestion(firstQuestion);
    toast.info("Spiel gestartet! Viel Erfolg!");
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion) return;

    if (answerIndex === currentQuestion.correctAnswer) {
      // Correct answer
      const newPrize = Math.floor(currentPrize * 1.5); // 50% increase per correct answer
      setCurrentPrize(newPrize);
      setQuestionsAnswered(questionsAnswered + 1);
      
      toast.success("Richtig! 🎉");

      // Calculate next difficulty (1-10)
      const nextDifficulty = Math.min(10, Math.floor(questionsAnswered / 10) + 1);
      
      if (questionsAnswered >= 99) {
        // Won all 100 questions!
        winGame();
      } else {
        // Next question
        setTimeout(() => {
          const nextQuestion = getRandomQuestion(nextDifficulty);
          setCurrentQuestion(nextQuestion);
        }, 1000);
      }
    } else {
      // Wrong answer - lose everything
      setGameState('lost');
      toast.error("Falsche Antwort! Spiel verloren.");
    }
  };

  const cashOut = () => {
    onBalanceChange(balance + currentPrize);
    setGameState('won');
    toast.success(`Ausgezahlt! +${formatNumber(currentPrize)} Chips`);
  };

  const winGame = () => {
    const jackpotPrize = currentPrize * 5; // 5x bonus for completing all questions
    onBalanceChange(balance + jackpotPrize);
    setGameState('won');
    toast.success(`🏆 JACKPOT! Alle 100 Fragen beantwortet! +${formatNumber(jackpotPrize)} Chips`);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-yellow-500';
    if (difficulty <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="outline" className="mb-6">
        ← Zurück zur Lobby
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-gold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Quiz Gamble
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Betting State */}
          {gameState === 'betting' && (
            <>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Beantworte Fragen und verdiene! 100 Fragen in 10 Schwierigkeitsstufen.
                </p>
                <p className="text-sm text-muted-foreground">
                  Du kannst jederzeit auszahlen oder weiter spielen. 
                  Bei falscher Antwort verlierst du alles!
                </p>
              </div>

              <BetSelector
                balance={balance}
                selectedBet={betAmount}
                onBetChange={setBetAmount}
              />

              <Button
                className="w-full h-14 text-lg"
                onClick={startGame}
                disabled={balance < betAmount}
              >
                Spiel starten
              </Button>
            </>
          )}

          {/* Playing State */}
          {gameState === 'playing' && currentQuestion && (
            <>
              {/* Stats */}
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-bold">Frage {questionsAnswered + 1}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-green-500">{formatNumber(currentPrize)}</span>
                </div>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  Level {currentQuestion.difficulty}
                </Badge>
              </div>

              {/* Question */}
              <Card className="bg-secondary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-center">
                    {currentQuestion.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.answers.map((answer, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto py-4 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleAnswer(index)}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {answer}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cash Out Button */}
              {questionsAnswered > 0 && (
                <Button
                  variant="default"
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                  onClick={cashOut}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Auszahlen: {formatNumber(currentPrize)} Chips
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setGameState('lost');
                  toast.info("Spiel abgebrochen");
                }}
              >
                <X className="w-5 h-5 mr-2" />
                Aufgeben
              </Button>
            </>
          )}

          {/* Won State */}
          {gameState === 'won' && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-500">Gewonnen!</h3>
              <p className="text-xl">
                +{formatNumber(currentPrize)} Chips
              </p>
              <p className="text-muted-foreground">
                {questionsAnswered} Fragen richtig beantwortet
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setGameState('betting');
                  setCurrentQuestion(null);
                  setCurrentPrize(0);
                  setQuestionsAnswered(0);
                }}
              >
                Nochmal spielen
              </Button>
            </div>
          )}

          {/* Lost State */}
          {gameState === 'lost' && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-red-500">Verloren!</h3>
              <p className="text-muted-foreground">
                {questionsAnswered} Fragen richtig beantwortet
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setGameState('betting');
                  setCurrentQuestion(null);
                  setCurrentPrize(0);
                  setQuestionsAnswered(0);
                }}
              >
                Nochmal versuchen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizGamble;