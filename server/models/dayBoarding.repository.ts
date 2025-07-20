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

  async filerByDayData(
    branch: string,
    classId: string,
    startDate: string,
    endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.model.aggregate([
      {
        $match: {
          branch,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },

      {
        $match: {
          "studentInfo.class": new Types.ObjectId(classId),
        },
      },

      {
        $lookup: {
          from: "classes", // tên collection class
          localField: "studentInfo.class",
          foreignField: "_id",
          as: "studentInfo.classInfo", // populate vào studentInfo.classInfo
        },
      },
      {
        $unwind: "$studentInfo.classInfo",
      },
    ]);
  }
}

export const dayBoardingRepository = new DayBoardingRepository();
