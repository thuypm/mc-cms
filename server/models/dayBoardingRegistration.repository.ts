import mongoose, { Document, Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";

export interface IDayBoardingRegistration extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  service: string;
  isActive: boolean;
  canceledAt?: Date;
  registedBy?: Types.ObjectId;
}

const DayBoardingRegistrationSchema: Schema = new Schema(
  {
    service: {
      type: String,
      required: true,
    },
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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    canceledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const DayBoardingRegistration = mongoose.model<IDayBoardingRegistration>(
  "DayBoardingRegistration",
  DayBoardingRegistrationSchema
);
class DayBoardingRegistrationRepository extends BaseRepository<IDayBoardingRegistration> {
  constructor() {
    super(DayBoardingRegistration);
  }
}

export const dayBoardingRegistrationRepository =
  new DayBoardingRegistrationRepository();
