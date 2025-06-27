import axios from "axios";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
// Update the path below to the correct relative path for your project, e.g.:
import User from "../models/User"; // 👈 chỉnh đường dẫn tùy dự án của bạn
import {
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  MICROSOFT_OAUTH2_URL,
  MICROSOFT_REDIRECT_URI,
} from "../utils/environment";

const router = Router();

// Type cho user decode từ id_token
interface MicrosoftUser {
  name: string;
  email: string;
  oid: string;
}

router.post(
  "/microsoft/callback",
  async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;

    if (!code) {
      res.status(400).send({
        message: "Have error in code",
      });
      return;
    }

    try {
      // Lấy token từ Microsoft
      const tokenRes = await axios.post(
        MICROSOFT_OAUTH2_URL,
        new URLSearchParams({
          client_id: MICROSOFT_CLIENT_ID,
          scope: "openid profile email",
          code,
          redirect_uri: MICROSOFT_REDIRECT_URI,
          grant_type: "authorization_code",
          client_secret: MICROSOFT_CLIENT_SECRET,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { id_token } = tokenRes.data;
      // Decode id_token để lấy thông tin người dùng
      const payload = id_token.split(".")[1];
      const decodedStr = Buffer.from(payload, "base64").toString();
      const decoded: MicrosoftUser = JSON.parse(decodedStr);
      const { name, email, oid } = decoded;

      // Tìm hoặc tạo user trong DB
      let user = await User.findOne({ microsoftId: oid });
      if (!user) {
        user = await User.create({
          name,
          email,
          microsoftId: oid,
        });
      }

      // Tạo token nội bộ
      const yourToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "365d",
      });

      res.json({
        accessToken: yourToken,
      });
    } catch (err: any) {
      console.error(err?.response?.data || err);
      res.status(500).send("OAuth2 login failed");
    }
  }
);

export default router;
