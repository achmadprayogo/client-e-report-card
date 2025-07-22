import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';
import { getData } from './fetcher';
import {
  QuarterAcademicYear,
  StudentStatus,
  ClassName,
  SubjectDetail,
  ClassMemberSetting,
  StatusAction,
  Student,
  ClassNameOption,
} from './index';
import {
  AlertConfig,
  AlertStatus,
  Option,
  Score,
  StudentScore,
  AcademicYear,
  DateStatus,
} from './index';
import { ag } from 'react-router/dist/development/route-data-aSUFWnQ6';

export default class Helper {
  static closeAlert(): AlertConfig {
    return {
      isShow: false,
      alertStatus: 'default' as AlertStatus,
      message: '',
    };
  }
  static successAlert(message?: string): AlertConfig {
    return {
      isShow: true,
      alertStatus: 'success' as AlertStatus,
      message: message || 'Berhasil menyimpan data',
    };
  }

  static confilctAlert(message?: string): AlertConfig {
    return {
      isShow: true,
      alertStatus: 'error' as AlertStatus,
      message: message || 'Data utama telah dimasukkan sebelumnya',
    };
  }

  static notFoundAlert(message?: string): AlertConfig {
    return {
      isShow: true,
      alertStatus: 'error' as AlertStatus,
      message: message || 'Data tidak ditemukan atau sudah dihapus',
    };
  }

  static errorAlert(message?: string): AlertConfig {
    return {
      isShow: true,
      alertStatus: 'error' as AlertStatus,
      message: message || 'Gagal menyimpan data',
    };
  }

  static setOptions(data: [], label: string) {
    return data.map((item: any) => ({
      label: item.attributes[label],
      value: item.id,
    }));
  }

  static async getAcademicYearOptions() {
    const result = await getData('/api/admin/academicyears');

    if (!result) throw new Error('Failed to fetch academic year data');

    const academicYears = this.setOptions(result.data, 'academic_year');
    return [
      {
        label: 'Pilih Tahun Ajaran',
        value: '',
        selected: true,
        disabled: true,
      },
      ...academicYears,
      {
        label: 'Semua Tahun Ajaran',
        value: '',
        selected: true,
        disabled: false,
      },
    ];
  }

  static async getGradeClassOptions(academicyearId: string) {
    const result = await getData('/api/admin/grade-class/' + academicyearId);

    if (!result) {
      throw new Error('Failed to fetch grade class data');
    }

    const grades = this.setOptions(result.data, 'grade_class');
    return [
      { label: 'Pilih Tingkat', value: '', selected: true, disabled: true },
      ...grades,
      {
        label: 'Semua Tingkat',
        value: '',
        selected: true,
        disabled: false,
      },
    ];
  }

  static async getQuarterOptions(academicyearId: string) {
    const result = await getData('/api/admin/quarter-academic-year/' + academicyearId);

    if (!result) {
      throw new Error('Failed to fetch quarter data');
    }

    const quarters = this.setOptions(result.data, 'quarter_academic_year');
    quarters.map((item: any) => {
      item.label = 'Cawu ' + item.label;
    });
    return [
      { label: 'Pilih Cawu', value: '', selected: true, disabled: true },
      ...quarters,
      { label: 'Semua Cawu', value: '', selected: true, disabled: false },
    ];
  }

  static async getClassNameOptions(gradeId: string): Promise<ClassNameOption[]> {
    const result = await getData('/api/admin/class-name/' + gradeId);

    if (!result) {
      throw new Error('Failed to fetch class data');
    }

    const classes = result.data.map((item: any) => ({
      label: 'Kelas ' + item.attributes.class_name,
      value: item.id,
      homeroom_teacher: item.attributes.homeroom_teacher,
    }));

    return [
      { label: 'Pilih Kelas', value: '', selected: true, disabled: true, homeroom_teacher: '' },
      ...classes,
      { label: 'Semua Kelas', value: '', selected: true, disabled: false, homeroom_teacher: '' },
    ];
  }

  static setIndexOptionSelected(options: Option[], index: number, selected: boolean) {
    options.forEach((option, i) => {
      if (i === index) {
        option.selected = selected;
      } else {
        option.selected = !selected;
      }
    });
    return options;
  }

  static setIndexOptionDisabled(options: Option[], index: number, disabled: boolean) {
    options.forEach((option, i) => {
      if (i === index) {
        option.disabled = disabled;
      }
    });
    return options;
  }

