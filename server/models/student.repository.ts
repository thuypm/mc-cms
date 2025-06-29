import mongoose, { Document, Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
export interface IStudent extends Document {
  _id: Types.ObjectId;
  name: string;
  positionText: string;
  class: string;
  branch: string;
  phone: string;
  email: string;
  subject: string;
  roles: ("SUPER_ADMIN" | "TEACHER")[];
  position: string;
}

const studentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    positionText: { type: String },
    branch: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    subject: { type: String },

    roles: {
      type: [String],
      enum: ["SUPER_ADMIN", "TEACHER"],
      required: true,
    },
    position: { type: String },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // tên model (không phải tên collection)
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>("Student", studentSchema);

class StudentRepository extends BaseRepository<IStudent> {
  constructor() {
    super(Student);
  }
}

export const studentRepository = new StudentRepository();
