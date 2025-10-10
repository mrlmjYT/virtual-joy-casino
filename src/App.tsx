import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Boxes from "./pages/Boxes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("casinoBalance");
    return saved ? parseInt(saved) : 10000;
  });
  const [isBalanceLoaded, setIsBalanceLoaded] = useState(false);

  // Load balance from database when user logs in
  useEffect(() => {
    if (user) {
      loadBalanceFromDB();
    } else {
      setIsBalanceLoaded(true);
    }
  }, [user]);

  const loadBalanceFromDB = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setBalance(data.balance);
      localStorage.setItem("casinoBalance", data.balance.toString());
    }
    setIsBalanceLoaded(true);
  };

  const handleBalanceChange = async (newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem("casinoBalance", newBalance.toString());

    // Save to database if user is logged in
    if (user) {
      await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user.id);
    }
  };

  if (!isBalanceLoaded) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index balance={balance} onBalanceChange={handleBalanceChange} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/boxes" element={<Boxes balance={balance} onBalanceChange={handleBalanceChange} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
