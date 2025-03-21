import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import TableContainer from "./TableContainer";
import TablePagination from "./TablePagination";
import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import { getData } from "../../../fetcher";
import Loading from "../Loading/Loading";
import ErrorServer from "../ErrorServer/ErrorServer";
import TableHeader from "./TableHeader";
import TableData from "./TableData";
import Helper from "../../../Helper";
import { statusOptions } from "../../../initialStates";
import NotFoundError from "../NotFoundError/NotFoundError";
import Search from "../Toolbar/Search";
import ToolbarItem from "../Toolbar/ToolbarItem";
import { DataFetch } from "../../../index";
import { useNavigate } from "react-router";

interface Student {
  id: string;
  nis: string;
  fullname: string;
  status: string;
  age: number;
  city_of_birth: string;
  birthdate: Date;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address: string;
}

interface error {
  status: number;
}

interface Query {
  filter: {
    academic_year_id: string | undefined;
    student_status: string;
  };
  page: {
    number: number;
    size: number;
  };
  sort: {
    by: string;
    order: string;
  };
  search: string;
}

function TabelBiodata() {
  const { academic_year_id } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [dataFetch, setDataFetch] = useState<DataFetch>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<error>({ status: 200 });
  const [query, setQuery] = useState<Query>({
    filter: {
      academic_year_id: academic_year_id,
      student_status: "",
    },
    page: {
      number: 1,
      size: 20,
    },
    sort: {
      by: "fullname",
      order: "asc",
    },
    search: "",
  });
  const navigate = useNavigate();
  const newStatusOptions = [
    { ...statusOptions[0], label: "Status" },
    ...statusOptions.slice(1),
  ];

  const {
    page: { number: pageNumber, size: pageSize },
    sort: { by: sortBy, order: sortOrder },
    filter: { student_status: studentStatus, academic_year_id: academic_year },
  } = query;

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        academic_year_id: academic_year_id,
        student_status: academic_year_id ? studentStatus : "",
      },
    }));
  }, [academic_year_id, studentStatus]);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `/api/admin/students?sort[by]=${sortBy}&sort[order]=${sortOrder}&page[number]=${pageNumber}&page[size]=${pageSize}&filter[academic_year_id]=${
          academic_year || ""
        }&filter[student_status]=${studentStatus}&search=${query.search}`;
        const resultData = await getData(url);
        console.log(resultData.data);

        if (resultData.error) {
          setError(resultData);
        } else {
          setDataFetch(resultData);
          setStudentFormated(resultData.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  /// helper function ///

  function setStudentFormated(data: []) {
    const result: Student[] = data.map((student) => {
      return Helper.formatStudentData(student);
    });
    setStudents(result);
  }

  /// handle event ///

  const handlePageNext = useCallback(async () => {
    if (dataFetch && dataFetch.links.next) {
      const result = await getData(dataFetch.links.next);

      if (result) {
        setDataFetch(result);
        setStudentFormated(result.data);
      }
    }
  }, [dataFetch]);

  const handlePagePrev = useCallback(async () => {
    if (dataFetch && dataFetch.links.prev) {
      const result = await getData(dataFetch.links.prev);
      if (result) {
        setDataFetch(result);
        setStudentFormated(result.data);
      }
    }
  }, [dataFetch]);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLElement).parentElement?.id;
    document.location.href = `${location.origin}/biodata/update?id=${id}`;
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery((prev) => ({
      ...prev,
      search: searchQuery,
    }));
  };

  const handleInputData = () => {
    navigate(`/biodata/input`);
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuery((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        student_status: e.target.value,
      },
    }));
  };

  const handleNameShort = async () => {
    setQuery((prev) => ({
      ...prev,
      sort: {
        by: "fullname",
        order: prev.sort.order === "asc" ? "desc" : "asc",
      },
    }));
  };

  const handleAgeShort = async () => {
    setQuery((prev) => ({
      ...prev,
      sort: {
        by: "birthdate",
        order: prev.sort.order === "asc" ? "desc" : "asc",
      },
    }));
  };

  /// conditional rendering ///
  if (loading) {
    return <Loading />;
  }

  if (error.status === 500) {
    return <ErrorServer />;
  }

  if (error && error.status && error.status >= 400 && error.status < 500) {
    return <NotFoundError data={"Daftar Santri"} />;
  }

  if (!students || !dataFetch) {
    return <Loading />;
  }

  console.log("students", students.length);

  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${dataFetch.meta.page.total} Santri`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        {/* render when academic year selected */}
        {academic_year_id && (
          <ToolbarItem
            icon={
              query.filter.student_status === "active"
                ? "check_circle"
                : query.filter.student_status === "graduate"
                ? "school"
                : query.filter.student_status === "dropout"
                ? "do_not_disturb_on"
                : "manage_accounts"
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
        <ToolbarItem icon="add" onClick={handleInputData}>
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
                  filter={sortBy === "fullname"}
                  onClick={handleNameShort}
                  order={sortOrder}
                >
                  Nama
                </TableHeader>

                {/* render when academic year selected */}
                {academic_year_id ? <TableHeader>Status</TableHeader> : null}

                <TableHeader
                  filter={sortBy === "birthdate"}
                  onClick={handleAgeShort}
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
                  onDoubleClick={handleDoubleClick}
                >
                  <TableData align={"center"}>
                    {dataFetch.meta.page.from + index}
                  </TableData>
                  <TableData align={"center"}>{student.nis}</TableData>
                  <TableData>{student.fullname}</TableData>

                  {/* render when academic year selected */}
                  {academic_year_id ? (
                    <TableData align={"center"}>{student.status}</TableData>
                  ) : null}

                  <TableData align={"center"}>{student.age}</TableData>
                  <TableData>{student.city_of_birth}</TableData>
                  <TableData>
                    {student.birthdate.toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableData>
                  <TableData>{student.father_name}</TableData>
                  <TableData>{student.mother_name}</TableData>
                  <TableData>{student.guardian_name}</TableData>
                  <TableData>{student.address}</TableData>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NotFoundError data={"Daftar Santri"} />
        )}
      </TableContainer>
      <TablePagination
        currentPage={dataFetch.meta.page.current_page}
        totalPages={dataFetch.meta.page.last_page}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TabelBiodata;
