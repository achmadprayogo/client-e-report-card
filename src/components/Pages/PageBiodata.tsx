import Helper from '../../../Helper';
import { useParams } from 'react-router';
import { getData } from '../../../fetcher';
import { useState, useEffect } from 'react';
import Search from '../Toolbar/Search';
import Loading from '../Loading/Loading';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import TableHeader from '../Table/TableHeader';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import TableContainer from '../Table/TableContainer';
import ErrorServer from '../ErrorServer/ErrorServer';
import InputStudent from '../Form/Student/InputStudent';
import UpdateStudent from '../Form/Student/UpdateStudent';
import NotFoundError from '../NotFoundError/NotFoundError';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import StudentStatusBadge from '../Badges/StudentStatusBadge';
import { Response, Student, StudentStatus } from '../../../index';
import { initialResponse, initialStudent, statusOptions } from '../../../initialStates';

interface error {
  status: number;
}

function PageBiodata() {
  const academicYearSelected = useParams().academic_year_id;
  const [studentStatusSelected, setStudentStatusSelected] = useState<string>('');
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Student>(initialStudent);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<Response>(initialResponse);
  const [error, setError] = useState<error>({ status: 200 });
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('fullname');
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>('');

  const newStatusOptions = [{ ...statusOptions[0], label: 'Status' }, ...statusOptions.slice(1)];

  async function fetchData() {
    try {
      const searchQuery = `search=${search}`;
      const pageQuery = `page[number]=${1}&page[size]=${20}`;
      const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
      const studentStatusQuery = `filter[student_status]=${studentStatusSelected}`;
      const academicYearQuery = `filter[academic_year_id]=${academicYearSelected || ''}`;
      const URL = `/api/admin/students?${sortQuery}&${pageQuery}&${academicYearQuery}&${studentStatusQuery}&${searchQuery}`;

      const response: Response = await getData(URL);

      if (response.error) {
        setError(response.error);
      } else {
        setResponse(response);
        setStudentFormated(response.data, response.included);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [academicYearSelected, studentStatusSelected, search, sortBy, sortOrder]);

  function setStudentFormated(data: any[], included: any[]) {
    const result: Student[] = data.map((student) => {
      return Helper.formatStudentData(student, included);
    });
    setStudents(result);
  }

  const handlePagingation = async (link: string) => {
    const result = await getData(link);

    if (result) {
      setResponse(result);
      setStudentFormated(result.data, result.included);
    }
  };

  const handleDoubleClick = (data: Student) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };

  const handleSearch = async (target: string) => {
    setSearch(target);
  };
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentStatusSelected(e.target.value as StudentStatus);
  };

  const handleSort = (target: string) => {
    setSortBy(target);
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleClose = () => {
    setIsInputPopUpOpen(false);
    setIsUpdatePopUpOpen(false);
    handlePagingation(response.links.self);
  };

  if (isLoading && !response) return <Loading />;
  if (error.status === 500) return <ErrorServer />;
  if (error.status >= 400 && error.status < 500) return <NotFoundError data={'Daftar Santri'} />;

  return (
    <ContentContainer direction="column">
      <UpdateStudent
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputStudent isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${response?.meta.page.total} Santri`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        {/* render when academic year selected */}
        {academicYearSelected && (
          <ToolbarItem
            icon={
              studentStatusSelected === 'active'
                ? 'check_circle'
                : studentStatusSelected === 'graduate'
                ? 'school'
                : studentStatusSelected === 'dropout'
                ? 'do_not_disturb_on'
                : 'manage_accounts'
            }
            onClick={() => {}}
          >
            <div>
              <select
                onChange={handleStatusChange}
                name="student_status"
                className="text-white bg-transparent focus:outline-none"
              >
                {newStatusOptions.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    className="text-white bg-[#343a40]"
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </ToolbarItem>
        )}
        <ToolbarItem icon="add" onClick={() => setIsInputPopUpOpen(true)}>
          Input Data
        </ToolbarItem>
        <ToolbarItem icon="file_upload" onClick={() => {}}>
          Import
        </ToolbarItem>
        <ToolbarItem icon="file_download" onClick={() => {}}>
          Export
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        {students.length !== 0 ? (
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#343a40]">
              <tr>
                <TableHeader>No</TableHeader>
                <TableHeader>NIS</TableHeader>
                <TableHeader
                  filter={sortBy === 'fullname'}
                  onClick={() => handleSort('fullname')}
                  order={sortOrder}
                >
                  Nama
                </TableHeader>

                {/* render when academic year selected */}
                {academicYearSelected ? <TableHeader>Status</TableHeader> : null}

                <TableHeader
                  filter={sortBy === 'birthdate'}
                  onClick={() => handleSort('birthdate')}
                  order={sortOrder}
                >
                  Umur
                </TableHeader>
                <TableHeader>Tempat Lahir</TableHeader>
                <TableHeader>Tanngal Lahir</TableHeader>
                <TableHeader>Nama Ayah</TableHeader>
                <TableHeader>Nama Ibu</TableHeader>
                <TableHeader>Nama Wali</TableHeader>
                <TableHeader>Alamat</TableHeader>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  id={student.id}
                  className="hover:bg-gray-700"
                  onDoubleClick={() => handleDoubleClick(student)}
                >
                  <TableData align={'center'}>{response.meta.page.from + index}</TableData>
                  <TableData align={'center'}>{student.nis}</TableData>
                  <TableData>{student.fullname}</TableData>

                  {academicYearSelected ? (
                    <TableData align={'center'}>
                      <StudentStatusBadge text={student.student_status} />
                    </TableData>
                  ) : null}

                  <TableData align={'center'}>{student.age}</TableData>
                  <TableData>{student.city_of_birth}</TableData>
                  <TableData>{student.birthdate}</TableData>
                  <TableData>{student.father_name}</TableData>
                  <TableData>{student.mother_name}</TableData>
                  <TableData>{student.guardian_name}</TableData>
                  <TableData>{student.address}</TableData>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NotFoundError data={'Daftar Santri'} />
        )}
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

export default PageBiodata;