  static getHomeroomTeacher(classNameOptions: ClassNameOption[], classId: string): string {
    const className = classNameOptions.find((item) => item.value === classId);

    if (className) {
      return `Ust. ${className.homeroom_teacher}`;
    } else {
      return 'Belum ada data';
    }
  }

  static formatStudentData(data: any, included?: any): Student {
    const classMembers = included.filter(
      (item: any) => item.type === 'class_member' && item.attributes.student_id === data.id,
    );
    const isClassMembersOnlyOne = classMembers.length === 1;
    const status: StudentStatus =
      classMembers[0] && isClassMembersOnlyOne
        ? classMembers[0].attributes.student_status
        : StudentStatus.INVALID;

    return {
      ...data.attributes,
      id: data.id,
      nis: data.attributes.nis.toString(),
      fullname: this.capitalizeWords(data.attributes.fullname),
      student_status: status,
      city_of_birth: this.capitalizeWords(data.attributes.city_of_birth),
      father_name: this.capitalizeWords(data.attributes.father_name),
      mother_name: this.capitalizeWords(data.attributes.mother_name),
      guardian_name: this.capitalizeWords(data.attributes.guardian_name || '-'),
      address: this.capitalizeWords(data.attributes.address),
      birthdate: new Date(data.attributes.birthdate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      age: new Date().getFullYear() - new Date(data.attributes.birthdate).getFullYear(),
      created_at: undefined,
      updated_at: undefined,
    };
  }

  static formatHTMLDate(date: string) {
    return date.split('T')[0];
  }

  static formatClassMember(data: any[], included: any[]) {
    return data.map((member: any) => {
      const student = included.find(
        (item: any) => item.id === member.relationships.student.data.id,
      );
      const academicYear = included.find(
        (item: any) => item.id === member.relationships.academic_year.data.id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === member.relationships.grade_class.data.id,
      );
      const className = included.find(
        (item: any) => item.id === member.relationships.class_name.data.id,
      );
      return {
        id: member.id,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,
        city_of_birth: student.attributes.city_of_birth,
        birthdate: this.formatHTMLDate(student.attributes.birthdate),
        father_name: student.attributes.father_name,
        mother_name: student.attributes.mother_name,
        guardian_name: student.attributes.guardian_name,
        address: student.attributes.address,
        academic_year_id: academicYear.id,
        academic_year: academicYear.attributes.academic_year,
        student_status: member.attributes.student_status as StudentStatus,
        grade_class_id: gradeClass.id,
        grade_class: gradeClass.attributes.grade_class,
        class_name_id: className.id,
        class_name: className.attributes.class_name,
        homeroom_teacher: className.attributes.homeroom_teacher,
      };
    });
  }

  static formatNotes(data: any[], included: any[]) {
    const result = data.map((note: any) => {
      const classMember = included.find((item: any) => item.id === note.attributes.class_member_id);
      const student = included.find((item: any) => item.id === classMember.attributes.student_id);
      const className = included.find(
        (item: any) => item.id === classMember.attributes.class_name_id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === className.attributes.grade_class_id,
      );
      const quarterAcademicYear = included.find(
        (item: any) => item.id === note.attributes.quarter_academic_year_id,
      );
      const academicYear = included.find(
        (item: any) => item.id === quarterAcademicYear.attributes.academic_year_id,
      );
      return {
        id: note.id,
        academic_year: academicYear.attributes.academic_year,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,
        grade_class: gradeClass.attributes.grade_class,
        class_name: className.attributes.class_name,
        homeroom_teacher: className.attributes.homeroom_teacher,
        quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year,
        note: note.attributes.notes,
      };
    });
    return result;
  }

  static formatAttendanceData(data: any[], included: any[]) {
    const result = data.map((attendance: any) => {
      const classMember = included.find(
        (item: any) => item.id === attendance.attributes.class_member_id,
      );
      const student = included.find((item: any) => item.id === classMember.attributes.student_id);
      const className = included.find(
        (item: any) => item.id === classMember.attributes.class_name_id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === className.attributes.grade_class_id,
      );
      const quarterAcademicYear = included.find(
        (item: any) => item.id === attendance.attributes.quarter_academic_year_id,
      );
      const academicYear = included.find(
        (item: any) => item.id === quarterAcademicYear.attributes.academic_year_id,
      );
      return {
        id: attendance.id,
        academic_year: academicYear.attributes.academic_year,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,
        grade_class: gradeClass.attributes.grade_class,
        class_name: className.attributes.class_name,
        homeroom_teacher: className.attributes.homeroom_teacher,
        quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year,
        total_sicks: attendance.attributes.sick,
        total_permissions: attendance.attributes.permission,
        total_absences: attendance.attributes.absent,
      };
    });
    return result;
  }

  static formatTableReportCard(data: any[], included: any[]) {
    const result = data.map((attendance: any) => {
      const classMember = included.find(
        (item: any) => item.id === attendance.attributes.class_member_id,
      );
      const student = included.find((item: any) => item.id === classMember.attributes.student_id);
      const className = included.find(
        (item: any) => item.id === classMember.attributes.class_name_id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === className.attributes.grade_class_id,
      );
      const quarterAcademicYear = included.find(
        (item: any) => item.id === attendance.attributes.quarter_academic_year_id,
      );
      const academicYear = included.find(
        (item: any) => item.id === quarterAcademicYear.attributes.academic_year_id,
      );
      return {
        id: attendance.id,
        academic_year: academicYear.attributes.academic_year,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,
        class_member_id: classMember.id,
        grade_class: gradeClass.attributes.grade_class,
        class_name_id: className.id,
        class_name: className.attributes.class_name,
        homeroom_teacher: className.attributes.homeroom_teacher,
        quarter_academic_year_id: quarterAcademicYear.id,
        quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year,
      };
    });
    return result;
  }

  static formatReportCard(data: any[], included: any[]) {
    const result = data.map((classMember: any) => {
      const student = included.find((item: any) => item.id === classMember.attributes.student_id);
      const className = included.find(
        (item: any) => item.id === classMember.attributes.class_name_id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === className.attributes.grade_class_id,
      );
      const academicYear = included.find(
        (item: any) => item.id === gradeClass.attributes.academic_year_id,
      );
      const quarterAcademicYear = included.find(
        (item: any) => item.type === 'quarter_academic_year',
      );
      const subjects = included.filter(
        (item: any) => item.type === 'subject' && item.attributes.grade_class_id === gradeClass.id,
      );
      const scores = included.filter(
        (item: any) =>
          item.type === 'academic_score' &&
          item.attributes.class_member_id === classMember.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id,
      );
      const subjectScore = subjects.map((subject: any) => {
        return {
          subject_name: this.capitalizeWords(subject.attributes.subject_name),
          score: scores.find((score: any) => score.attributes.subject_id === subject.id)?.attributes
            .score,
        };
      });
      const teacherNote = included.find(
        (item: any) =>
          item.type === 'teacher_note' &&
          item.attributes.class_member_id === classMember.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id,
      );
      const studentAttendance = included.find(
        (item: any) =>
          item.type === 'student_attendance' &&
          item.attributes.class_member_id === classMember.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id,
      );
      const aggregateAcademicScore = included.find(
        (item: any) =>
          item.type === 'aggregate_academic_scores' &&
          item.attributes.class_member_id === classMember.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id,
      );

      return {
        id: classMember.id,
        academic_year: academicYear.attributes.academic_year,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,
        class_member_id: classMember.id,
        grade_class: gradeClass.attributes.grade_class,
        class_name_id: className.id,
        class_name: className.attributes.class_name,
        homeroom_teacher: className.attributes.homeroom_teacher,
        quarter_academic_year_id: quarterAcademicYear.id,
        quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year,
        standart_academic_score: quarterAcademicYear.attributes.score_standart,
        academic_scores: subjectScore,
        teacher_note: teacherNote.attributes.notes,
        student_attendance: {
          total_sicks: studentAttendance.attributes.sick,
          total_permissions: studentAttendance.attributes.permission,
          total_absences: studentAttendance.attributes.absent,
        },
        aggregate_academic_score: {
          total_score: aggregateAcademicScore.attributes.total_score,
          average_score: aggregateAcademicScore.attributes.average_score,
          total_students: aggregateAcademicScore.attributes.total_students,
          rank: aggregateAcademicScore.attributes.rank,
        },
      };
    });
    return result;
  }

  static formatAcademicYears(data: any): AcademicYear[] {
    return data.map((academicYear: any) => {
      return {
        id: academicYear.id,
        academic_year: academicYear.attributes.academic_year,
        start_date: academicYear.attributes.start_date,
        end_date: academicYear.attributes.end_date,
        status: this.getDateStatus(
          academicYear.attributes.start_date,
          academicYear.attributes.end_date,
        ),
        head_master: 'Budi Anduk',
      };
    });
  }

  static getDateStatus(start: string, end: string) {
    const currentDate = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (currentDate < startDate) {
      return DateStatus.FUTURE;
    } else if (currentDate > endDate) {
      return DateStatus.PAST;
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return DateStatus.CURRENT;
    } else {
      console.error('Invalid date range: start_date=' + start + ', end_date=' + end);
      return DateStatus.INVALID;
    }
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
      throw new Error('Failed to fetch student data');
    }

    return this.formatStudentData(result.data.data, result.data.included);
  }

