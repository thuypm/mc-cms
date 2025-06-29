import { FilterQuery, Model, Types } from "mongoose";

export class BaseRepository<T extends { _id: Types.ObjectId }> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>) {
    return await this.model.create(data);
  }

  async findAll(filter: FilterQuery<T> = {}, populate?: string | string[]) {
    if (populate) return await this.model.find(filter).populate(populate);
    else return await this.model.find(filter);
  }
  async createMany(data: Partial<T>[]) {
    return this.model.insertMany(data);
  }
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return this.model.findById(id);
  }

  async update(id: string, data: Partial<T>) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    return this.model.findByIdAndDelete(id);
  }

  async paginate(options: {
    filter?: FilterQuery<T>;
    page?: number;
    limit?: number;
    sort?: any;
    populate?: string | string[];
  }) {
    const {
      filter = {},
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      populate,
    } = options;

    const skip = (page - 1) * limit;
    const query = this.model.find(filter).skip(skip).limit(limit).sort(sort);
    if (populate) query.populate(populate);

    const [items, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
