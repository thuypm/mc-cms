import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/exam",
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