  static async getClassMemberData(classMemberId: string) {
    const result = await getData(`/api/admin/class-member/${classMemberId}`);
    if (result.error) return result;

    if (!result) throw new Error('Failed to fetch class member data');

    return this.formatClassMember(result.data, result.included);
  }

  static formatScore(data: any, included: any) {
    if (Array.isArray(data)) {
      const formatedData: StudentScore[] = [];
      data.map((item: any) => {
        const studentScore: StudentScore = this.formatScore(item, included) as StudentScore;
        formatedData.push(studentScore);
      });
      return formatedData;
    }

    const student = included.find((item: any) => item.id === data.attributes.student_id);
    const className = included.find((item: any) => item.id === data.attributes.class_name_id);
    const gradeClass = included.find(
      (item: any) => item.id === className.attributes.grade_class_id,
    );
    const quarterAcademicYear = included.find(
      (item: any) => item.id === data.attributes.quarter_academic_year_id,
    );
    const academicYear = included.find((item: any) => item.id === data.attributes.academic_year_id);
    // ////////////////////////// just for debugging
    // included.forEach((item: any) => {
    //   const data = included.find((i: any) => i.id === item.attributes.subject_id)?.attributes;
    //   console.log('DATA', data);
    // });

    // get scores
    const scores: Score[] = included
      .filter((item: any) => item.type === 'score')
      .filter(
        (item: any) =>
          item.attributes.class_member_id === data.id &&
          item.attributes.quarter_academic_year_id === quarterAcademicYear.id,
      )
      .map((item: any) => {
        // const itemAttributes = item.attributes;
        // const subjectIncludedId = included.find((i: any) => i.id === itemAttributes.subject_id)
        //   ?.attributes.subject_id;
        // if (itemAttributes.subject_id === subjectIncludedId) {
        //   console.log('subject item', itemAttributes.subject_name, itemAttributes.subject_id);
        //   console.log(
        //     'subject incl',
        //     included.find((i: any) => i.id === itemAttributes.subject_id)?.attributes.subject_name,
        //     included.find((i: any) => i.id === itemAttributes.subject_id)?.attributes.subject_id,
        //   );
        // } else {
        //   console.log('Subject ID mismatch:', itemAttributes.subject_id, subjectIncludedId);
        // }
        const dataReturn = {
          id: item.id,
          subject_id: item.attributes.subject_id,
          subject:
            included.find((i: any) => i.id === item.attributes.subject_id)?.attributes
              .subject_name || 'Tidak ada data',
          score: item.attributes.score,
        };
        return dataReturn;
      });

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
      quarter_academic_year: quarterAcademicYear.attributes.quarter_academic_year,
      quarter_standart_score: quarterAcademicYear.attributes.score_standart,
      scores,
      total_score: data.attributes.total_score,
      average_score: data.attributes.average_score,
      rank: data.attributes.rank,
    };

