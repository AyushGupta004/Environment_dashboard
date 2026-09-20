window.EARTHFORWARD_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key",
  // SECURITY NOTICE: Do NOT include SUPABASE_SERVICE_KEY here.
  // Service role keys bypass Row Level Security and must only be used in secure backend environments.
  CARTO_API_KEY: "your-carto-api-key"
};

// Global backward-compatibility alias
if (typeof window !== 'undefined') {
  window.EARTH_FORWARD_CONFIG = window.EARTHFORWARD_CONFIG;
}

