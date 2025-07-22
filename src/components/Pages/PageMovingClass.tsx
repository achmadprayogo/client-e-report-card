import { useEffect, useState } from 'react';
import { getData, postData } from '../../../fetcher';
import {
  Response,
  DateStatus,
  Option,
  ClassMemberSetting,
  AcademicYear,
  GradeClass,
  ClassName,
  StudentStatus,
  StatusAction,
} from '../../../index';
import {
  initialResponse,
  initialOptions,
  initialClassMemberSetting,
} from '../../../initialStates';
import Table from '../Table/Table';
import Badge from '../Badges/Badge';
import Helper from '../../../Helper';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import TableHeader from '../Table/TableHeader';
import OptionsInput from '../Form/OptionsInput';
import TableHeadRow from '../Table/TableHeadRow';
import TableBodyRow from '../Table/TableBodyRow';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import TableContainer from '../Table/TableContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import UpdateMovingClass from '../Form/MovingClass/UpdateMovingClass';

function PageMovingClass() {
  const [response, setResponse] = useState<Response>(initialResponse,);
  const [classMember, setClassMember] = useState<ClassMemberSetting[]>([initialClassMemberSetting]);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');
  const [gradeClassSelected, setGradeClassSelected] = useState<string>('');
  const [classNameSelected, setClassNameSelected] = useState<string>('');
  const [nextGradeClassOptions, setNextGradeClassOptions] = useState<Option[]>(initialOptions);
  const [nextClassNameOptions, setNextClassNameOptions] = useState<Option[]>(initialOptions);
  const [nextAcademicYearSelected, setnextAcademicYearSelected] = useState<string>('');
  const [nextGradeClassSelected, setnextGradeClassSelected] = useState<string>('');
  const [nextClassNameSelected, setnextClassNameSelected] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [gradeClasses, setGradeClasses] = useState<GradeClass[]>([]);
  const [classNames, setClassNames] = useState<ClassName[]>([]);
  /** pop up */
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ClassMemberSetting>(initialClassMemberSetting);

  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const classNameQuery = `filter[class_name_id]=${classNameSelected}`;
  const gradeClassQuery = `filter[grade_class_id]=${gradeClassSelected}`;
  const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
  const LINK = `/api/admin/class-member?${pageQuery}&${sortQuery}&${academicYearQuery}&${gradeClassQuery}&${classNameQuery}`;

  useEffect(() => {
    setGradeClassOptions(initialOptions);
    setClassNameOptions(initialOptions);
  }, [academicYearSelected]);

  useEffect(() => {
    fetchClassNames(LINK);
    getAcademicYearOptions();
    if (academicYearSelected) getGradeClassOptions();
    if (gradeClassSelected) getClassNameOptions();
  }, [academicYearSelected, gradeClassSelected, classNameSelected]);

  useEffect(() => {}, [nextGradeClassSelected]);

  useEffect(() => {
    if (nextAcademicYearSelected) getNextGradeClassOptions();
    if (nextGradeClassSelected) getNextClassNameOptions();
    fetchData();
  }, [nextAcademicYearSelected, nextGradeClassSelected, nextClassNameSelected]);

  const handlePagingation = async (url: string) => {
    fetchClassNames(url);
  };
  const handleAcademicYearOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAcademicYearSelected(e.target.value);
  };
  const handleGradeClassOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClassSelected(e.target.value);
  };
  const handleClassNameOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassNameSelected(e.target.value);
  };
  const handleNextAcademicYearOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setnextAcademicYearSelected(e.target.value);
    const academicYear = academicYears.find((year) => year.id === e.target.value);
    const newData = classMember.map((member) => ({
      ...member,
      next_academic_year: academicYear?.academic_year || 'not found',
      next_academic_year_status: academicYear
        ? Helper.getDateStatus(academicYear.start_date, academicYear.end_date)
        : DateStatus.INVALID,
    }));
    setClassMember(newData);
  };
  const handleNextGradeClassOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setnextGradeClassSelected(e.target.value);
    const gradeClass =
      gradeClasses.find((grade) => grade.id === e.target.value)?.grade_class || 'not found';
    const newData = classMember.map((member) => ({
      ...member,
      next_grade_class: gradeClass,
    }));
    setClassMember(newData);
  };
  const handleNextClassNameOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setnextClassNameSelected(e.target.value);
    const className = classNames.find((name) => name.id === e.target.value);
    const newData = classMember.map((member) => ({
      ...member,
      next_academic_year_id: nextAcademicYearSelected,
      next_class_name_id: e.target.value,
      next_class_name: className?.class_name || 'not found',
      next_homeroom_teacher: className?.homeroom_teacher || 'not found',
    }));
    setClassMember(newData);
  };

  const handleSave = async () => {
    const responses: any[] = [];
    classMember.map(async (member) => {
      const data = {
        student_id: member.student_id,
        academic_year_id: member.next_academic_year_id,
        class_name_id: member.next_class_name_id,
        student_status: StudentStatus.ACTIVE,
      };
      const response = await postData('/api/admin/class-member/join', data);
      if (response.status === 200) {
        const result: ClassMemberSetting = {
          ...member,
          status_action: StatusAction.SUCCESS,
        };
        setClassMember((prev) =>
          prev.map((item) => (item.id === member.id ? { ...item, ...result } : item)),
        );
        responses.push(response);
      } else {
        const result: ClassMemberSetting = {
          ...member,
          status_action: StatusAction.ERROR,
        };
        setClassMember((prev) =>
          prev.map((item) => (item.id === member.id ? { ...item, ...result } : item)),
        );
        responses.push(response);
      }
    });
  };

  const handleDoubleClick = (data: ClassMemberSetting) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };

  const handleUpdate = (data: ClassMemberSetting) => {
    const newData = classMember.map((member) =>
      member.id === data.id ? { ...member, ...data } : member,
    );
    setClassMember(newData);
    setIsUpdatePopUpOpen(false);
  };

  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setSelectedData(initialClassMemberSetting);
  };

  return (
    <ContentContainer direction="column">
      <UpdateMovingClass
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
        onSubmit={handleUpdate}
      />
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${response.meta.page.total} Santri`}</ToolbarItem>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row h-[40px] items-center gap-2 py-1 px-4 rounded-md bg-slate-700">
            <p className="text-white font-semibold border-r-2 pr-2">KELAS LAMA</p>
            <select
              onChange={handleAcademicYearOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={academicYearOptions} />
            </select>
            <select
              onChange={handleGradeClassOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={gradeClassOptions} />
            </select>
            <select
              onChange={handleClassNameOptionsChange}
              name="class_name_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={classNameOptions} />
            </select>
          </div>
          <div className="flex flex-row h-[40px] items-center gap-2 py-1 px-4 rounded-md bg-green-700">
            <p className="text-white font-semibold border-r-2 pr-2">KELAS BARU</p>
            <select
              onChange={handleNextAcademicYearOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={academicYearOptions} />
            </select>
            <select
              onChange={handleNextGradeClassOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={nextGradeClassOptions} />
            </select>
            <select
              onChange={handleNextClassNameOptionsChange}
              name="class_name_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={nextClassNameOptions} />
            </select>
          </div>
          <button
            type="button"
            disabled={false}
            className="w-48 h-[40px] flex flex-row justify-center gap-2 items-center bg-yellow-800 text-white font-semibold rounded-md hover:bg-yellow-600"
            onClick={handleSave}
          >
            <span className="material-symbols-outlined">save</span>
            <p>Terapkan</p>
          </button>
        </div>
      </ToolbarContainer>
      <TableContainer>
        <Table>
          <TableHeadRow>
            <TableHeader>No</TableHeader>
            <TableHeader>NIS</TableHeader>
            <TableHeader>Nama Lengkap</TableHeader>
            <TableHeader>Tahun Ajaran</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Tingkat</TableHeader>
            <TableHeader>Kelas</TableHeader>
            <TableHeader>Wali Kelas</TableHeader>
            <TableHeader>{''}</TableHeader>
            <TableHeader>Tahun Ajaran</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Tingkat</TableHeader>
            <TableHeader>Kelas</TableHeader>
            <TableHeader>Wali Kelas</TableHeader>
            <TableHeader>Status Action</TableHeader>
          </TableHeadRow>
          <tbody>
            {classMember.map((member, index) => (
              <TableBodyRow key={member.id} onDoubleClick={() => handleDoubleClick(member)}>
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{member.nis}</TableData>
                <TableData>{member.fullname}</TableData>
                <TableData>{member.academic_year}</TableData>
                <TableData>
                  <Badge
                    key={member.academic_year}
                    text={member.academic_year_status}
                    className={`text-white ${
                      member.academic_year_status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : member.academic_year_status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : member.academic_year_status === DateStatus.PAST
                        ? 'bg-slate-500'
                        : 'bg-red-500'
                    }`}
                  />
                </TableData>
                <TableData>{member.grade_class}</TableData>
                <TableData>{member.class_name}</TableData>
                <TableData>{member.homeroom_teacher}</TableData>
                <TableData>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </TableData>
                <TableData>{member.next_academic_year}</TableData>
                <TableData>
                  <Badge
                    key={member.next_academic_year}
                    text={member.next_academic_year_status}
                    className={`text-white ${
                      member.next_academic_year_status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : member.next_academic_year_status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : member.next_academic_year_status === DateStatus.PAST
                        ? 'bg-slate-500'
                        : 'bg-red-500'
                    }`}
                  />
                </TableData>
                <TableData>{member.next_grade_class}</TableData>
                <TableData>{member.next_class_name}</TableData>
                <TableData>{member.next_homeroom_teacher}</TableData>
                <TableData>
                  {member.status_action === StatusAction.SUCCESS ? (
                    <div className="flex flex-col items-center justify-center text-green-500">
                      <span className="material-symbols-outlined">check</span>
                      <p>berhasil</p>
                    </div>
                  ) : member.status_action === StatusAction.ERROR ? (
                    <div className="flex flex-col items-center justify-center text-red-500">
                      <span className="material-symbols-outlined">cancel</span>
                      <p>gagal</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined">hotel</span>
                      <p>no action</p>
                    </div>
                  )}
                </TableData>
              </TableBodyRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
      <TablePagination
        currentPage={response.meta.page.current_page}
        totalPages={response.meta.page.last_page}
        onPageNext={() => handlePagingation(response.links.next)}
        onPagePrev={() => handlePagingation(response.links.prev)}
      />
    </ContentContainer>
  );

  async function fetchClassNames(URL: string) {
    if (!classNameSelected) return;

    const response = await getData(URL);
    setResponse(response);
    const classMembers = Helper.formatClassMemberSetting(response.data, response.included);
    setClassMember(classMembers);
  }

  async function getAcademicYearOptions() {
    const result: Option[] = await Helper.getAcademicYearOptions();
    result.shift();
    result.pop();
    setAcademicYearOptions([{ label: 'Tahun Ajaran', value: '', disabled: true }, ...result]);
  }

  async function getGradeClassOptions() {
    const result = await Helper.getGradeClassOptions(academicYearSelected);
    result.shift();
    result.pop();
    setGradeClassOptions([{ label: 'Tingkat', value: '', disabled: true }, ...result]);
  }

  async function getClassNameOptions() {
    const result = await Helper.getClassNameOptions(gradeClassSelected);
    result.shift();
    result.pop();
    setClassNameOptions([{ label: 'Kelas', value: '', disabled: true }, ...result]);
  }

  async function getNextGradeClassOptions() {
    const result = await Helper.getGradeClassOptions(nextAcademicYearSelected);
    result.pop();
    result.shift();
    setNextGradeClassOptions([{ label: 'Tingkat', value: '', disabled: true }, ...result]);
  }

  async function getNextClassNameOptions() {
    const result = await Helper.getClassNameOptions(nextGradeClassSelected);
    result.shift();
    result.pop();
    setNextClassNameOptions([{ label: 'Kelas', value: '', disabled: true }, ...result]);
  }

  async function fetchData() {
    let academicYears = await getData('/api/admin/academicyears');
    academicYears = Helper.formatAcademicYears(academicYears.data);
    setAcademicYears(academicYears);
    if (nextAcademicYearSelected) {
      let gradeClasses = await getData('/api/admin/grade-class/' + nextAcademicYearSelected);
      gradeClasses = Helper.formatGradeClass(gradeClasses.data, gradeClasses.included);
      setGradeClasses(gradeClasses);
    }
    if (nextGradeClassSelected) {
      let classNames = await getData('/api/admin/class-name/' + nextGradeClassSelected);
      classNames = Helper.formatClassName(classNames.data, classNames.included);
      setClassNames(classNames);
    }
  }
}

export default PageMovingClass;
