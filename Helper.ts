import { getData } from "./fetcher";
import {
  AlertConfig,
  AlertStatus,
  Options,
  Score,
  StudentScore,
} from "./index";
import { StudentStatus } from "./index";

export default class Helper {
  static closeAlert(): AlertConfig {
    return {
      isShow: false,
      alertStatus: "default" as AlertStatus,
      message: "",
    };
  }
  static successAlert(): AlertConfig {
    return {
      isShow: true,
      alertStatus: "success" as AlertStatus,
      message: "Berhasil menyimpan data",
    };
  }

  static confilctAlert(): AlertConfig {
    return {
      isShow: true,
      alertStatus: "error" as AlertStatus,
      message: "Data utama telah dimasukkan sebelumnya",
    };
  }

  static notFoundAlert(): AlertConfig {
    return {
      isShow: true,
      alertStatus: "error" as AlertStatus,
      message: "Data tidak ditemukan atau sudah dihapus",
    };
  }

  static errorAlert(): AlertConfig {
    return {
      isShow: true,
      alertStatus: "error" as AlertStatus,
      message: "Gagal menyimpan data",
    };
  }

  static setOptions(data: [], label: string) {
    return data.map((item: any) => ({
      label: item.attributes[label],
      value: item.id,
    }));
  }

  static async getAcademicYearOptions() {
    const result = await getData("/api/admin/academicyear");

    if (!result) {
      throw new Error("Failed to fetch academic year data");
    }

    const academicYears = this.setOptions(result.data, "academic_year");
    return [
      {
        label: "Pilih Tahun Ajaran",
        value: "",
        selected: true,
        disabled: true,
      },
      ...academicYears,
    ];
  }

  static async getGradeOptions(academicyearId: string) {
    const result = await getData("/api/admin/gradeclass/" + academicyearId);

    if (!result) {
      throw new Error("Failed to fetch grade data");
    }

    const grades = this.setOptions(result.data, "grade_class");
    return [
      { label: "Pilih Tingkat", value: "", selected: true, disabled: true },
      ...grades,
    ];
  }

  static async getQuarterOptions(academicyearId: string) {
    const result = await getData(
      "/admin/quarteracademicyear/" + academicyearId
    );

    if (!result) {
      throw new Error("Failed to fetch quarter data");
    }
    const quarters = this.setOptions(result.data, "quarter_academic_year");
    return [
      { label: "Pilih Cawu", value: "", selected: true, disabled: true },
      ...quarters,
    ];
  }

  static async getClassNameOptions(gradeId: string) {
    const result = await getData("/api/admin/classname/" + gradeId);

    if (!result) {
      throw new Error("Failed to fetch class data");
    }

    const classes = this.setOptions(result.data, "class_name");
    return [
      { label: "Pilih Kelas", value: "", selected: true, disabled: true },
      ...classes,
    ];
  }

  static setIndexOptionSelected(
    options: Options[],
    index: number,
    selected: boolean
  ) {
    options.forEach((option, i) => {
      if (i === index) {
        option.selected = selected;
      } else {
        option.selected = !selected;
      }
    });
    return options;
  }

  static setIndexOptionDisabled(
    options: Options[],
    index: number,
    disabled: boolean
  ) {
    options.forEach((option, i) => {
      if (i === index) {
        option.disabled = disabled;
      }
    });
    return options;
  }

  static async getHomeroomTeacher(classId: string) {
    const result = await getData("/api/admin/classname/find/" + classId);

    if (!result) {
      throw new Error("Failed to fetch homeroom teacher data");
    }

    return `Ust. ${result.data.attributes.homeroom_teacher}`;
  }

  static formatStudentData(data: any) {
    let studentStatus = data.attributes.relationships?.class_member[0];
    let status = studentStatus ? studentStatus.attributes.student_status : "-";
    status =
      status === "active"
        ? "Aktif"
        : status === "dropout"
        ? "Boyong"
        : status === "graduate"
        ? "Lulus"
        : "-";

    return {
      ...data.attributes,
      id: data.id,
      nis: data.attributes.nis.toString(),
      fullname: this.capitalizeWords(data.attributes.fullname),
      status,
      city_of_birth: this.capitalizeWords(data.attributes.city_of_birth),
      father_name: this.capitalizeWords(data.attributes.father_name),
      mother_name: this.capitalizeWords(data.attributes.mother_name),
      guardian_name: this.capitalizeWords(data.attributes.guardian_name || "-"),
      address: this.capitalizeWords(data.attributes.address),
      birthdate: new Date(data.attributes.birthdate),
      age:
        new Date().getFullYear() -
        new Date(data.attributes.birthdate).getFullYear(),
      created_at: undefined,
      updated_at: undefined,
    };
  }

