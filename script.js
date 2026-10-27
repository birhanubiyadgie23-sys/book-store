import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { tx_ref, order_id } = await req.json()
    const CHAPA_SECRET_KEY = 'CHAPA_TEST_PRIV_YpC-HdtSIl2sNkt5HDCDTdDzvCXqLsi8GELpofen';

    // 1. ከ Chapa ሰርቨር ጋር በመገናኘት ክፍያው መፈጸሙን ማረጋገጥ
    const chapaRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`
      }
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status === 'success') {
      // 2. ክፍያው ከተሳካ በ Supabase ውስጥ የትዕዛዙን ሁኔታ ወደ 'completed' መቀየር
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order_id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify({ success: true, message: 'ክፍያው ተረጋግጧል!' }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'ክፍያው አልተሳካም' }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
