import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Sparkles, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "@/lib/formatNumber";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  item_type: string;
  preview_data: any;
}

interface UserItem {
  item_id: string;
  is_equipped: boolean;
}

interface ShopProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const Shop = ({ balance, onBalanceChange }: ShopProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always load shop data. If not logged in, show items read-only
    loadShopData();
  }, [user]);

  const loadShopData = async () => {
    try {
      // Load user profile to get coins (if logged in)
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("coins")
          .eq("id", user.id)
          .single();

        if (profile) {
          setCoins(profile.coins);
        }

        // Load user's purchased items
        const { data: purchased } = await supabase
          .from("user_items")
          .select("item_id, is_equipped")
          .eq("user_id", user.id);

        if (purchased) {
          setUserItems(purchased);
        }
      } else {
        setCoins(0);
        setUserItems([]);
      }

      // Load all shop items (public)
      const { data: items } = await supabase
        .from("shop_items")
        .select("*")
        .order("price");

      if (items) {
        setShopItems(items);
      }
    } catch (error) {
      console.error("Error loading shop:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPurchased = (itemId: string) => {
    return userItems.some(ui => ui.item_id === itemId);
  };

  const isEquipped = (itemId: string) => {
    return userItems.some(ui => ui.item_id === itemId && ui.is_equipped);
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!user) {
      toast.error("Bitte melden Sie sich an, um Items zu kaufen.");
      navigate("/auth");
      return;
    }

    if (coins < item.price) {
      toast.error("Nicht genug Coins!");
      return;
    }

    if (isPurchased(item.id)) {
      toast.info("Du besitzt dieses Item bereits!");
      return;
    }

    try {
      // Deduct coins
      const newCoins = coins - item.price;
      await supabase
        .from("profiles")
        .update({ coins: newCoins })
        .eq("id", user.id);

      // Add item to user's inventory
      await supabase
        .from("user_items")
        .insert({
          user_id: user.id,
          item_id: item.id,
          is_equipped: false,
        });

      setCoins(newCoins);
      await loadShopData();
      toast.success(`${item.name} gekauft! 🎉`);
    } catch (error) {
      toast.error("Fehler beim Kauf");
      console.error(error);
    }
  };

  const handleEquip = async (itemId: string) => {
    if (!user) {
      toast.error("Bitte melden Sie sich an, um Items auszurüsten.");
      navigate("/auth");
      return;
    }

    try {
      // Unequip all items of same type first
      const item = shopItems.find(i => i.id === itemId);
      if (!item) return;

      await supabase
        .from("user_items")
        .update({ is_equipped: false })
        .eq("user_id", user.id)
        .in("item_id", shopItems.filter(i => i.item_type === item.item_type).map(i => i.id));

      // Equip selected item
      await supabase
        .from("user_items")
        .update({ is_equipped: true })
        .eq("user_id", user.id)
        .eq("item_id", itemId);

      await loadShopData();
      toast.success("Item ausgerüstet!");
    } catch (error) {
      toast.error("Fehler beim Ausrüsten");
      console.error(error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      theme: "Theme",
      avatar_frame: "Rahmen",
      badge: "Abzeichen",
      effect: "Effekt",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      theme: "bg-purple-500",
      avatar_frame: "bg-blue-500",
      badge: "bg-yellow-500",
      effect: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Lade Shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl text-gradient-gold flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Coin Shop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{formatNumber(coins)} Coins</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verdiene Coins durch Spielen und kaufe exklusive Designs!
                  </p>
                </div>
                <Button onClick={() => navigate("/")}>
                  Zurück zur Lobby
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shop Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopItems.map((item) => {
              const purchased = isPurchased(item.id);
              const equipped = isEquipped(item.id);

              return (
                <Card
                  key={item.id}
                  className={`transition-all hover:shadow-lg ${
                    equipped ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getTypeColor(item.item_type)}>
                        {getTypeLabel(item.item_type)}
                      </Badge>
                      {equipped && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Ausgerüstet
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Preview */}
                    <div className="aspect-video bg-gradient-to-br from-muted to-background rounded-lg flex items-center justify-center border-2 border-border">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-lg">
                          {formatNumber(item.price)}
                        </span>
                      </div>

                      {purchased ? (
                        <Button
                          variant={equipped ? "secondary" : "default"}
                          onClick={() => handleEquip(item.id)}
                          disabled={equipped}
                          className="w-32"
                        >
                          {equipped ? "Ausgerüstet" : "Ausrüsten"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePurchase(item)}
                          disabled={coins < item.price}
                          className="w-32"
                        >
                          {coins < item.price ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Kaufen
                            </>
                          ) : (
                            "Kaufen"
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">💡 Wie verdiene ich Coins?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Spiele Casino-Spiele und sammle Coins basierend auf deinen Gewinnen</li>
                <li>• Steige im Level auf und erhalte Bonus-Coins</li>
                <li>• Tägliche Login-Boni (Coming Soon)</li>
                <li>• Besondere Achievements (Coming Soon)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Shop;