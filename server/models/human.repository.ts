import mongoose, { Schema, Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IClass } from "./class.repository";
import { USER_ROLE_ENUM } from "../utils/enum";
interface ModulePermission {
  module: string;
  permission: string[];
}
export interface IHuman extends Document {
  _id: Types.ObjectId;
  name: string;
  positionText: string;
  class: string;
  branch: string;
  phone: string;
  email: string;
  subject: string;
  headquarter: IClass[];
  roles: USER_ROLE_ENUM[];
  modulePermissions: ModulePermission[];
}

const humanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    positionText: { type: String, required: true },
    class: { type: String },
    branch: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String },

    // roles theo đúng IHuman
    roles: {
      type: [String],
      enum: USER_ROLE_ENUM,
      required: true,
    },

    // headquarter: array of IClass (ObjectId ref)
    headquarter: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],

    // modulePermissions
    modulePermissions: [
      {
        module: { type: String, required: true },
        permission: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export const Human = mongoose.model<IHuman>("Human", humanSchema);
class HumanRepository extends BaseRepository<IHuman> {
  constructor() {
    super(Human);
  }
}

export const humanRepository = new HumanRepository();
