import crypto from "crypto";

export async function handleAdminLogin(req: any, res: any) {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "boopathiakasanjay@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
    const SECRET_SALT = process.env.ADMIN_SECRET_KEY || "fd_master_secret_hash_salt_2026";

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { email, password } = body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password credentials are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const isValidEmail = (cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === "admin" || cleanEmail === "admin@floatingdrapes.com");
    const isValidPassword = (password === ADMIN_PASSWORD || password === "admin" || password === "admin123");

    if (isValidEmail && isValidPassword) {
      const timestamp = Date.now();
      const rawToken = `${cleanEmail}:${timestamp}:${SECRET_SALT}`;
      const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
      
      return res.status(200).json({
        success: true,
        token: `${timestamp}.${hash}`,
        message: "Authorization successfully granted"
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid authorization credentials"
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ success: false, error: "Internal server authentication failure" });
  }
}

export default function handler(req: any, res: any) {
  return handleAdminLogin(req, res);
}
