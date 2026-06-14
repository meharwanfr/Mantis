// Bun natively loads .env files automatically, so no need for dotenv package


export const ENV = {
  MOSS_PROJECT_ID: process.env.MOSS_PROJECT_ID || '',
  MOSS_PROJECT_KEY: process.env.MOSS_PROJECT_KEY || '',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  PORT: Number(process.env.PORT) || 8000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
};

if (!ENV.MOSS_PROJECT_ID || !ENV.MOSS_PROJECT_KEY) {
  console.warn('⚠️ Moss AI credentials not set in .env');
}
if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase credentials not set in .env');
}
if (!ENV.GEMINI_API_KEY) {
  console.warn('⚠️ Gemini API key not set in .env');
}
