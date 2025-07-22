export interface Response {
  data: {
    id: string;
    type: string;
    attributes: Object;
    relationships?: Object;
  }[];
  included: {
    id: string;
    type: string;
    attributes: Object;
    relationships?: Object;
  }[];
  meta: {
    page: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
    };
  };
  links: {
    first: string;
    self: string;
    last: string;
    next: string;
    prev: string;
  };
  error?: {
    status: number;
    title: string;
    detail: string;
  };
}

export interface Student {
  id: string;
  nis: string;
  fullname: string;
  city_of_birth: string;
  birthdate: string;
  age?: number;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  student_status?: StudentStatus;
  address: string;
}

export interface ClassMember {
  id: string;
  nis: string;
  fullname: string;
  city_of_birth: string;
  birthdate: string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address: string;
  academic_year_id: string;
  academic_year: string;
  student_status: StudentStatus;
  grade_class_id: string;
  grade_class: string;
  class_name_id: string;
  class_name: string;
  homeroom_teacher: string;
}

export interface StudentScore {
  id: string;
  nis: number;
  fullname: string;
  academic_year: string;
  student_status: StudentStatus;
  grade_class: string;
  class_name: string;
  homeroom_teacher: string;
  quarter_academic_year_id: string;
  quarter_academic_year: string;
  quarter_standart_score: number; // Minimum Completeness Criteria
  scores: Score[];
  total_score?: number;
  average_score?: number;
  rank?: number;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Score {
  id: string;
  subject_id?: string;
  subject: string;
  score: number;
}

export interface TeacherNote {
  id: string;
  academic_year: string;
  nis: number;
  fullname: string;
  grade_class: string;
  class_name: string;
  homeroom_teacher: string;
  quarter_academic_year: string;
  note: string;
}

export enum StudentStatus {
  ACTIVE = 'active',
  GRADUATE = 'graduate',
  DROPOUT = 'dropout',
  INVALID = 'invalid',
}

export enum AlertStatus {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface AlertConfig {
  isShow: boolean;
  alertStatus: AlertStatus;
  message: string;
  onClose?: () => void;
}

export interface StudentInputProps {
  formData: Student;
  isUpdate: boolean;
  loading: boolean;
  statusResponse: number;
  alert: AlertConfig;
  lastData: Student;
  studentId: string;
  setFormData: (value: Student) => void;
  setIsUpdate: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setStatusResponse: (value: number) => void;
  setAlert: (value: AlertConfig) => void;
  setLastData: (value: Student) => void;
}

export interface StudentInputState {
  formData: Student;
  isUpdate: boolean;
  loading: boolean;
  statusResponse: number;
  alert: AlertConfig;
  lastData: Student;
  studentId: string;
}

export interface StudentDeleteProps {
  formData: Student;
  setFormData: (value: Student) => void;
}

export interface Option {
  label: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface ClassNameOption extends Option {
  homeroom_teacher: string;
}

export interface FormUpdateStudent {
  nis: string;
  fullname: string;
  city_of_birth: string;
  birthdate: string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address: string;
}

export interface FormInputStudent {
  nis: string;
  fullname: string;
  city_of_birth: string;
  birthdate: string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address: string;
  academic_year_id: string;
  status: 'active' | 'dropout' | 'graduate';
  class_name_id: string;
}

export interface AttendanceData {
  id: string;
  nis: number;
  fullname: string;
  grade_class: string;
  class_name: string;
  homeroom_teacher: string;
  academic_year: string;
  quarter_academic_year: string;
  total_sicks: number;
  total_permissions: number;
  total_absences: number;
}

export interface AcademicYear {
  id: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  status: DateStatus;
  head_master: string;
}

export enum DateStatus {
  PAST = 'berlalu',
  CURRENT = 'berjalan',
  FUTURE = 'mendatang',
  INVALID = 'tidak valid',
}

export interface QuarterAcademicYear {
  id: string;
  academic_year: string;
  quarter_academic_year: number;
  score_standart: number;
  start_date: string;
  end_date: string;
  status: DateStatus;
}

export interface GradeClass {
  id: string;
  academic_year: string;
  academic_year_status: DateStatus;
  grade_class: string;
}

export interface ClassName {
  id: string;
  academic_year: string;
  academic_year_status: DateStatus;
  grade_class: string;
  class_name: string;
  homeroom_teacher: string;
}

export interface SubjectDetail {
  id: string;
  academic_year: string;
  academic_year_status: DateStatus;
  grade_class: string;
  subject_name: string;
}

export interface ClassMemberSetting
  extends Pick<
    ClassMember,
    'id' | 'nis' | 'fullname' | 'academic_year' | 'grade_class' | 'class_name' | 'homeroom_teacher'
  > {
  student_id: string;
  academic_year_status: DateStatus;
  next_academic_year: string;
  next_academic_year_id: string;
  next_academic_year_status: DateStatus;
  next_grade_class: string;
  next_class_name: string;
  next_homeroom_teacher: string;
  status_action?: StatusAction;
  next_class_name_id: string;
}

export enum StatusAction {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  WAITING = 'waiting',
}
