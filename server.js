import express from "express";
import fs from "fs";
import { GoogleAuth } from "google-auth-library";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 🔒 Đường dẫn tới file chứa token bí mật (Render Secret mount vào đây)
const keyFilePath = "/etc/secrets/key.txt";

// Hàm đọc token bí mật từ file
function getAccessKey() {
  try {
    return fs.readFileSync(keyFilePath, "utf8").trim();
  } catch (err) {
    console.error("❌ Không thể đọc file key.txt:", err);
    return null;
  }
}

app.post("/token", async (req, res) => {
  try {
    const clientToken = req.body.token;
    const ACCESS_KEY = getAccessKey();

    if (!ACCESS_KEY) {
      return res.status(500).json({ error: ACCESS_KEY });
    }

    // So sánh token client gửi với token trong file
    if (clientToken !== ACCESS_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 🔐 Đường dẫn tới service account key file
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
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
