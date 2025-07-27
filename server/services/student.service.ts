// services/student.service.ts
import { loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { IStudent, studentRepository } from "../models/student.repository";
import { USER_POSITION } from "../utils/enum";
import { createStudentPDF, generateStudentCard } from "../utils/getStudentCard";
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
        user.position === USER_POSITION.SUPER_ADMIN ? query.class : user.class,
    });
  };
  createStudentCard = async (mcids: string[], user: any) => {
    const students = await this.repository.findAll(
      {
        MCID: { $in: mcids },
        branch: user.branch,
      },
      "class"
    );
    const baseImage = await loadImage(
      path.join(process.cwd(), "public/base/Root.png")
    );
    const cards = await Promise.all(
      students.map((s: any) => generateStudentCard(s, baseImage))
    );
    const pdfBuffer = await createStudentPDF(cards);

    fs.writeFileSync("public/output/student-cards.pdf", pdfBuffer);
    console.log("✅ File PDF đã tạo: output/student-cards.pdf");

    return { success: true };
  };
}

export const studentService = new StudentService(studentRepository);
