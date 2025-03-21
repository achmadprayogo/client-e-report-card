import Helper from "./Helper";
import { AlertStatus, ClassMember, DataFetch, StudentStatus } from "./index";

export const initialDataFetch: DataFetch = {
  data: [],
  meta: {
    page: {
      current_page: 0,
      last_page: 0,
      from: 0,
      to: 0,
      total: 0,
    },
  },
  links: {
    first: "",
    last: "",
    next: "",
    prev: "",
  },
};

export const initialAlert = {
  isShow: false,
  alertStatus: "default" as AlertStatus,
  message: "",
  onClose: () => {},
};

export const initialStudentData = {
  nis: "",
  fullname: "",
  city_of_birth: "",
  birthdate: new Date(),
  father_name: "",
  mother_name: "",
  guardian_name: "",
  address: "",
};

export const initialClassMember: ClassMember = {
  id: "",
  nis: "",
  fullname: "",
  city_of_birth: "",
  birthdate: "",
  father_name: "",
  mother_name: "",
  guardian_name: "",
  address: "",
  academic_year_id: "",
  academic_year: "",
  student_status: StudentStatus.ACTIVE,
  grade_class_id: "",
  grade_class: "",
  class_name_id: "",
  class_name: "",
  homeroom_teacher: "",
};

export const initialFormInputStudent = {
  nis: "",
  fullname: "",
  city_of_birth: "",
  birthdate: "",
  father_name: "",
  mother_name: "",
  guardian_name: "",
  address: "",
  academic_year_id: "",
  class_name_id: "",
  status: "active" as "active" | "graduate" | "dropout",
};

export const initialFormUpdateStudent = {
  id: "",
  nis: "",
  fullname: "",
  city_of_birth: "",
  birthdate: new Date(),
  father_name: "",
  mother_name: "",
  guardian_name: "",
  address: "",
};

export const initialStudentScore = {
  id: "-",
  nis: 0,
  fullname: "-",
  academic_year: "-",
  student_status: StudentStatus.ACTIVE,
  grade_class: "-",
  class_name: "-",
  homeroom_teacher: "-",
  quarter_academic_year_id: "-",
  quarter_academic_year: "-",
  MMC_score: 0,
  scores: [],
};

export const initialScore = {
  id: "-",
  subject_id: "-",
  subject: "-",
  score: 0,
};

export const initialOptions = [{ label: "Belum ada data", value: "" }];

export const initialAcademicYearOptions = async () => {
  const result = (await Helper.getAcademicYearOptions()).slice(1);
  return result;
};

export const statusOptions = [
  {
    label: "Pilih Status",
    icon: "manage_accounts",
    value: "",
    selected: true,
    disabled: true,
  },
  { label: "Aktif", icon: "check_circle", value: "active" },
  { label: "Lulus", icon: "school", value: "graduate" },
  { label: "Boyong", icon: "do_not_disturb_on", value: "dropout" },
];

export const initialTeacherNote = {
  id: "-",
  nis: 0,
  fullname: "-",
  academic_year: "-",
  grade_class: "-",
  class_name: "-",
  quarter_academic_year: "",
  homeroom_teacher: "-",
  note: "-",
};

export const initialAttendanceData = {
  id: "-",
  nis: 0,
  fullname: "-",
  grade_class: "-",
  class_name: "-",
  homeroom_teacher: "-",
  academic_year: "-",
  quarter_academic_year: "-",
  total_sicks: 0,
  total_permissions: 0,
  total_absences: 0,
};
