import mongoose, { Document, Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
export interface IClass extends Document {
  _id: Types.ObjectId;
  name: string;
  grade: string;
  branch: string;
}
const classSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    branch: { type: String, required: true },
  },
  { timestamps: true }
);

export const Class = mongoose.model<IClass>("Class", classSchema);
class ClassRepository extends BaseRepository<IClass> {
  constructor() {
    super(Class);
  }
}

export const classRepository = new ClassRepository();