  static formatHTMLDate(date: string) {
    return date.split("T")[0];
  }

  static formatClassMember(data: any) {
    const relationships = data.attributes.relationships;
    const classNameRelationships = relationships.class_name.relationships;
    return {
      id: data.id,
      nis: relationships.student.nis,
      fullname: relationships.student.fullname,
      city_of_birth: relationships.student.city_of_birth,
      birthdate: this.formatHTMLDate(relationships.student.birthdate),
      father_name: relationships.student.father_name,
      mother_name: relationships.student.mother_name,
      guardian_name: relationships.student.guardian_name,
      address: relationships.student.address,
      academic_year_id:
        classNameRelationships.grade_class.relationships.academic_year.id,
      academic_year: classNameRelationships.grade_class.relationships.academic_year.academic_year, // prettier-ignore
      student_status: data.attributes.student_status as StudentStatus,
      grade_class_id: classNameRelationships.grade_class.id,
      grade_class: classNameRelationships.grade_class.grade_class,
      class_name_id: relationships.class_name.id,
      class_name: relationships.class_name.class_name,
      homeroom_teacher: relationships.class_name.homeroom_teacher,
    };
  }

  static capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  static async getStudentData(studentId: string) {
    const result = await getData(`/api/admin/student/${studentId}`);

    if (result.error) {
      return result;
    }

    if (!result) {
      throw new Error("Failed to fetch student data");
    }

    return this.formatStudentData(result.data.data);
  }

  static async getClassMemberData(studentId: string) {
    const result = await getData(`/api/admin/classmember/${studentId}`);

    if (result.error) {
      return result;
    }

    if (!result) {
      throw new Error("Failed to fetch class member data");
    }
    console.log(result);
    return this.formatClassMember(result.data);
  }

  static formatScore(data: any, included: any) {
    if (Array.isArray(data)) {
      const formatedData: StudentScore[] = [];
      data.map((item: any) => {
        const studentScore: StudentScore = this.formatScore(
          item,
          included
        ) as StudentScore;
        formatedData.push(studentScore);
      });
      return formatedData;
    }

    const student = included.find(
      (item: any) => item.id === data.attributes.student_id
    );
    const className = included.find(
      (item: any) => item.id === data.attributes.class_name_id
    );
    const gradeClass = included.find(
      (item: any) => item.id === className.attributes.grade_class_id
    );
    const quarterAcademicYear = included.find(
      (item: any) => item.id === data.attributes.quarter_academic_year_id
    );
    const academicYear = included.find(
      (item: any) => item.id === data.attributes.academic_year_id
    );

    // get scores
    const scores: Score[] = included
      .filter((item: any) => item.type === "score")
      .filter(
        (item: any) =>
          item.attributes.class_member_id === data.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id
      )
      .map((item: any) => ({
        id: item.id,
        subject_id: item.attributes.subject_id,
        subject: included.find((i: any) => i.id === item.attributes.subject_id)
          .attributes.subject_name,
        score: item.attributes.score,
      }));

    const formattedData: StudentScore = {
      id: data.id,
      nis: student.attributes.nis,
      fullname: student.attributes.fullname,
      academic_year: academicYear.attributes.academic_year,
      student_status: data.attributes.student_status,
      grade_class: gradeClass.attributes.grade_class,
      class_name: className.attributes.class_name,
      homeroom_teacher: className.attributes.homeroom_teacher,
      quarter_academic_year_id: quarterAcademicYear.id,
      quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year, // prettier-ignore
      MMC_score: 60,
      scores,
      total_score: data.attributes.total_score,
      average_score: data.attributes.average_score,
      rank: data.attributes.rank,
    };

    return formattedData;
  }

  static getSubjects(data: any) {
    return data
      .filter((item: any) => item.type === "subject")
      .map((item: any) => ({
        id: item.id,
        name: item.attributes.subject_name,
      }));
  }
}
