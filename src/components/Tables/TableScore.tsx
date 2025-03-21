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
import { DataFetch, Options, StudentScore, Subject } from "../../../index";
import Helper from "../../../Helper";
import OptionsInput from "../Form/OptionsInput";
import { initialDataFetch } from "../../../initialStates";
import { useNavigate } from "react-router";

function TableScore() {
  const academicYearSelected = useParams().academic_year_id || "";
  const [gradeClassOptions, setGradeClassOptions] = useState<Options[]>([]);
  const [classNameOptions, setClassNameOptions] = useState<Options[]>([]);
  const [quarterOptions, setQuarterOptions] = useState<Options[]>([]);
  const [gradeClass, setGradeClass] = useState<string>("");
  const [quarter, setQuarter] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("fullname");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [search, setSearch] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentScores, setStudentScores] = useState<StudentScore[]>([]);
  const [responseFetch, setResponseFetch] = useState<DataFetch>(initialDataFetch); // prettier-ignore
  const navigate = useNavigate();

  useEffect(() => {
    async function getDataScores() {
      const pageQuery = `page[number]=${1}&page[size]=${20}`;
      const searchQuery = `search=${search}`;
      const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
      const classNameQuery = `filter[class_name_id]=${className}`;
      const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
      const quarterQuery = `filter[quarter_academic_year_id]=${quarter}`;
      const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
      const URL = `/api/admin/classmember-scores?${pageQuery}&${searchQuery}&${academicYearQuery}&${quarterQuery}&${classNameQuery}&${gradeClassQuery}&${sortQuery}`;
      const response = await getData(URL);
      setResponseFetch(response);

      const result: StudentScore[] = Helper.formatScore(
        response.data,
        response.included
      ) as StudentScore[];
      console.log(result[0], result[1], result[2]);
      setStudentScores(result);
      // get subjects
      const subjects = Helper.getSubjects(response.included);
      console.log(subjects);
      setSubjects(subjects);
    }
    getDataScores();
  }, [academicYearSelected, gradeClass, className, quarter, search]);

  useEffect(() => {
    async function fetchGradeOptions() {
      let result = await Helper.getGradeOptions(academicYearSelected);
      const options = Helper.setIndexOptionSelected(result, 1, true);

      setGradeClass(result[1].value);
      setGradeClassOptions(options);
    }
    async function fetchQuarterOptions() {
      let result = await Helper.getQuarterOptions(academicYearSelected);
      result = [...result, { label: "Semua", value: "" }];
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

  useEffect(() => {
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(gradeClass);
      setClassNameOptions([...result, { label: "Semua", value: "" }]);
    }
    if (gradeClass !== "") {
      fetchOptions();
    }
  }, [gradeClass]);

  const handleSearch = (search: string) => {
    setSearch(search);
  };

  const handlePageNext = async () => {
    const result = await getData(responseFetch.links.next);

    if (result) {
      setResponseFetch(result);
      const data: StudentScore[] = Helper.formatScore(
        result.data,
        result.included
      ) as StudentScore[];
      setStudentScores(data);
    }
  };

  const handlePagePrev = async () => {
    const result = await getData(responseFetch.links.prev);

    if (result) {
      setResponseFetch(result);
      const data: StudentScore[] = Helper.formatScore(
        result.data,
        result.included
      ) as StudentScore[];
      setStudentScores(data);
    }
  };
  const handleGradeClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClass(e.target.value);
  };
  const handleClassNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
  };
  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarter(e.target.value);
  };
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = (e.target as HTMLElement).parentElement?.id.split("#")[0];
    const quarterAcademicYearId = (
      e.target as HTMLElement
    ).parentElement?.id.split("#")[1];
    console.log(id);
    navigate(
      `/score/update?id=${id}&quarter_academic_year_id=${quarterAcademicYearId}`
    );
  };
  const handleClickInput = () => {
    navigate("/score/input");
  };

  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="description">{`${responseFetch.meta.page.total} Data Nilai`}</ToolbarItem>
        <Search onSearch={handleSearch} />
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
        <ToolbarItem icon="search_activity">
          <div className="flex flex-row space-x-2">
            <p>Cawu :</p>
            <select
              onChange={handleQuarterChange}
              name="class_name_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <OptionsInput options={quarterOptions} />
            </select>
          </div>
        </ToolbarItem>
        <ToolbarItem icon="add" onClick={handleClickInput}>
          Input Nilai
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader>Cawu</TableHeader>
              <TableHeader>KKM</TableHeader>
              {subjects.map((subject) => (
                <TableHeader key={subject.id}>
                  {Helper.capitalizeWords(subject.name)}
                </TableHeader>
              ))}
              <TableHeader>Total</TableHeader>
              <TableHeader>Rata-rata</TableHeader>
              <TableHeader>Peringkat</TableHeader>
            </tr>
          </thead>
          <tbody>
            {studentScores.map((data, index) => (
              <tr
                key={index}
                id={data.id + "#" + data.quarter_academic_year_id}
                className="hover:bg-gray-700"
                onDoubleClick={handleDoubleClick}
              >
                <TableData>{index + responseFetch.meta.page.from}</TableData>
                <TableData>{data.nis}</TableData>
                <TableData>{data.fullname}</TableData>
                <TableData>{data.grade_class}</TableData>
                <TableData>{data.class_name}</TableData>
                <TableData>{"Ust. " + data.homeroom_teacher}</TableData>
                <TableData>{data.quarter_academic_year}</TableData>
                <TableData>{data.MMC_score}</TableData>
                {subjects.map((subject) => (
                  <TableData key={subject.id}>
                    {
                      data.scores.find(
                        (score) => score.subject_id === subject.id
                      )?.score
                    }
                  </TableData>
                ))}
                <TableData>{data.total_score}</TableData>
                <TableData>{data.average_score}</TableData>
                <TableData>{data.rank}</TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={responseFetch.meta.page.current_page}
        totalPages={responseFetch.meta.page.last_page}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TableScore;
