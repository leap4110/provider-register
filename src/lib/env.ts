function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue = ""): string {
  return process.env[key] || defaultValue;
}

export const env = {
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  NEXTAUTH_URL: getRequiredEnv("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getRequiredEnv("NEXTAUTH_SECRET"),

  GOOGLE_MAPS_API_KEY: getOptionalEnv("GOOGLE_MAPS_API_KEY"),
  RESEND_API_KEY: getOptionalEnv("RESEND_API_KEY"),
  TWILIO_ACCOUNT_SID: getOptionalEnv("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: getOptionalEnv("TWILIO_AUTH_TOKEN"),
  STRIPE_SECRET_KEY: getOptionalEnv("STRIPE_SECRET_KEY"),
  CRON_SECRET: getOptionalEnv("CRON_SECRET"),

  APP_URL: getOptionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  SHOW_TEST_BANNER: getOptionalEnv("NEXT_PUBLIC_SHOW_TEST_BANNER", "false"),
};
