import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


const supabaseClient = async (supabaseAccesstoken) => {
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Barrer${supabaseAccesstoken}`,
            },
        },
    });
    return supabase;
};
export default supabaseClient;
