import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Helper from '../../../Helper';
import Search from '../Toolbar/Search';
import Loading from '../Loading/Loading';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import { getData } from '../../../fetcher';
import TableHeader from '../Table/TableHeader';
import OptionsInput from '../Form/OptionsInput';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import ErrorServer from '../ErrorServer/ErrorServer';
import TableContainer from '../Table/TableContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import NotFoundError from '../NotFoundError/NotFoundError';
import StudentStatusBadge from '../Badges/StudentStatusBadge';
import { StudentStatus, ClassMember, Response, Option } from '../../../index';
import {
  statusOptions,
  initialOptions,
  initialResponse,
  initialClassMember,
} from '../../../initialStates';
import UpdateClassMember from '../Form/ClassMember/UpdateClassMember';

function PageClassMember() {
  const [search, setSearch] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('fullname');
  const [gradeClass, setGradeClass] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusResponse, setStatusResponse] = useState<number>(0);
  const [classMemeber, setClassMember] = useState<ClassMember[]>([]);
  const [response, setResponse] = useState<Response>(initialResponse);
  const [studentStatus, setStudentStatus] = useState<StudentStatus | string>('');
  const [classNameOptions, setClassNameOptions] = useState<Option[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ClassMember>(initialClassMember);

  const navigate = useNavigate();

  const academicYearSelected = useParams().academic_year_id || '';
  const newStatusOptions = [{ ...statusOptions[0], label: 'Status' }, ...statusOptions.slice(1)];

  useEffect(() => {
    setClassName('');
    setGradeClass('');
    async function fetchOptions() {
      const result = await Helper.getGradeClassOptions(academicYearSelected);
      setGradeClassOptions([...result, { label: 'Semua', value: '' }]);
    }
    if (academicYearSelected !== '') {
      fetchOptions();
    }
  }, [academicYearSelected]);

  useEffect(() => {
    setClassName('');
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(gradeClass);
      setClassNameOptions([...result, { label: 'Semua', value: '' }]);
    }
    if (gradeClass !== '') {
      fetchOptions();
    }
  }, [gradeClass]);

  useEffect(() => {
    async function fetchData() {
      const pageQuery = `page[number]=${1}&page[size]=${20}`;
      const searchQuery = `search=${search}`;
      const classNameQuery = `filter[class_name_id]=${className}`;
      const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
      const studentStatusQuery = `filter[student_status]=${studentStatus}`;
      const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
      const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
      const URL = `/api/admin/class-member?${pageQuery}&${academicYearQuery}&${studentStatusQuery}&${classNameQuery}&${gradeClassQuery}&${searchQuery}&${sortQuery}`; // prettier-ignore

      const result = await getData(URL);
      setStatusResponse(result.status);

      setResponse(result);
      const formatedData: ClassMember[] = Helper.formatClassMember(result.data, result.included);

      setClassMember(formatedData);
      setIsLoading(false);
    }

    fetchData();
  }, [academicYearSelected, studentStatus, search, className, gradeClass, sortBy, sortOrder]);

  const handlePagingation = async (LINK: string) => {
    if (LINK !== '') {
      const result = await getData(LINK);

      if (result) {
        setResponse(result);
        const formatedData: ClassMember[] = Helper.formatClassMember(result.data, result.included);

        setClassMember(formatedData);
      }
    }
  };

  const handleStudentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentStatus(e.target.value as StudentStatus);
  };

  const handleClassNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
  };

  const handleGradeClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClass(e.target.value);
  };

  const handleSearch = async (search: string) => {
    setSearch(search);
  };

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDoubleClick = (data: ClassMember) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };

  const handleClose = () => {
    setIsInputPopUpOpen(false);
    setIsUpdatePopUpOpen(false);
    handlePagingation(response.links.self);
  };

  if (statusResponse === 404) return <NotFoundError data={'kelas'} />;
  if (statusResponse === 500) return <ErrorServer />;
  if (isLoading) return <Loading />;

  return (
    <ContentContainer direction="column">
      <UpdateClassMember
        selectedData={selectedData}
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
      />
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${response.meta.page.total} Santri`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        {academicYearSelected && (
          <>
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={handleGradeClassChange}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={gradeClassOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="meeting_room">
              <div className="flex flex-row space-x-2">
                <p>Kelas :</p>
                <select
                  onChange={handleClassNameChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={classNameOptions} />
                </select>
              </div>
            </ToolbarItem>
          </>
        )}
        <ToolbarItem
          icon={
            studentStatus === 'active'
              ? 'check_circle'
              : studentStatus === 'graduate'
              ? 'school'
              : studentStatus === 'dropout'
              ? 'do_not_disturb_on'
              : 'manage_accounts'
          }
        >
          <div>
            <select
              onChange={handleStudentStatusChange}
              name="student_status"
              className="text-white bg-transparent focus:outline-none"
            >
              {newStatusOptions.map((status) => (
                <option key={status.value} value={status.value} className="text-white bg-[#343a40]">
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader
                filter={sortBy == 'academic_year'}
                order={sortOrder}
                onClick={() => handleSort('academic_year')}
              >
                Tahun Ajaran
              </TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader
                filter={sortBy === 'fullname'}
                order={sortOrder}
                onClick={() => handleSort('fullname')}
              >
                Nama
              </TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
            </tr>
          </thead>
          <tbody>
            {classMemeber.map((member, index) => (
              <tr
                key={member.id}
                id={member.id}
                className="hover:bg-gray-700"
                onDoubleClick={() => handleDoubleClick(member)}
              >
                <TableData>{response.meta.page.from + index}</TableData>
                <TableData>{member.academic_year}</TableData>
                <TableData>{member.nis}</TableData>
                <TableData>{member.fullname}</TableData>
                <TableData>
                  <StudentStatusBadge text={member.student_status} />
                </TableData>
                <TableData>{member.grade_class}</TableData>
                <TableData>{member.class_name}</TableData>
                <TableData>Ust. {member.homeroom_teacher}</TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={response.meta.page.current_page}
        totalPages={response.meta.page.last_page}
        onPageNext={() => handlePagingation(response.links.next)}
        onPagePrev={() => handlePagingation(response.links.prev)}
      />
    </ContentContainer>
  );
}

export default PageClassMember;
