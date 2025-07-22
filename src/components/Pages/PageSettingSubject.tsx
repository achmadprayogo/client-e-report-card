import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { Response, DateStatus, Option, SubjectDetail } from '../../../index';
import { initialResponse, initialOptions, initialSubjectDetail } from '../../../initialStates';
import Table from '../Table/Table';
import Badge from '../Badges/Badge';
import Helper from '../../../Helper';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import SettingOptions from '../SettingOptions';
import TableHeader from '../Table/TableHeader';
import OptionsInput from '../Form/OptionsInput';
import ToolbarItem from '../Toolbar/ToolbarItem';
import TableHeadRow from '../Table/TableHeadRow';
import TableBodyRow from '../Table/TableBodyRow';
import ContentContainer from '../ContentContainer';
import TableContainer from '../Table/TableContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import InputSubject from '../Form/Setting-Subject/InputSubject';
import UpdateSubject from '../Form/Setting-Subject/UpdateSubject';

function PageSettingSubject() {
  const [response, setResponse] = useState<Response>(initialResponse);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<SubjectDetail>(initialSubjectDetail);
  const [subjects, setSubjects] = useState<SubjectDetail[]>([initialSubjectDetail]);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');
  const [gradeClassSelected, setGradeClassSelected] = useState<string>('');

  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const gradeClassQuery = `filter[grade_class_id]=${gradeClassSelected}`;
  const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
  const LINK = `/api/admin/subjects?${pageQuery}&${sortQuery}&${academicYearQuery}&${gradeClassQuery}`;

  async function fetchClassNames(URL: string) {
    const response = await getData(URL);
    setResponse(response);

    const classNames = Helper.formatSubjects(response.data, response.included);
    setSubjects(classNames);
  }

  async function getAcademicYearOptions() {
    const result: Option[] = await Helper.getAcademicYearOptions();
    setAcademicYearOptions([{ label: 'Semua', value: '' }, ...result.splice(1)]);
  }

  async function getGradeClassOptions() {
    let result = await Helper.getGradeClassOptions(academicYearSelected);
    result.shift();
    result = [{ label: 'Semua', value: '', selected: true }, ...result];
    setGradeClassOptions(result);
  }

  useEffect(() => {
    fetchClassNames(LINK);
    getAcademicYearOptions();
  }, [academicYearSelected, gradeClassSelected]);

  useEffect(() => {
    if (academicYearSelected) {
      getGradeClassOptions();
    }
  }, [academicYearSelected]);

  const handlePagingation = async (url: string) => {
    fetchClassNames(url);
  };
  const handleDoubleClick = (data: SubjectDetail) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };
  const handleAcademicYearOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAcademicYearSelected(e.target.value);
  };
  const handleGradeClassOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClassSelected(e.target.value);
  };
  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setIsInputPopUpOpen(false);
    fetchClassNames(LINK);
  };
  return (
    <ContentContainer direction="column">
      <UpdateSubject
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputSubject isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <SettingOptions selectedOption="subject" />
        <div className="flex flex-row gap-2">
          <ToolbarItem icon="">
            <p>TA.</p>
            <select
              onChange={handleAcademicYearOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={academicYearOptions} />
            </select>
          </ToolbarItem>
          <ToolbarItem icon="">
            <p>Tingkat : </p>
            <select
              onChange={handleGradeClassOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={gradeClassOptions} />
            </select>
          </ToolbarItem>
          <ToolbarItem icon="add" onClick={() => setIsInputPopUpOpen(true)}>
            Input Data
          </ToolbarItem>
        </div>
      </ToolbarContainer>
      <TableContainer>
        <Table>
          <TableHeadRow>
            <TableHeader>No</TableHeader>
            <TableHeader>Tahun Ajaran</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Tingkat</TableHeader>
            <TableHeader>Mata Pelajaran</TableHeader>
          </TableHeadRow>
          <tbody>
            {subjects.map((subject, index) => (
              <TableBodyRow key={subject.id} onDoubleClick={() => handleDoubleClick(subject)}>
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{subject.academic_year}</TableData>
                <TableData>
                  <Badge
                    text={subject.academic_year_status}
                    className={`text-white ${
                      subject.academic_year_status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : subject.academic_year_status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </TableData>
                <TableData>{subject.grade_class}</TableData>
                <TableData>{subject.subject_name}</TableData>
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
}

export default PageSettingSubject;
