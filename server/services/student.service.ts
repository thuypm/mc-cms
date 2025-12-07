// services/student.service.ts
import { IStudent, studentRepository } from "../models/student.repository";
import { USER_ROLE_ENUM } from "../utils/enum";
import { BaseService } from "./BaseServices";
class StudentService extends BaseService<IStudent> {
  getAllStudents = async (
    query: any,
    user: {
      _id: string;
      branch: string;
      position?: string;
      class: string;
    }
  ) => {
    return await this.repository.paginate({
      ...query,
      populate: "class",
      branch: user.branch,
      class:
        user.position === USER_ROLE_ENUM.SUPER_ADMIN ? query.class : user.class,
    });
  };
  getStudentInfoByIds = async (ids: string[], branch: any) => {
    return await this.repository.findAll(
      {
        VNEDUID: { $in: ids },
        branch: branch,
      },
      "class"
    );
  };
}

export const studentService = new StudentService(studentRepository);
