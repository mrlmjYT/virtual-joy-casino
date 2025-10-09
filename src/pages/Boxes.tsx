import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BoxOpening from "@/components/BoxOpening";
import BoxBattle from "@/components/BoxBattle";
import TradingCards from "@/components/TradingCards";
import CasinoHeader from "@/components/CasinoHeader";

interface BoxesProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Boxes = ({ balance, onBalanceChange }: BoxesProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      <CasinoHeader balance={balance} />
      
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Lobby
        </Button>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-3xl text-gradient-gold">Box Opening & Battles</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="opening" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="opening">Box Öffnen</TabsTrigger>
                <TabsTrigger value="battle">Box Battle</TabsTrigger>
                <TabsTrigger value="cards">Trading Cards</TabsTrigger>
              </TabsList>

              <TabsContent value="opening">
                <BoxOpening balance={balance} onBalanceChange={onBalanceChange} />
              </TabsContent>

              <TabsContent value="battle">
                <BoxBattle balance={balance} onBalanceChange={onBalanceChange} />
              </TabsContent>

              <TabsContent value="cards">
                <TradingCards balance={balance} onBalanceChange={onBalanceChange} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Boxes;
