import mongoose, { Document, Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";

export interface IDayBoarding extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  registedBy: Types.ObjectId;
  status: number;
  date: Date;
  branch?: string;
}

const DayBoardingSchema: Schema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    registedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 1, // bạn có thể chỉnh default tùy ý
    },
    date: {
      type: Date,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const DayBoarding = mongoose.model<IDayBoarding>(
  "DayBoarding",
  DayBoardingSchema
);

class DayBoardingRepository extends BaseRepository<IDayBoarding> {
  constructor() {
    super(DayBoarding);
  }

  async findActiveByUser(userId: string) {
    return this.model.findOne({ user: userId, isActive: true });
  }
}

export const dayBoardingRepository = new DayBoardingRepository();
