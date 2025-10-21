import express from "express";
import { GoogleAuth } from "google-auth-library";

const app = express();
const port = process.env.PORT || 3000;

app.get("/token", async (req, res) => {
  try {
    // Đường dẫn bí mật nơi bạn upload file key trong Render
    const keyFile = "/etc/secrets/service_account.json";
    const auth = new GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/generative-language.retriever"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    res.json({ access_token: token.token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
