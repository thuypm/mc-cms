import mongoose, { Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
export interface ITeacher extends Document {
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

const teacherSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    positionText: { type: String, required: true },
    class: { type: String },
    branch: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String },
    roles: {
      type: [String],
      enum: ["SUPER_ADMIN", "TEACHER"],
      required: true,
    },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
class TeacherRepository extends BaseRepository<ITeacher> {
  constructor() {
    super(Teacher);
  }
}

export const teacherRepository = new TeacherRepository();
