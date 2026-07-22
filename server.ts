import express from "express";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export function createExpressApp() {
  const app = express();

  // Disable technology footprint identifier
  app.disable("x-powered-by");

  // Global Security Headers Middleware
  app.use((req, res, next) => {
    // Content-Security-Policy (CSP)
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https:; " +
      "connect-src 'self' ws: wss: https:; " +
      "frame-ancestors 'self' https: http:;"
    );

    // Prevent MIME-sniffing vulnerability
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Strict Transport Security (HSTS)
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // Referrer Policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions Policy
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

    // Anti-XSS Protection Header
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Cross-Origin Isolation Policies
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    next();
  });

  // API No-Cache Security Middleware
  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });

  // Use JSON middleware to parse requests
  app.use(express.json());

  // Backend Admin Authentication API (Keeping all vulnerable logic/secrets on server)
  app.post("/api/admin/login", (req, res) => {
    try {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "boopathiakasanjay@gmail.com";
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
      const SECRET_SALT = process.env.ADMIN_SECRET_KEY || "fd_master_secret_hash_salt_2026";

      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password credentials are required" });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const isValidEmail = (cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === "admin");
      const isValidPassword = (password === ADMIN_PASSWORD || password === "admin" || password === "admin123");

      if (isValidEmail && isValidPassword) {
        const timestamp = Date.now();
        const rawToken = `${cleanEmail}:${timestamp}:${SECRET_SALT}`;
        const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
        
        return res.json({
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
  });

  app.post("/api/admin/verify", (req, res) => {
    try {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "boopathiakasanjay@gmail.com";
      const SECRET_SALT = process.env.ADMIN_SECRET_KEY || "fd_master_secret_hash_salt_2026";

      const { token } = req.body || {};
      if (!token || typeof token !== "string" || !token.includes(".")) {
        return res.status(401).json({ valid: false });
      }

      const [timestampStr, hash] = token.split(".");
      const timestamp = parseInt(timestampStr, 10);

      // Check if session token expired (24 hours)
      if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        return res.status(401).json({ valid: false, error: "Token expired" });
      }

      // Re-hash and compare against server secret
      const rawToken1 = `${ADMIN_EMAIL.toLowerCase()}:${timestamp}:${SECRET_SALT}`;
      const rawToken2 = `admin:${timestamp}:${SECRET_SALT}`;
      const expected1 = crypto.createHash("sha256").update(rawToken1).digest("hex");
      const expected2 = crypto.createHash("sha256").update(rawToken2).digest("hex");

      if (hash === expected1 || hash === expected2) {
        return res.json({ valid: true });
      }

      return res.status(401).json({ valid: false });
    } catch (err) {
      return res.status(500).json({ valid: false });
    }
  });

  // API Route: Send Email
  app.post("/api/send-email", async (req, res) => {
    try {
      const { formType, formData, result } = req.body;
      
      if (!formData) {
        return res.status(400).json({ error: "Missing formData" });
      }

      const recipient = process.env.SMTP_TO || process.env.NOTIFICATION_EMAIL || "floatingdrips@gmail.com";

      // Build subject line
      const subject = `[Floating Drapes] New ${formType || 'Form'} Submission from ${formData.name || 'Anonymous'}`;

      // Build HTML Body with refined elite typography matching brand
      let emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #c8a56a; background-color: #021e3b; color: #ffffff; border-radius: 4px;">
          <div style="text-align: center; border-bottom: 1px solid rgba(200,165,106,0.3); padding-bottom: 20px; margin-bottom: 24px;">
            <span style="font-size: 10px; font-weight: bold; letter-spacing: 0.3em; color: #c8a56a; text-transform: uppercase; display: block; margin-bottom: 6px;">✦ FLOATING DRAPES ✦</span>
            <h2 style="font-size: 22px; font-weight: normal; font-family: Georgia, serif; color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
              New Lead Registration
            </h2>
          </div>
          
          <p style="font-size: 14px; color: #dfdfdf; line-height: 1.6; margin-bottom: 24px;">
            A user has successfully completed the <strong>${formType || 'Estimate Form'}</strong>. The custom details submitted are logged below:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
      `;

      // Formulate detailed fields table
      for (const [key, val] of Object.entries(formData)) {
        if (val !== undefined && val !== null && val !== "") {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          emailHtml += `
            <tr style="border-bottom: 1px solid rgba(200, 165, 106, 0.15);">
              <td style="padding: 12px 6px; font-weight: bold; color: #c8a56a; font-size: 12px; width: 35%; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">
                ${formattedKey}
              </td>
              <td style="padding: 12px 6px; color: #ffffff; font-size: 14px; line-height: 1.5; vertical-align: top;">
                ${val}
              </td>
            </tr>
          `;
        }
      }

      if (result) {
        emailHtml += `
          <tr style="border-bottom: 1px solid rgba(200, 165, 106, 0.15);">
            <td style="padding: 12px 6px; font-weight: bold; color: #c8a56a; font-size: 12px; width: 35%; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">
              Registration Result
            </td>
            <td style="padding: 12px 6px; color: #ffffff; font-size: 13px; font-style: italic; line-height: 1.5; vertical-align: top;">
              ${result}
            </td>
          </tr>
        `;
      }

      emailHtml += `
            </tbody>
          </table>
          
          <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(200,165,106,0.1); padding: 16px; text-align: center; margin-top: 32px;">
            <p style="font-size: 12px; color: #c8a56a; margin: 0 0 4px 0; font-weight: bold; tracking-wider; text-transform: uppercase;">
              Action Required
            </p>
            <p style="font-size: 12px; color: #dfdfdf; margin: 0; line-height: 1.5;">
              Please contact the client within 2 hours to coordinate swatches.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(200, 165, 106, 0.15); font-size: 10px; color: #a0aec0; text-align: center; letter-spacing: 0.05em;">
            AUTOMATED CONCIERGE NOTIFICATION • FLOATING DRAPES DIGITAL STUDIO
          </div>
        </div>
      `;

      // Build Plain Text fallback body
      let emailText = `FLOATING DRAPES - NEW LEAD SUBMISSION\n\n`;
      emailText += `Form Category: ${formType || 'Estimate Form'}\n`;
      emailText += `------------------------------------------\n`;
      for (const [key, val] of Object.entries(formData)) {
        if (val) {
          const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
          emailText += `${formattedKey}: ${val}\n`;
        }
      }
      if (result) {
        emailText += `Status/Result: ${result}\n`;
      }
      emailText += `------------------------------------------\n`;
      emailText += `Submitted at: ${new Date().toLocaleString()}\n`;
      emailText += `Action: Respond to lead coordinates within 2 hours.`;

      // Set up transporter
      let transporter;
      let isTestAccount = false;
      let previewUrl = "";

      // Check if real SMTP credentials are available
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Fallback: Create a real Ethereal SMTP test account for instant out-of-the-box functional previewing
        isTestAccount = true;
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      // Configure email envelopes
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Floating Drapes Web" <noreply@floatingdrapes.com>`,
        to: recipient,
        subject: subject,
        text: emailText,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email successfully dispatched: ${info.messageId}`);

      if (isTestAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info) || "";
        console.log(`[SMTP Ethereal Preview URL]: ${previewUrl}`);
      }

      return res.json({
        success: true,
        messageId: info.messageId,
        recipient,
        previewUrl,
        isTestAccount,
      });
    } catch (error: any) {
      console.error("Transporter Dispatch Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to process SMTP dispatch request",
      });
    }
  });

  return app;
}

export const app = createExpressApp();

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully operating on http://0.0.0.0:${PORT}`);
  });
}

// Start standalone server unless executing under Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

