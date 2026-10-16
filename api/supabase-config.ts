import fs from "fs";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "supabase.config.json");

export function getStoredSupabaseConfig() {
  let url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  let key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.url && parsed.key) {
          url = parsed.url;
          key = parsed.key;
          process.env.VITE_SUPABASE_URL = url;
          process.env.VITE_SUPABASE_ANON_KEY = key;
        }
      } catch (err) {
        console.error("Failed to read supabase.config.json:", err);
      }
    }
  }

  return {
    url: url.trim(),
    key: key.trim(),
    isConfigured: Boolean(url && key && url.startsWith("http"))
  };
}

export function handleGetSupabaseConfig(req: any, res: any) {
  try {
    const config = getStoredSupabaseConfig();
    return res.status(200).json(config);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to get config" });
  }
}

export function handleSaveSupabaseConfig(req: any, res: any) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { url, key } = body;

    if (!url || !key) {
      return res.status(400).json({ error: "Supabase URL and Anon Key are required" });
    }

    const trimmedUrl = String(url).trim();
    const trimmedKey = String(key).trim();

    // Persist to server config file
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ url: trimmedUrl, key: trimmedKey, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );

    // Update in-memory process.env
    process.env.VITE_SUPABASE_URL = trimmedUrl;
    process.env.VITE_SUPABASE_ANON_KEY = trimmedKey;
    process.env.SUPABASE_URL = trimmedUrl;
    process.env.SUPABASE_ANON_KEY = trimmedKey;

    return res.status(200).json({
      success: true,
      message: "Supabase credentials saved universally on server",
      config: {
        url: trimmedUrl,
        key: trimmedKey,
        isConfigured: true
      }
    });
  } catch (err: any) {
    console.error("Failed to save supabase config:", err);
    return res.status(500).json({ error: err.message || "Failed to persist configuration" });
  }
}
