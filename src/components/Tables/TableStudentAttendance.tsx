import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import ToolbarItem from "../Toolbar/ToolbarItem";
import Search from "../Toolbar/Search";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import TableData from "./TableData";
import TablePagination from "./TablePagination";
import { useEffect, useState } from "react";
import { getData } from "../../../fetcher";
import { useParams } from "react-router";
import { DataFetch, Options, AttendanceData } from "../../../index";
import Helper from "../../../Helper";
import OptionsInput from "../Form/OptionsInput";
import {
  initialDataFetch,
  initialOptions,
  initialAttendanceData,
} from "../../../initialStates";
import UpdateStudentAttendance from "../Form/StudentAttendance/UpdateStudentAttendance";

function TableStudentAttendance() {
  const academicYearSelected = useParams().academic_year_id || "";
  const [response, setResponse] = useState<DataFetch>(initialDataFetch);
  const [className, setClassName] = useState<string>("");
  const [gradeClass, setGradeClass] = useState<string>("");
  const [quarter, setQuarter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [gradeClassOptions, setGradeClassOptions] =
    useState<Options[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] =
    useState<Options[]>(initialOptions);
  const [quarterOptions, setQuarterOptions] =
    useState<Options[]>(initialOptions);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([
    initialAttendanceData,
  ]);
  const [selectedData, setSelectedData] = useState<AttendanceData>(
    initialAttendanceData
  );
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  async function fetchAttendance() {
    const pageQuery = `page[number]=${1}&page[size]=${20}`;
    const searchQuery = `search=${search}`;
    const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
    const classNameQuery = `filter[class_name_id]=${className}`;
    const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
    const quarterQuery = `filter[quarter_academic_year_id]=${quarter}`;
    const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
    const URL = `/api/admin/student-attendance?${pageQuery}&${searchQuery}&${academicYearQuery}&${quarterQuery}&${classNameQuery}&${gradeClassQuery}&${sortQuery}`;
    const response = await getData(URL);
    setResponse(response);
    const formatedData: AttendanceData[] = Helper.formatAttendanceData(
      response.data,
      response.included
    );
    setAttendanceData(formatedData);
  }
  useEffect(() => {
    fetchAttendance();
  }, [
    search,
    academicYearSelected,
    gradeClass,
    className,
    quarter,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    async function fetchGradeOptions() {
      let result = await Helper.getGradeOptions(academicYearSelected);
      result = [...result, { label: "Semua", value: "" }];
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setGradeClassOptions(options);
    }
    async function fetchQuarterOptions() {
      const result = await Helper.getQuarterOptions(academicYearSelected);
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setQuarterOptions(options);
    }
    if (academicYearSelected !== "") {
      fetchGradeOptions();
      fetchQuarterOptions();
    }
  }, [academicYearSelected]);

  const handleSearch = (search: string) => {
    setSearch(search);
  };
  const handleGradeClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClass(e.target.value);
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(e.target.value);
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setClassNameOptions(options);
    }
    if (e.target.value !== "") {
      fetchOptions();
    }
  };
  const handleClassNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
  };
  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarter(e.target.value);
  };
  const handleDoubleClick = (data: AttendanceData) => {
    setSelectedData(data);
    setIsOpenPopup(true);
  };
  const handlePagingation = async (url: string) => {
    const result = await getData(url);

    if (result) {
      setResponse(result);
      const data: AttendanceData[] = Helper.formatAttendanceData(
        result.data,
        result.included
      ) as AttendanceData[];
      setAttendanceData(data);
    }
  };
  const handlePopupClose = () => {
    setIsOpenPopup(false);
    fetchAttendance();
  };

  return (
    <ContentContainer direction="column">
      <UpdateStudentAttendance
        isOpen={isOpenPopup}
        selectedData={selectedData}
        setIsOpen={handlePopupClose}
      />
      <ToolbarContainer>
        <ToolbarItem icon="description">{`${response.meta.page.total} Data Absen`}</ToolbarItem>
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
                <select
                  onChange={handleClassNameChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={classNameOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="search_activity">
              <div className="flex flex-row space-x-2">
                <select
                  onChange={handleQuarterChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={quarterOptions} />
                </select>
              </div>
            </ToolbarItem>
          </>
        )}
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>Tahun Ajaran</TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader>Cawu</TableHeader>
              <TableHeader>Sakit</TableHeader>
              <TableHeader>Izin</TableHeader>
              <TableHeader>Tanpa Alasan</TableHeader>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr
                key={data.id}
                id={data.id}
                className="hover:bg-[#071f10]"
                onDoubleClick={() => handleDoubleClick(data)}
              >
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{data.academic_year}</TableData>
                <TableData>{data.nis}</TableData>
                <TableData>{data.fullname}</TableData>
                <TableData>{data.grade_class}</TableData>
                <TableData>{data.class_name}</TableData>
                <TableData>{"Ust. " + data.homeroom_teacher}</TableData>
                <TableData>{data.quarter_academic_year}</TableData>
                <TableData>{data.total_sicks}</TableData>
                <TableData>{data.total_permissions}</TableData>
                <TableData>{data.total_absences}</TableData>
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

export default TableStudentAttendance;
