import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { VITE_VERCEL_SUPABASE_PUBLIC_KEY, VITE_VERCEL_SUPABASE_PROJECT_URL } from "./env";

if (!VITE_VERCEL_SUPABASE_PROJECT_URL || !VITE_VERCEL_SUPABASE_PUBLIC_KEY) {
	throw new Error("Supabase URL or Public Key is missing");
}

export const supabase: SupabaseClient = createClient(
	VITE_VERCEL_SUPABASE_PROJECT_URL,
	VITE_VERCEL_SUPABASE_PUBLIC_KEY
);
