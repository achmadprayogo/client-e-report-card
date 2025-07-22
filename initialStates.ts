import { l } from 'react-router/dist/development/fog-of-war-DLtn2OLr';
import Helper from './Helper';
import {
  AlertStatus,
  ClassMember,
  Response,
  DateStatus,
  StudentStatus,
  QuarterAcademicYear,
  GradeClass,
  ClassName,
  SubjectDetail,
  ClassMemberSetting,
  StatusAction,
  Student,
  Option,
  ClassNameOption,
} from './index';

export const initialResponse: Response = {
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
    self: '',
    first: '',
    last: '',
    next: '',
    prev: '',
  },
  included: [],
};

export const initialAlert = {
  isShow: false,
  alertStatus: 'default' as AlertStatus,
  message: '',
  onClose: () => {},
};

export const initialStudentData = {
  nis: '',
  fullname: '',
  city_of_birth: '',
  birthdate: new Date(),
  father_name: '',
  mother_name: '',
  guardian_name: '',
  address: '',
};

export const initialClassMember: ClassMember = {
  id: '',
  nis: '',
  fullname: '',
  city_of_birth: '',
  birthdate: '',
  father_name: '',
  mother_name: '',
  guardian_name: '',
  address: '',
  academic_year_id: '',
  academic_year: '',
  student_status: StudentStatus.ACTIVE,
  grade_class_id: '',
  grade_class: '',
  class_name_id: '',
  class_name: '',
  homeroom_teacher: '',
};

export const initialFormInputStudent = {
  nis: '',
  fullname: '',
  city_of_birth: '',
  birthdate: '',
  father_name: '',
  mother_name: '',
  guardian_name: '',
  address: '',
  academic_year_id: '',
  class_name_id: '',
  status: 'active' as 'active' | 'graduate' | 'dropout',
};

export const initialStudentScore = {
  id: '-',
  nis: 0,
  fullname: '-',
  academic_year: '-',
  student_status: StudentStatus.ACTIVE,
  grade_class: '-',
  class_name: '-',
  homeroom_teacher: '-',
  quarter_academic_year_id: '-',
  quarter_academic_year: '-',
  quarter_standart_score: 0,
  scores: [],
};

export const initialScore = {
  id: '-',
  subject_id: '-',
  subject: '-',
  score: 0,
};

export const initialOptions: Option[] = [{ label: 'Belum ada data', value: '' }];
export const initialClassNameOptions: ClassNameOption[] = [
  { label: 'Belum ada data', value: '', homeroom_teacher: 'Belum ada data' },
];

export const initialAcademicYearOptions = async () => {
  const result = (await Helper.getAcademicYearOptions()).slice(1);
  return result;
};

export const statusOptions = [
  {
    label: 'Pilih Status',
    icon: 'manage_accounts',
    value: '',
    selected: true,
    disabled: true,
  },
  { label: 'Aktif', icon: 'check_circle', value: 'active' },
  { label: 'Lulus', icon: 'school', value: 'graduate' },
  { label: 'Boyong', icon: 'do_not_disturb_on', value: 'dropout' },
];

export const initialTeacherNote = {
  id: '-',
  nis: 0,
  fullname: '-',
  academic_year: '-',
  grade_class: '-',
  class_name: '-',
  quarter_academic_year: '',
  homeroom_teacher: '-',
  note: '-',
};

export const initialAttendanceData = {
  id: '-',
  nis: 0,
  fullname: '-',
  grade_class: '-',
  class_name: '-',
  homeroom_teacher: '-',
  academic_year: '-',
  quarter_academic_year: '-',
  total_sicks: 0,
  total_permissions: 0,
  total_absences: 0,
};

export const initialAcademicYear = {
  id: '',
  academic_year: '',
  start_date: '1970-01-01',
  end_date: '1970-12-30',
  status: DateStatus.PAST,
  head_master: '',
};

export const initialQuarterAcademicYear: QuarterAcademicYear = {
  id: '',
  academic_year: '',
  quarter_academic_year: 0,
  start_date: '',
  end_date: '',
  score_standart: 0,
  status: DateStatus.CURRENT,
};

export const initialGradeClass: GradeClass = {
  id: '',
  academic_year: '',
  academic_year_status: DateStatus.PAST,
  grade_class: '',
};

export const initialClassName: ClassName = {
  id: '',
  academic_year: '',
  academic_year_status: DateStatus.PAST,
  grade_class: '',
  class_name: '',
  homeroom_teacher: '',
};

export const initialSubjectDetail: SubjectDetail = {
  id: '',
  academic_year: '',
  academic_year_status: DateStatus.PAST,
  grade_class: '',
  subject_name: '',
};

export const initialClassMemberSetting: ClassMemberSetting = {
  id: '',
  nis: '',
  fullname: '',
  academic_year: '',
  grade_class: '',
  class_name: '',
  homeroom_teacher: '',
  academic_year_status: DateStatus.INVALID,
  next_academic_year: '',
  next_academic_year_id: '',
  next_academic_year_status: DateStatus.INVALID,
  next_grade_class: '',
  next_class_name: '',
  next_class_name_id: '',
  next_homeroom_teacher: '',
  student_id: '',
  status_action: StatusAction.WAITING,
};

export const initialStudent: Student = {
  id: '',
  nis: '',
  fullname: '',
  student_status: StudentStatus.ACTIVE,
  age: 0,
  city_of_birth: '',
  birthdate: '01 Januari 1929',
  father_name: '',
  mother_name: '',
  guardian_name: '',
  address: '',
};
