// services/student.service.ts
import { ObjectId } from "mongodb";
import {
  dayBoardingRepository,
  IDayBoarding,
} from "../models/dayBoarding.repository";
import { dayBoardingRegistrationRepository } from "../models/dayBoardingRegistration.repository";
import { studentRepository } from "../models/student.repository";
import { MC_SERVICE } from "../utils/enum";
import { BaseService } from "./BaseServices";

class DayBoardingService extends BaseService<IDayBoarding> {
  getDayBoardingAllRegistration = async (query?: any) => {
    const students = await studentRepository.findAll({
      ...query,
      class: new ObjectId(query.class),
    });

    const registedData = await dayBoardingRegistrationRepository.findAll(
      {
        student: { $in: students.map((e) => e._id) },
      },
      ["student", "registedBy"]
    );
    const registrationMap = new Map<string, any>();
    registedData.forEach((r) => {
      registrationMap.set(r.student.toString(), r); // toString để match ObjectId
    });

    const studentsWithRegister = students.map((student) => {
      const register = registrationMap.get(student._id.toString());
      return {
        ...(student.toObject?.() ?? student),
        register,
      };
    });
    return studentsWithRegister;
  };
  createDayBoardingAndRegistration = async ({
    studentIds,
    service,
    registedBy,
  }: {
    studentIds?: Array<string>;
    service?: MC_SERVICE;
    registedBy?: string;
  }) => {
    return await dayBoardingRegistrationRepository.createMany(
      studentIds.map((s) => ({
        student: new ObjectId(s),
        isActive: true,
        service,
        registedBy: new ObjectId(registedBy),
      }))
    );
  };

  getDayBoardings = async (query: any) => {
    return await this.repository.findAll(query);
  };
}

export const dayBoardingService = new DayBoardingService(dayBoardingRepository);
