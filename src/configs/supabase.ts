import { config } from "dotenv";
import { createClient } from '@supabase/supabase-js'

config();

const sbApiKey = process.env.SUPABASE_ANON_KEY;
const sbUrl = process.env.SUPABASE_URL;
const supabaseClient = createClient(sbUrl, sbApiKey);

export default  supabaseClient ;
