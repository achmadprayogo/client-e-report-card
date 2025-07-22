import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { Response, DateStatus, QuarterAcademicYear } from '../../../index';
import { initialResponse, initialQuarterAcademicYear } from '../../../initialStates';
import Badge from '../Badges/Badge';
import Table from '../Table/Table';
import Helper from '../../../Helper';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import SettingOptions from '../SettingOptions';
import TableHeader from '../Table/TableHeader';
import TableBodyRow from '../Table/TableBodyRow';
import TableHeadRow from '../Table/TableHeadRow';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import TableContainer from '../Table/TableContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import InputQuarterAcademicYear from '../Form/Setting-QuarterAcademicYear/InputQuarterAcademicYear';
import UpdateQuarterAcademicYear from '../Form/Setting-QuarterAcademicYear/UpdateQuarterAcademicYear';

function PageSettingQuarterAcademicyear() {
  const [response, setResponse] = useState<Response>(initialResponse);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<QuarterAcademicYear>(initialQuarterAcademicYear); // prettier-ignore
  const [quarterAcademicYears, setQuarterAcademicYears] = useState<QuarterAcademicYear[]>([initialQuarterAcademicYear]); // prettier-ignore

  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const LINK = `/api/admin/quarter-academic-years?${pageQuery}&${sortQuery}`;

  async function fetchQuarterAcademicYears(URL: string) {
    const response = await getData(URL);
    setResponse(response);

    const quarterAcademicYears = Helper.formatQuarterAcademicYear(response.data, response.included);
    setQuarterAcademicYears(quarterAcademicYears);
  }

  useEffect(() => {
    fetchQuarterAcademicYears(LINK);
  }, []);

  const handlePagingation = async (url: string) => {
    fetchQuarterAcademicYears(url);
  };

  const handleDoubleClick = (data: QuarterAcademicYear) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };

  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setIsInputPopUpOpen(false);
    fetchQuarterAcademicYears(LINK);
  };

  return (
    <ContentContainer direction="column">
      <UpdateQuarterAcademicYear
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputQuarterAcademicYear isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <SettingOptions selectedOption="quarter-academic-year" />
        <ToolbarItem icon="add" onClick={() => setIsInputPopUpOpen(true)}>
          Input Data
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <Table>
          <TableHeadRow>
            <TableHeader>No</TableHeader>
            <TableHeader>Tahun Ajaran</TableHeader>
            <TableHeader>Cawu</TableHeader>
            <TableHeader>Tanggal Awal</TableHeader>
            <TableHeader>Tanggal Akhir</TableHeader>
            <TableHeader>KKM</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableHeadRow>
          <tbody>
            {quarterAcademicYears.map((quarter, index) => (
              <TableBodyRow key={quarter.id} onDoubleClick={() => handleDoubleClick(quarter)}>
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{quarter.academic_year}</TableData>
                <TableData>{quarter.quarter_academic_year}</TableData>
                <TableData>{Helper.toIndonesianDate(new Date(quarter.start_date))}</TableData>
                <TableData>{Helper.toIndonesianDate(new Date(quarter.end_date))}</TableData>
                <TableData>{quarter.score_standart}</TableData>
                <TableData>
                  <Badge
                    text={quarter.status}
                    className={`text-white ${
                      quarter.status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : quarter.status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`}
                  />
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
}

export default PageSettingQuarterAcademicyear;
