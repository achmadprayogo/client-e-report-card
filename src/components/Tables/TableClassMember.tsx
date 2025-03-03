import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import ToolbarItem from "../Toolbar/ToolbarItem";
import Search from "../Toolbar/Search";
import TablePagination from "./TablePagination";
import TableData from "./TableData";
import NotFoundError from "../NotFoundError/NotFoundError";
import Loading from "../Loading/Loading";
import {
  statusOptions,
  initialOptions,
  initialDataFetch,
} from "../../../initialStates";
import { useParams, useNavigate } from "react-router";
import { useCallback, useEffect } from "react";
import { getData } from "../../../fetcher";
import { useState } from "react";
import { StudentStatus, ClassMember, DataFetch, Options } from "../../../index";
import ErrorServer from "../ErrorServer/ErrorServer";
import Helper from "../../../Helper";
import OptionsInput from "../Form/OptionsInput";

function TableClassMember() {
  const [classMemeber, setClassMember] = useState<ClassMember[]>([]);
  const [statusResponse, setStatusResponse] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFetch, setDataFetch] = useState<DataFetch>(initialDataFetch);
  const [studentStatus, setStudentStatus] = useState<StudentStatus | string>(""); // prettier-ignore
  const [search, setSearch] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [classNameOptions, setClassNameOptions] =
    useState<Options[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] =
    useState<Options[]>(initialOptions);
  const [gradeClass, setGradeClass] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("fullname");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const academicYearSelected = useParams().academic_year_id || "";
  const newStatusOptions = [
    { ...statusOptions[0], label: "Status" },
    ...statusOptions.slice(1),
  ];

  const navigate = useNavigate();

  useEffect(() => {
    setClassName("");
    setGradeClass("");
    async function fetchOptions() {
      const result = await Helper.getGradeOptions(academicYearSelected);
      setGradeClassOptions([...result, { label: "Semua", value: "" }]);
    }
    if (academicYearSelected !== "") {
      fetchOptions();
    }
  }, [academicYearSelected]);

  useEffect(() => {
    setClassName("");
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(gradeClass);
      setClassNameOptions([...result, { label: "Semua", value: "" }]);
    }
    if (gradeClass !== "") {
      fetchOptions();
    }
  }, [gradeClass]);

  useEffect(() => {
    async function fetchData() {
      const pageQuery = `page[number]=${1}&page[size]=${20}`;
      const searchQuery = `search=${search}`;
      const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
      const studentStatusQuery = `filter[student_status]=${studentStatus}`;
      const classNameQuery = `filter[class_name_id]=${className}`;
      const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
      const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;

      const URL = `/api/admin/classmember?${pageQuery}&${academicYearQuery}&${studentStatusQuery}&${classNameQuery}&${gradeClassQuery}&${searchQuery}&${sortQuery}`; // prettier-ignore

      const result = await getData(URL);
      console.log(result.data.data);
      setDataFetch(result);
      const formatedData: ClassMember[] = result.data.data.map(
        (member: any): ClassMember => {
          return Helper.formatClassMember(member);
        }
      );

      setClassMember(formatedData);
      setIsLoading(false);
    }

    fetchData();
  }, [
    academicYearSelected,
    studentStatus,
    search,
    className,
    gradeClass,
    sortBy,
    sortOrder,
  ]);

  const handlePageNext = useCallback(async () => {
    if (dataFetch.links.next !== "") {
      const result = await getData(dataFetch.links.next);

      if (result) {
        setDataFetch(result);
        const formatedData: ClassMember[] = result.data.data.map(
          (member: any): ClassMember => {
            return Helper.formatClassMember(member);
          }
        );

        setClassMember(formatedData);
      }
    }
  }, [dataFetch]);

  const handlePagePrev = useCallback(async () => {
    if (dataFetch.links.prev !== "") {
      const result = await getData(dataFetch.links.prev);
      if (result) {
        setDataFetch(result);

        const formatedData: ClassMember[] = result.data.data.map(
          (member: any): ClassMember => {
            return Helper.formatClassMember(member);
          }
        );

        setClassMember(formatedData);
      }
    }
  }, [dataFetch]);

  const handleStudentStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const id = (e.target as HTMLElement).parentElement?.id;
    navigate(`/classmember/update?id=${id}`);
  };

  if (statusResponse === 404) {
    return <NotFoundError data={"kelas"} />;
  }

  if (statusResponse === 500) {
    return <ErrorServer />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${dataFetch.meta.page.total} Santri`}</ToolbarItem>
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
            studentStatus === "active"
              ? "check_circle"
              : studentStatus === "graduate"
              ? "school"
              : studentStatus === "dropout"
              ? "do_not_disturb_on"
              : "manage_accounts"
          }
        >
          <div>
            <select
              onChange={handleStudentStatusChange}
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
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader
                filter={sortBy == "academic_year"}
                order={sortOrder}
                onClick={() => handleSort("academic_year")}
              >
                Tahun Ajaran
              </TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader
                filter={sortBy === "fullname"}
                order={sortOrder}
                onClick={() => handleSort("fullname")}
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
                onDoubleClick={handleDoubleClick}
              >
                <TableData>{dataFetch.meta.page.from + index}</TableData>
                <TableData>{member.academic_year}</TableData>
                <TableData>{member.nis}</TableData>
                <TableData>{member.fullname}</TableData>
                <TableData>
                  {member.student_status === "active"
                    ? "Aktif"
                    : member.student_status === "dropout"
                    ? "Boyong"
                    : member.student_status === "graduate"
                    ? "Lulus"
                    : "-"}
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
        currentPage={dataFetch.meta.page.currentPage}
        totalPages={dataFetch.meta.page.lastPage}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TableClassMember;
