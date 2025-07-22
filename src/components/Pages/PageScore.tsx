import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { getData } from '../../../fetcher';
import { useEffect, useState } from 'react';
import { Response, Option, StudentScore, Subject } from '../../../index';
import { initialResponse, initialStudentScore } from '../../../initialStates';
import TableData from '../Table/TableData';
import Helper from '../../../Helper';
import Search from '../Toolbar/Search';
import TableHeader from '../Table/TableHeader';
import TablePagination from './Pagination';
import TableContainer from '../Table/TableContainer';
import OptionsInput from '../Form/OptionsInput';
import ToolbarItem from '../Toolbar/ToolbarItem';
import ContentContainer from '../ContentContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import ScoreUpdate from '../Form/Score/ScoreUpdate';

function PageScore() {
  const academicYearSelected = useParams().academic_year_id || '';
  const [search, setSearch] = useState<string>('');
  const [quarter, setQuarter] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradeClass, setGradeClass] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('fullname');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [quarterOptions, setQuarterOptions] = useState<Option[]>([]);
  const [studentScores, setStudentScores] = useState<StudentScore[]>([]);
  const [classNameOptions, setClassNameOptions] = useState<Option[]>([]);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>([]);
  const [responseFetch, setResponseFetch] = useState<Response>(initialResponse);
  const [isPageUpdateOpen, setIsPageUpdateOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<StudentScore>(initialStudentScore);

  const navigate = useNavigate();

  useEffect(() => {
    async function getDataScores() {
      const searchQuery = `search=${search}`;
      const pageQuery = `page[number]=${1}&page[size]=${20}`;
      const classNameQuery = `filter[class_name_id]=${className}`;
      const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
      const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
      const quarterQuery = `filter[quarter_academic_year_id]=${quarter}`;
      const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
      const URL = `/api/admin/class-member-scores?${pageQuery}&${searchQuery}&${academicYearQuery}&${quarterQuery}&${classNameQuery}&${gradeClassQuery}&${sortQuery}`;

      const response = await getData(URL);
      setResponseFetch(response);

      const result: StudentScore[] = Helper.formatScore(
        response.data,
        response.included,
      ) as StudentScore[];

      setStudentScores(result);

      // get subjects
      const subjects = Helper.getSubjects(response.included);
      setSubjects(subjects);
    }
    getDataScores();
  }, [academicYearSelected, gradeClass, className, quarter, search]);

  useEffect(() => {
    if (academicYearSelected !== '') {
      fetchGradeOptions();
      fetchQuarterOptions();
    }
  }, [academicYearSelected]);

  useEffect(() => {
    if (gradeClass !== '') {
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
        result.included,
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
        result.included,
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
  const handleDoubleClick = (data: StudentScore) => {
    console.log(data);
    setSelectedData(data);
    setIsPageUpdateOpen(true);
  };
  const handleClickInput = () => {
    navigate('/score/input');
  };

  return (
    <ContentContainer direction="column">
      <ScoreUpdate
        isOpen={isPageUpdateOpen}
        setIsOpen={() => setIsPageUpdateOpen(false)}
        selectedData={selectedData}
      />
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
                <TableHeader key={subject.id}>{Helper.capitalizeWords(subject.name)}</TableHeader>
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
                id={data.id + '#' + data.quarter_academic_year_id}
                className="hover:bg-gray-700"
                onDoubleClick={() => handleDoubleClick(data)}
              >
                <TableData>{index + responseFetch.meta.page.from}</TableData>
                <TableData>{data.nis}</TableData>
                <TableData>{data.fullname}</TableData>
                <TableData>{data.grade_class}</TableData>
                <TableData>{data.class_name}</TableData>
                <TableData>{'Ust. ' + data.homeroom_teacher}</TableData>
                <TableData>{data.quarter_academic_year}</TableData>
                <TableData>{data.quarter_standart_score}</TableData>
                {subjects.map((subject) => (
                  <TableData key={subject.id}>
                    {data.scores.find((score) => score.subject_id === subject.id)?.score}
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

  async function fetchGradeOptions() {
    let result = await Helper.getGradeClassOptions(academicYearSelected);
    result.pop();
    const options = Helper.setIndexOptionSelected(result, 1, true);
    setGradeClass(result[1].value);
    setGradeClassOptions(options);
  }
  async function fetchQuarterOptions() {
    let result = await Helper.getQuarterOptions(academicYearSelected);
    result.pop();
    result = [...result, { label: 'Semua', value: '' }];
    const options = Helper.setIndexOptionSelected(result, result.length - 1, true);
    setQuarterOptions(options);
  }
  async function fetchOptions() {
    const result = await Helper.getClassNameOptions(gradeClass);
    result.pop();
    setClassNameOptions([...result, { label: 'Semua', value: '' }]);
  }
}

export default PageScore;
