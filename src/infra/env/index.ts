import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  ACCESS_KEY_ID: z.string(),
  SECRET_ACCESS_KEY: z.string(),
  BUCKET_NAME: z.string(),
  BUCKET_REGION: z.string(),
  STORAGE_URL: z.string(),
  STORAGE_IMAGE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_URL: z.string(),
  INCREDBULL_GALXE_API_BASE_URL: z.string(),
  CAPTCHA_API_BASE_URL: z.string(),
  SECRET_KEY_CAPTCHA: z.string(),
  ADMIN_FRONTEND_BASEURL: z.string(),
  PLAYER_FRONTEND_BASEURL: z.string(),
  DEFAULT_SEASON_DURATION_IN_DAYS: z.coerce.number(),
  DEFAULT_GALXE_TASK_SYSTEM: z.string(),
  DEFAULT_TASK_IMAGE: z.string(),
  DEFAULT_TIER_1_IMAGE: z.string(),
  DEFAULT_TIER_2_IMAGE: z.string(),
  DEFAULT_TIER_3_IMAGE: z.string(),
  DEFAULT_TIME_TO_SEND_ENDING_CAMPAIGN_NOTIFICATION: z.coerce.number(),
  CORS: z.string()
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
