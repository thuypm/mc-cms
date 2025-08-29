import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    console.log(
      "🔗 Connecting to MongoDB...",
      process.env.MONGO_URI || "mongodb://localhost:27017/mccms"
    );
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/mccms",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // dừng server nếu lỗi
  }
};

export default connectDB;
