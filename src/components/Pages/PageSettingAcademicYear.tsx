import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { Response, AcademicYear, DateStatus } from '../../../index';
import { initialResponse, initialAcademicYear } from '../../../initialStates';
import Badge from '../Badges/Badge';
import Helper from '../../../Helper';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import TableHeader from '../Table/TableHeader';
import SettingOptions from '../SettingOptions';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import InputAcademicYear from '../Form/Setting-AcademicYear/InputAcademicYear';
import UpdateAcademicYear from '../Form/Setting-AcademicYear/UpdateAcademicYear';
import TableContainer from '../Table/TableContainer';
import Table from '../Table/Table';
import TableHeadRow from '../Table/TableHeadRow';
import TableBodyRow from '../Table/TableBodyRow';

function PageSettingAcademicYear() {
  const [response, setResponse] = useState<Response>(initialResponse);
  const [isInputPopUpOpen, setIsInputPopUpOpen] = useState<boolean>(false);
  const [isUpdatePopUpOpen, setIsUpdatePopUpOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<AcademicYear>(initialAcademicYear); // prettier-ignore
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([initialAcademicYear]); // prettier-ignore

  const pageQuery = `page[number]=${1}&page[size]=${20}`;
  const sortQuery = `sort[by]=academic_year&sort[order]=desc`;
  const LINK = `/api/admin/academicyears?${pageQuery}&${sortQuery}`;

  async function fetchAcademicYears(URL: string) {
    const response = await getData(URL);
    setResponse(response);

    const academicYears = Helper.formatAcademicYears(response.data);
    setAcademicYears(academicYears);
  }

  useEffect(() => {
    fetchAcademicYears(LINK);
  }, []);

  const handlePagingation = async (url: string) => {
    fetchAcademicYears(url);
  };
  const handleDoubleClick = (data: AcademicYear) => {
    setSelectedData(data);
    setIsUpdatePopUpOpen(true);
  };
  const handleClose = () => {
    setIsUpdatePopUpOpen(false);
    setIsInputPopUpOpen(false);
    // refetch data after closing pop up
    fetchAcademicYears(LINK);
  };
  return (
    <ContentContainer direction="column">
      <UpdateAcademicYear
        isOpen={isUpdatePopUpOpen}
        setIsOpen={handleClose}
        selectedData={selectedData}
      />
      <InputAcademicYear isOpen={isInputPopUpOpen} setIsOpen={handleClose} />
      <ToolbarContainer>
        <SettingOptions selectedOption="academic-year" />
        <ToolbarItem icon="add" onClick={() => setIsInputPopUpOpen(true)}>
          Input Data
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <Table>
          <TableHeadRow>
            <TableHeader>No</TableHeader>
            <TableHeader>Tahun Ajaran</TableHeader>
            <TableHeader>Tanggal Awal</TableHeader>
            <TableHeader>Tanggal Akhir</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Kepala Madrasah</TableHeader>
          </TableHeadRow>
          <tbody>
            {academicYears.map((academicYear, index) => (
              <TableBodyRow
                key={academicYear.id}
                onDoubleClick={() => handleDoubleClick(academicYear)}
              >
                <TableData>{index + 1}</TableData>
                <TableData>{academicYear.academic_year}</TableData>
                <TableData>{Helper.toIndonesianDate(new Date(academicYear.start_date))}</TableData>
                <TableData>{Helper.toIndonesianDate(new Date(academicYear.end_date))}</TableData>
                <TableData>
                  <Badge
                    text={academicYear.status}
                    className={`text-white ${
                      academicYear.status === DateStatus.CURRENT
                        ? 'bg-green-500'
                        : academicYear.status === DateStatus.FUTURE
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </TableData>
                <TableData>{'Ust. ' + academicYear.head_master}</TableData>
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

export default PageSettingAcademicYear;
