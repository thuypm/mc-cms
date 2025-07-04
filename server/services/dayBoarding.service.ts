// services/student.service.ts
import { Types } from "mongoose";
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
      class: new Types.ObjectId(query.class),
    });

    const registedData = await dayBoardingRegistrationRepository.findAll(
      {
        student: { $in: students.map((e) => e._id) },
      },
      ["student", "registedBy"]
    );

    const registrationMap = new Map<string, any>();
    registedData.forEach((r) => {
      registrationMap.set(r.student._id.toString(), r); // toString để match ObjectId
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
  createDayBoardingAndRegistration = async (
    data: { _id?: string; service?: MC_SERVICE; isActive?: boolean }[],
    registedBy?: string
  ) => {
    for (const item of data) {
      const { _id: studentId, service, isActive } = item;

      const existing = await dayBoardingRegistrationRepository.findOne({
        student: new Types.ObjectId(studentId),
        service,
      });

      if (!existing) {
        await dayBoardingRegistrationRepository.create({
          student: new Types.ObjectId(studentId),
          service,
          isActive,
          registedBy: new Types.ObjectId(registedBy),
        });
      } else {
        existing.isActive = isActive;
        existing.registedBy = new Types.ObjectId(registedBy);
        await existing.save();
      }
    }
  };

  getDayBoardings = async (query: any) => {
    return await this.repository.findAll(query);
  };
}

export const dayBoardingService = new DayBoardingService(dayBoardingRepository);
