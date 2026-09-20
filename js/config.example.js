window.EARTHFORWARD_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key",

  CARTO_API_KEY: "your-carto-api-key"
};

if (typeof window !== 'undefined') {
  window.EARTH_FORWARD_CONFIG = window.EARTHFORWARD_CONFIG;
}

