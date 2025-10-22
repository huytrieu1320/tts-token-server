import express from "express";
import { GoogleAuth } from "google-auth-library";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


const ACCESS_KEY = process.env.ACCESS_KEY;

if (!ACCESS_KEY) {
  console.error("❌ ACCESS_KEY is missing. Please set it in Render Environment Variables.");
  process.exit(1);
}

app.post("/token", async (req, res) => {
  try {
    const { token } = req.body;

    // Kiểm tra token từ client có khớp không
    if (token !== ACCESS_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 🔐 Đường dẫn service account JSON file
    const serviceKeyFile = "/etc/secrets/service_account.json";
    const auth = new GoogleAuth({
      keyFile: serviceKeyFile,
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/generative-language.retriever",
      ],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    res.json({ access_token: tokenResponse.token });
  } catch (error) {
    console.error("❌ Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
