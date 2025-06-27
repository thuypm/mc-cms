import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  microsoftId: String,
  password: String,
});

export default mongoose.model("User", userSchema);
