import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { Response, DateStatus, ClassName, Option } from '../../../index';
import { initialResponse, initialClassName, initialOptions } from '../../../initialStates';
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
import InputClassName from '../Form/Setting-ClassName/InputClassName';
import UpdateClassName from '../Form/Setting-ClassName/UpdateClassName';

function PageSettingClassName() {
  const [response, setResponse] = useState<Response>(initialResponse);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ClassName>(initialClassName);
  const [classNames, setClassNames] = useState<ClassName[]>([initialClassName]);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');
  const [gradeClassSelected, setGradeClassSelected] = useState<string>('');

  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const gradeClassQuery = `filter[grade_class_id]=${gradeClassSelected}`;
  const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
  const LINK = `/api/admin/class-names?${pageQuery}&${sortQuery}&${academicYearQuery}&${gradeClassQuery}`;

  async function fetchClassNames(URL: string) {
    console.log('URL', URL);
    const response = await getData(URL);
    setResponse(response);

    const classNames = Helper.formatClassName(response.data, response.included);
    setClassNames(classNames);
  }

  async function getAcademicYearOptions() {
    const result: Option[] = await Helper.getAcademicYearOptions();
    setAcademicYearOptions([{ label: 'Semua', value: '' }, ...result.splice(1)]);
  }

  async function getGradeClassOptions() {
    let result = await Helper.getGradeClassOptions(academicYearSelected);
    result.shift();
    result = [{ label: 'Semua', value: '', selected: true }, ...result];
    console.log('result', result);
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
  const handleDoubleClick = (data: ClassName) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };
  const handleAcademicYearOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAcademicYearSelected(e.target.value);
  };
  const handleGradeClassOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('e.target.value', e.target.value);
    setGradeClassSelected(e.target.value);
  };
  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setIsInputPopUpOpen(false);
    fetchClassNames(LINK);
  };
  return (
    <ContentContainer direction="column">
      <UpdateClassName
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputClassName isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <SettingOptions selectedOption="class-name" />
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
            <TableHeader>Kelas</TableHeader>
            <TableHeader>Wali Kelas</TableHeader>
          </TableHeadRow>
          <tbody>
            {classNames.map((className, index) => (
              <TableBodyRow key={className.id} onDoubleClick={() => handleDoubleClick(className)}>
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{className.academic_year}</TableData>
                <TableData>
                  <Badge
                    text={className.academic_year_status}
                    className={`text-white ${
                      className.academic_year_status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : className.academic_year_status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </TableData>
                <TableData>{className.grade_class}</TableData>
                <TableData>{className.class_name}</TableData>
                <TableData>{className.homeroom_teacher}</TableData>
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

export default PageSettingClassName;
