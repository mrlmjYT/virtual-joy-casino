import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpinRequest {
  betAmount: number;
  symbols: string[];
  specialCount: number;
  winAmount: number;
  gameData?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { betAmount, symbols, specialCount, winAmount, gameData }: SpinRequest = await req.json();

    console.log('Spin request:', { userId: user.id, betAmount, specialCount, winAmount });

    // Validate input
    if (!betAmount || betAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid bet amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(symbols) || symbols.length !== 6) {
      return new Response(
        JSON.stringify({ error: 'Invalid symbols data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch current balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate bet against balance
    if (profile.balance < betAmount) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new balance
    const newBalance = profile.balance - betAmount + winAmount;

    console.log('Balance update:', { before: profile.balance, after: newBalance, bet: betAmount, win: winAmount });

    // Update balance atomically
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (updateError) {
      console.error('Balance update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log game history for audit
    const { error: historyError } = await supabase
      .from('game_history')
      .insert({
        user_id: user.id,
        game_type: 'diamond_slots',
        bet_amount: betAmount,
        win_amount: winAmount,
        game_data: { symbols, specialCount, ...gameData },
        balance_before: profile.balance,
        balance_after: newBalance,
      });

    if (historyError) {
      console.error('History log error:', historyError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        balance: newBalance,
        winAmount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
