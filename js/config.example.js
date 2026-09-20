window.EARTHFORWARD_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key",
  // SECURITY NOTICE: Do NOT include Supabase secret or service-role keys here.
  // Service role keys bypass Row Level Security and must NEVER be exposed in client code.
  CARTO_API_KEY: "your-carto-api-key"
};

// Global backward-compatibility alias
if (typeof window !== 'undefined') {
  window.EARTH_FORWARD_CONFIG = window.EARTHFORWARD_CONFIG;
}

