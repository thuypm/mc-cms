import axios from "axios";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { Student } from "../models/student.repository";
import { Teacher } from "../models/teacher.repository";

import { USER_POSITION } from "../utils/enum";
import {
  JWT_SECRET,
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  MICROSOFT_OAUTH2_URL,
  MICROSOFT_REDIRECT_URI,
} from "../utils/environment";

// Kiểu user từ Microsoft ID token
interface MicrosoftUser {
  name: string;
  email: string;
  oid: string;
}

export const handleMicrosoftLogin = async (code: string): Promise<string> => {
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

  // 2. Decode id_token
  const payload = id_token.split(".")[1];
  const decodedStr = Buffer.from(payload, "base64").toString();
  const decoded: MicrosoftUser = JSON.parse(decodedStr);

  const { email } = decoded;

  // 3. Tìm hoặc tạo user trong DB
  let user = await Teacher.findOne({ email });
  if (!user) user = await Student.findOne({ email });

  // 4. Tạo JWT nội bộ
  const yourToken = jwt.sign(
    { _id: user._id, position: user.position, class: user.class },
    JWT_SECRET!,
    {
      expiresIn: "365d",
    }
  );

  return yourToken;
};

export const getUserFromToken = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET!) as {
    _id: string;
    position: string;
  };
  let profile;

  if (
    decoded.position === USER_POSITION.TEACHER ||
    decoded.position === USER_POSITION.SUPER_ADMIN
  )
    profile = await Teacher.findOne({
      _id: new ObjectId(decoded._id),
    });
  else
    profile = await Student.findOne({
      _id: new ObjectId(decoded._id),
    }).select("name class avatar");

  if (!profile) throw { message: "Invalid token" };
  else return profile;
};
