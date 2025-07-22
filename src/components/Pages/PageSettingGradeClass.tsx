import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { Response, DateStatus, GradeClass, Option } from '../../../index';
import { initialResponse, initialGradeClass, initialOptions } from '../../../initialStates';
import Table from '../Table/Table';
import Badge from '../Badges/Badge';
import Helper from '../../../Helper';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import SettingOptions from '../SettingOptions';
import TableHeader from '../Table/TableHeader';
import ToolbarItem from '../Toolbar/ToolbarItem';
import TableHeadRow from '../Table/TableHeadRow';
import TableBodyRow from '../Table/TableBodyRow';
import ContentContainer from '../ContentContainer';
import TableContainer from '../Table/TableContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import InputGradeClass from '../Form/Setting-GradeClass/InputGradeClass';
import UpdateGradeClass from '../Form/Setting-GradeClass/UpdateGradeClass';
import OptionsInput from '../Form/OptionsInput';

function PageSettingGradeClass() {
  const [response, setResponse] = useState<Response>(initialResponse);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<GradeClass>(initialGradeClass);
  const [gradeClasses, setgradeClasses] = useState<GradeClass[]>([initialGradeClass]);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');

  const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const LINK = `/api/admin/grade-classes?${pageQuery}&${sortQuery}&${academicYearQuery}`;

  async function fetchgradeClasses(URL: string) {
    const response = await getData(URL);
    setResponse(response);

    const gradeClasses = Helper.formatGradeClass(response.data, response.included);
    setgradeClasses(gradeClasses);
  }

  async function getAcademicYearOption() {
    const result: Option[] = await Helper.getAcademicYearOptions();
    setAcademicYearOptions([{ label: 'Semua', value: '' }, ...result.splice(1)]);
  }

  useEffect(() => {
    fetchgradeClasses(LINK);
    getAcademicYearOption();
  }, [academicYearSelected]);

  const handlePagingation = async (url: string) => {
    fetchgradeClasses(url);
  };
  const handleDoubleClick = (data: GradeClass) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };
  const handleOptionsChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAcademicYearSelected(e.target.value);
  };
  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setIsInputPopUpOpen(false);
    fetchgradeClasses(LINK);
  };
  return (
    <ContentContainer direction="column">
      <UpdateGradeClass
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputGradeClass isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <SettingOptions selectedOption="grade-class" />
        <div className="flex flex-row gap-2">
          <ToolbarItem icon="">
            <p>TA.</p>
            <select
              onChange={handleOptionsChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={academicYearOptions} />
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
          </TableHeadRow>
          <tbody>
            {gradeClasses.map((grade, index) => (
              <TableBodyRow key={grade.id} onDoubleClick={() => handleDoubleClick(grade)}>
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{grade.academic_year}</TableData>
                <TableData>
                  <Badge
                    text={grade.academic_year_status}
                    className={`text-white ${
                      grade.academic_year_status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : grade.academic_year_status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </TableData>
                <TableData>{grade.grade_class}</TableData>
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

export default PageSettingGradeClass;
