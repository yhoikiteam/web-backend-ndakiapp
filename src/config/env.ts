import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),

  SUPABASE_ANON_KEY: z.string(),

  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),

  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);