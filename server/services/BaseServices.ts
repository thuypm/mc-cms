import { Types } from "mongoose";
import { BaseRepository } from "../models/base.repository";

export class BaseService<T extends { _id: Types.ObjectId }> {
  constructor(protected repository: BaseRepository<T>) {}

  async create(data: Partial<T>) {
    return await this.repository.create(data);
  }

  async findAll(filter: Partial<T> = {}) {
    return await this.repository.findAll(filter as any);
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return await this.repository.findOne(id);
  }

  async update(id: string, data: Partial<T>) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return await this.repository.update(id, data);
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return await this.repository.delete(id);
  }
}
