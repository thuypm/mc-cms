// services/student.service.ts
import { IStudent, studentRepository } from "../models/student.repository";
import { BaseService } from "./BaseServices";

class StudentService extends BaseService<IStudent> {}

export const dayBoardingService = new StudentService(studentRepository);
