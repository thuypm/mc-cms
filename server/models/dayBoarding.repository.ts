import mongoose, { Document, Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";

export interface IDayBoarding extends Document {
  _id: Types.ObjectId;
  student: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "Student";
  };
  service: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  canceledAt?: Date;
}

const DayBoardingSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    canceledAt: {
      type: Date,
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

  async cancelById(id: string) {
    return this.update(id, {
      isActive: false,
      canceledAt: new Date(),
    });
  }
}

export const dayBoardingRepository = new DayBoardingRepository();