    return formattedData;
  }

  static formatQuarterAcademicYear(data: any[], included: any[]): QuarterAcademicYear[] {
    const quarterAcademicYears = data.map((quarter: any) => {
      const academicYear = included.find(
        (item: any) => item.id === quarter.relationships.academic_year.data.id,
      );

      return {
        id: quarter.id,
        academic_year: academicYear.attributes.academic_year,
        quarter_academic_year: parseInt(quarter.attributes.quarter_academic_year),
        start_date: quarter.attributes.start_date,
        end_date: quarter.attributes.end_date,
        score_standart: quarter.attributes.score_standart,
        status: Helper.getDateStatus(quarter.attributes.start_date, quarter.attributes.end_date),
      };
    });
    console.log(data);
    return quarterAcademicYears;
  }

  static formatGradeClass(data: any[], included: any[]) {
    const gradeClasses = data.map((gradeClass: any) => {
      const academicYear = included.find(
        (item: any) => item.id === gradeClass.relationships.academic_year.data.id,
      );

      return {
        id: gradeClass.id,
        academic_year: academicYear.attributes.academic_year,
        grade_class: this.capitalizeWords(gradeClass.attributes.grade_class),
        academic_year_status: Helper.getDateStatus(
          academicYear.attributes.start_date,
          academicYear.attributes.end_date,
        ),
      };
    });
    return gradeClasses;
  }

  static formatClassName(data: any[], included: any[]): ClassName[] {
    const classNames = data.map((className: any) => {
      const academicYear = included.find(
        (item: any) => item.id === className.relationships.academic_year.data.id,
      );
      const gradeClassData = included.find(
        (item: any) => item.id === className.relationships.grade_class.data.id,
      );

      return {
        id: className.id,
        academic_year: academicYear.attributes.academic_year,
        grade_class: this.capitalizeWords(gradeClassData.attributes.grade_class),
        academic_year_status: Helper.getDateStatus(
          academicYear.attributes.start_date,
          academicYear.attributes.end_date,
        ),
        class_name: this.capitalizeWords(className.attributes.class_name),
        homeroom_teacher: this.capitalizeWords(className.attributes.homeroom_teacher),
      };
    });
    return classNames;
  }

  static formatSubjects(data: any[], included: any[]): SubjectDetail[] {
    return data.map((subject: any) => {
      const academicYear = included.find(
        (item: any) => item.id === subject.relationships.academic_year.data.id,
      );
      const gradeClassData = included.find(
        (item: any) => item.id === subject.relationships.grade_class.data.id,
      );
      return {
        id: subject.id,
        academic_year: academicYear.attributes.academic_year,
        grade_class: this.capitalizeWords(gradeClassData.attributes.grade_class),
        subject_name: this.capitalizeWords(subject.attributes.subject_name),
        academic_year_status: Helper.getDateStatus(
          academicYear.attributes.start_date,
          academicYear.attributes.end_date,
        ),
      };
    });
  }

  static formatClassMemberSetting(data: any[], included: any[]): ClassMemberSetting[] {
    return data.map((member: any) => {
      const student = included.find(
        (item: any) => item.id === member.relationships.student.data.id,
      );
      const academicYear = included.find(
        (item: any) => item.id === member.relationships.academic_year.data.id,
      );
      const gradeClass = included.find(
        (item: any) => item.id === member.relationships.grade_class.data.id,
      );
      const className = included.find(
        (item: any) => item.id === member.relationships.class_name.data.id,
      );
      return {
        id: member.id,
        student_id: student.id,
        nis: student.attributes.nis,
        fullname: student.attributes.fullname,

        academic_year: academicYear.attributes.academic_year,
        grade_class: this.capitalizeWords(gradeClass.attributes.grade_class),
        academic_year_status: Helper.getDateStatus(
          academicYear.attributes.start_date,
          academicYear.attributes.end_date,
        ),
        class_name: this.capitalizeWords(className.attributes.class_name),
        homeroom_teacher: this.capitalizeWords(className.attributes.homeroom_teacher),
        next_academic_year: '-',
        next_academic_year_id: '',
        next_academic_year_status: DateStatus.INVALID,
        next_grade_class: '-',
        next_class_name: '-',
        next_homeroom_teacher: '-',
        status_action: StatusAction.WAITING,
        next_class_name_id: '',
      };
    });
  }

  static getSubjects(data: any) {
    return data
      .filter((item: any) => item.type === 'subject')
      .map((item: any) => ({
        id: item.id,
        name: item.attributes.subject_name,
      }));
  }

  static toIndonesianDate(date: Date) {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static indonesianDateToISO(date: string): string {
    const isIsoString = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (isIsoString) return date;

    const INDMounth = [
      'januari',
      'februari',
      'maret',
      'april',
      'mei',
      'juni',
      'juli',
      'agustus',
      'september',
      'oktober',
      'november',
      'desember',
    ];

    const [day, month, year] = date.split(' ');
    const monthIndex = INDMounth.indexOf(month.toLowerCase()) + 1;
    const newDate = `${year}-${monthIndex}-${day}`;
    return newDate;
  }
}
