import { getData } from "./fetcher";
import { AlertConfig, AlertStatus } from "./index";
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
}
